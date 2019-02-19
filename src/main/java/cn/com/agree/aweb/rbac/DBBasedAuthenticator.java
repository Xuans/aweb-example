package cn.com.agree.aweb.rbac;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.EncoderConstants;
import cn.com.agree.aweb.asapi.Randomizer;
import cn.com.agree.aweb.asapi.StringUtilities;
import cn.com.agree.aweb.asapi.errors.AuthenticationCredentialsException;
import cn.com.agree.aweb.asapi.errors.AuthenticationException;
import cn.com.agree.aweb.asapi.errors.EncryptionException;
import cn.com.agree.aweb.asapi.reference.AbstractAuthenticator;
import cn.com.agree.aweb.asapi.util.PasswordEncoderUtils;
import cn.com.agree.aweb.common.spring.SpringContextHolder;
import cn.com.agree.aweb.rbac.entity.RoleVO;
import cn.com.agree.aweb.rbac.entity.UserToRoleVO;
import cn.com.agree.aweb.rbac.entity.UserVO;
import cn.com.agree.aweb.rbac.service.DBBasedService;

/**
 * 
 * 基于数据库的认证授权实现
 * 
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
public class DBBasedAuthenticator extends AbstractAuthenticator<DefaultUser> {

    private static volatile DBBasedAuthenticator singletonInstance;
    private static final Logger logger = LoggerFactory.getLogger(DBBasedAuthenticator.class);

    public static AbstractAuthenticator<DefaultUser> getInstance()
    {
        if ( singletonInstance == null ) {
            synchronized ( DBBasedAuthenticator.class ) {
                if ( singletonInstance == null ) {
                    singletonInstance = new DBBasedAuthenticator();
                }
            }
        }
        return singletonInstance;
    }
    
    /** 从spring中获取数据库操作的对象 */
     private DBBasedService dbBasedService;
    
    public DBBasedAuthenticator() {
        this.dbBasedService =  SpringContextHolder.getBean(DBBasedService.class);
    }
    
    @Override
    public boolean verifyPassword(DefaultUser user, String password) {
        try {
            String currentHashedPassword = hashPassword(password, user.getUsername());
            //采用PasswordEncoderUtils.equals代替Object中的equals
            if (PasswordEncoderUtils.equals(currentHashedPassword,  user.getHashedPassword())) {
                return true;
            }
        } catch (EncryptionException e) {
            logger.error(e.getMessage(), e);
        }
        return false;
    }

    @Override
    public String genarateStrongPassword() {
        return generateStrongPassword("");
    }

    @Override
    public String generateStrongPassword(String oldPassword) {
        Randomizer r = ASAPI.randomizer();
        int letters = r.getRandomInteger(4, 6);
        int digits = 7 - letters;
        String passLetters = r.getRandomString(letters, EncoderConstants.CHAR_PASSWORD_LETTERS);
        String passDigits = r.getRandomString(digits, EncoderConstants.CHAR_PASSWORD_DIGITS);
        String passSpecial = r.getRandomString(1, EncoderConstants.CHAR_PASSWORD_SPECIALS);
        String newPassword = passLetters + passSpecial + passDigits;
        if (StringUtilities.getLevenshteinDistance(oldPassword, newPassword) > 5) {
            return newPassword;
        }
        return generateStrongPassword(oldPassword);
    }

    @Override
    public void changePassword(DefaultUser user, String oldPassword,
            String newPassword, String repeatNewPassword)
            throws AuthenticationException {
        
        if (verifyPassword(user, oldPassword)) {
            if (newPassword.equals(repeatNewPassword)) {
                String hashedNewPassword;
                try {
                    hashedNewPassword = hashPassword(newPassword, user.getUsername());
                    user.getUserVO().setPassword(hashedNewPassword);
                    user.getUserVO().setUpdateTime(new Date());
                    
                    ASAPI.authenticator().saveUser(user);
                } catch (EncryptionException e) {
                    throw new AuthenticationException("修改密码失败，密码加密时时出现异常", 
                            "用户[" + user.getUsername() + "]修改密码失败，加解密异常", e);
                }
            } else {
                throw new AuthenticationException("修改密码失败，两次输入密码不一致", 
                        "用户[" + user.getUsername() + "]修改密码失败，两次输入密码不一致");
            }
        } else {
            throw new AuthenticationException("修改密码失败，原密码验证失败", 
                    "用户[" + user.getUsername() + "]修改密码失败，原密码验证失败");
        }
    }

    @Override
    public DefaultUser getUser(long accountId) {
        DefaultUser user = null;
        
        try {
            UserVO userVO = dbBasedService.findUserById(accountId);
            user = createUser(userVO);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return user;
    }

    @Override
    public DefaultUser getUser(String accountName) {
        DefaultUser user = null;
        
        try {
            List<UserVO> userVOList =dbBasedService.findUserByUsername(accountName);
            if (userVOList.size() == 1) {
                user = createUser(userVOList.get(0));
                
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return user;
    }
    
    /**
     * 创建用户
     * @param userVO
     * @return
     * @throws AuthenticationException 
     */
    private DefaultUser createUser(UserVO userVO) throws AuthenticationException {
        DefaultUser user = new DefaultUser(userVO);
        
        if (userVO.getFailedLoginCount() >= 
                ASAPI.securityConfiguration().getAllowedLoginAttempts()) {
            user.lock();
        }
        
        assignUserRoles(user);
        
        return user;
    }

    /**
     * 为用户分配权限
     * @param user
     * @throws AuthenticationException 
     */
    private void assignUserRoles(DefaultUser user) throws AuthenticationException {
        try {
            List<UserToRoleVO> userToRoleVOList = dbBasedService.findUserRoleByUserId(user.getUserId());
            
            List<RoleVO> activeRoleList = new ArrayList<RoleVO>();
            for (int i = 0, size = userToRoleVOList.size(); i < size; i++) {
                UserToRoleVO userToRoleVO = userToRoleVOList.get(i);
                
                activeRoleList.add(userToRoleVO.getRole());
                
                user.addRole(userToRoleVO.getRole().getRoleId());
            }
            
        } catch (DataAccessException e) {
            throw new AuthenticationException("创建用户失败，分配角色时出现异常", 
                    "创建用户失败，分配角色时出现异常", e);
        }
    }

    @Override
    public String hashPassword(String password, String accountName)
            throws EncryptionException {
        return ASAPI.encryptor().hash(password, accountName);
    }

    /**
     * 保存用户数据到DB
     */
    @Override
    public void saveUser(DefaultUser user) {
        try {
        	dbBasedService.saveUser(user.getUserVO());
        } catch (DataAccessException e) {
            logger.info(e.getMessage(), e);
        }
    }
    
    /* 
     * 登陆操作：
     * 登陆调用：ASAPI.authenticator().login(getRequest(), getResponse());
     * @see cn.com.agree.aweb.asapi.reference.AbstractAuthenticator#login(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    public DefaultUser login(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        
        DefaultUser user = loginWithAccountNameAndPassword(request);
        
        user.setLastHostAddress(request.getRemoteAddr());
        
        HttpSession session = request.getSession();
        // user.bindSession(session);
        session.setAttribute(USER, user);
        setCurrentUser(user);
        
        return user;
    }
    
    
    /**
     * 通过用户名和密码，进行用户操作
     * @param request
     * @return
     * @throws AuthenticationException 
     */
    private DefaultUser loginWithAccountNameAndPassword(HttpServletRequest request) throws AuthenticationException {
        
        String usernameParameterName = ASAPI.securityConfiguration().getUsernameParameterName();
        String passwordParameterName = ASAPI.securityConfiguration().getPasswordParameterName();
        
        if (usernameParameterName == null || "".equals(usernameParameterName)) {
            usernameParameterName = USERNAME;
        }
        
        if (passwordParameterName == null || "".equals(passwordParameterName)) {
            passwordParameterName = PASSWORD;
        }
        
        String username = request.getParameter(usernameParameterName);
        String password = request.getParameter(passwordParameterName);

        //限制用户名非空，并去掉前后空格
        if(username == null || "".equals(username)){
            throw new AuthenticationCredentialsException("登陆失败，用户名或密码错误", "用户名为空！");
        }
        username = username.trim();
        
        DefaultUser user = getUser(username);
        if (user == null) {
            throw new AuthenticationCredentialsException("登陆失败，用户名或密码错误", "用户[" + username + "]不存在");
        }
        
        user.loginWithPassword(password);

        return user;
    }

}
