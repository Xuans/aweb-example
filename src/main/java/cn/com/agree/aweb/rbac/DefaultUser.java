package cn.com.agree.aweb.rbac;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpSession;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.EncoderConstants;
import cn.com.agree.aweb.asapi.HTTPUtilities;
import cn.com.agree.aweb.asapi.User;
import cn.com.agree.aweb.asapi.errors.AuthenticationException;
import cn.com.agree.aweb.rbac.entity.UserVO;

/**
 * 默认用户实现 IUser和ISecureUser接口的框架实现
 * 
 * @author lihao lihao01@agree.com.cn
 * @date Aug 15, 2016
 * @version 3.0
 */
public class DefaultUser implements User {

    private static final long serialVersionUID = 1755487938477277729L;

    /** 对抗CSRF攻击的token */
    private String csrfToken;

    /** 是否已锁定 */
    private boolean locked;

    /** 是否登陆状态 */
    private boolean loggedIn;

    /** 跟当前用户相关联的session */
    // private HttpSession session;

    /** hibernate实体中的用户信息 */
    private UserVO userVO;

    /** 用户拥有的角色 */
    private Set<String> roles = new HashSet<String>();

    public DefaultUser(UserVO userVO) {
        this.userVO = userVO;
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#getCSRFToken()
     */
    @Override
    public String getCSRFToken() {
        return this.csrfToken;
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#resetCSRFToken()
     */
    @Override
    public String resetCSRFToken() {
        this.csrfToken = ASAPI.randomizer().getRandomString(8, EncoderConstants.CHAR_ALPHANUMERICS);
        ;
        return this.csrfToken;
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#getFailedLoginCount()
     */
    @Override
    public int getFailedLoginCount() {
        return this.userVO.getFailedLoginCount();
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#setFailedLoginCount(int)
     */
    @Override
    public void setFailedLoginCount(int failedLoginCount) {
        this.userVO.setFailedLoginCount(failedLoginCount);
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#incrementFailedLoginCount()
     */
    @Override
    public void incrementFailedLoginCount() {
        setFailedLoginCount(getFailedLoginCount() + 1);
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#isLocked()
     */
    @Override
    public boolean isLocked() {
        return this.locked;
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#lock()
     */
    @Override
    public void lock() {
        this.locked = true;
    }

    /*
     * @see cn.com.agree.aweb.security.ISecureUser#unlock()
     */
    @Override
    public void unlock() {
        this.locked = false;
        this.userVO.setFailedLoginCount(0);
    }

    @Override
    public HashMap<?, ?> getSecureEventMap() {
        return null;
    }

    /*
     * @see cn.com.agree.aweb.security.User#changePassword(java.lang.String,
     * java.lang.String, java.lang.String)
     */
    @Override
    public void changePassword(String oldPassword, String newPassword, String repeatNewPassword)
            throws AuthenticationException {

        ASAPI.authenticator().changePassword(this, oldPassword, newPassword, repeatNewPassword);
    }

    @Override
    public boolean isSessionAbsoluteTimeout() {
        return false;
    }

    /*
     * @see cn.com.agree.aweb.security.User#isSessionTimeout()
     */
    @Override
    public boolean isSessionTimeout() {
        HttpSession session = ASAPI.httpUtilities().getCurrentRequest().getSession(false);

        return session == null;
    }

    /*
     * @see cn.com.agree.aweb.security.User#loginWithPassword(java.lang.String)
     */
    @Override
    public void loginWithPassword(String password) throws AuthenticationException {

        if (isLocked()) {
            setLastFailedLoginTime(new Date());
            incrementFailedLoginCount();
            throw new AuthenticationException("登陆失败，用户已被锁定", "用户[" + this.getUsername() + "]已被锁定");
        }

        if (verifyPassword(password)) {
            this.loggedIn = true;
            ASAPI.authenticator().setCurrentUser(this);
            ASAPI.httpUtilities().changeSessionIdentifier(ASAPI.currentRequest());
            setLastLoginTime(new Date());
            setLastHostAddress(ASAPI.httpUtilities().getCurrentRequest().getRemoteAddr());
            setFailedLoginCount(0);

            ASAPI.authenticator().saveUser(this);
        } else {
            this.loggedIn = false;
            setLastFailedLoginTime(new Date());
            incrementFailedLoginCount();

            if (getFailedLoginCount() >= ASAPI.securityConfiguration().getAllowedLoginAttempts()) {
                lock();
            }
            ASAPI.authenticator().saveUser(this);

            throw new AuthenticationException("登陆失败，用户名或密码错误", "登陆失败，用户[" + this.getUsername() + "]输入的密码错误");
        }
    }

    /*
     * @see cn.com.agree.aweb.security.User#logout()
     */
    @Override
    public void logout() {
        HttpSession session = ASAPI.httpUtilities().getCurrentRequest().getSession(false);
        if (session != null) {
            // unbindSession();
            session.invalidate();
        }
        // 清理JSESSIONID字段
        ASAPI.httpUtilities().killCookie(ASAPI.httpUtilities().getCurrentRequest(),
                ASAPI.httpUtilities().getCurrentResponse(), ASAPI.securityConfiguration().getHttpSessionIdName());

        // 清理CSRFTOKEN字段
        ASAPI.httpUtilities().killCookie(ASAPI.httpUtilities().getCurrentRequest(),
                ASAPI.httpUtilities().getCurrentResponse(), HTTPUtilities.CSRF_TOKEN_NAME);

        this.loggedIn = false;
        ASAPI.authenticator().setCurrentUser(null);
    }

    /*
     * @see cn.com.agree.aweb.security.User#isLoggedIn()
     */
    @Override
    public boolean isLoggedIn() {
        return this.loggedIn;
    }

    /*
     * @see cn.com.agree.aweb.security.User#verifyPassword(java.lang.String)
     */
    @Override
    public boolean verifyPassword(String password) {
        return ASAPI.authenticator().verifyPassword(this, password);
    }

    /*
     * @see cn.com.agree.aweb.asapi.User#getUserId()
     */
    @Override
    public String getUserId() {
        return this.userVO.getUserId();
    }

    /*
     * @see cn.com.agree.aweb.security.User#getUsername()
     */
    @Override
    public String getUsername() {
        return this.userVO.getUsername();
    }

    /*
     * @see cn.com.agree.aweb.security.User#getScreenName()
     */
    @Override
    public String getScreenName() {
        return this.userVO.getNickname();
    }

    /*
     * @see cn.com.agree.aweb.security.User#getLastHostAddress()
     */
    @Override
    public String getLastHostAddress() {
        return this.userVO.getLastHostAddress();
    }

    /*
     * @see cn.com.agree.aweb.security.User#getLastLoginTime()
     */
    @Override
    public Date getLastLoginTime() {
        return this.userVO.getLastLoginTime();
    }

    /*
     * @see cn.com.agree.aweb.security.User#getLastFailedLoginTime()
     */
    @Override
    public Date getLastFailedLoginTime() {
        return this.userVO.getLastFailedLoginTime();
    }

    /*
     * @see cn.com.agree.aweb.security.User#getHashedPassword()
     */
    @Override
    public String getHashedPassword() {
        return this.userVO.getPassword();
    }

    /*
     * @see cn.com.agree.aweb.asapi.User#setUserId(java.lang.String)
     */
    @Override
    public void setUserId(String userId) {
        this.userVO.setUserId(userId);
    }

    /*
     * @see cn.com.agree.aweb.security.User#setUsername(java.lang.String)
     */
    @Override
    public void setUsername(String username) {
        this.userVO.setUsername(username);
    }

    /*
     * @see cn.com.agree.aweb.security.User#setScreenName(java.lang.String)
     */
    @Override
    public void setScreenName(String screenName) {
        this.userVO.setNickname(screenName);
    }

    /*
     * @see cn.com.agree.aweb.security.User#setLastHostAddress(java.lang.String)
     */
    @Override
    public void setLastHostAddress(String remoteHost) {
        this.userVO.setLastHostAddress(remoteHost);
    }

    @Override
    public void setLastLoginTime(Date lastLoginTime) {
        this.userVO.setLastLoginTime(lastLoginTime);
    }

    /*
     * @see
     * cn.com.agree.aweb.security.User#setLastFailedLoginTime(java.util.Date)
     */
    @Override
    public void setLastFailedLoginTime(Date lastFailedLoginTime) {
        this.userVO.setLastFailedLoginTime(lastFailedLoginTime);
    }

    /*
     * @see cn.com.agree.aweb.security.User#setHashedPassword(java.lang.String)
     */
    @Override
    public void setHashedPassword(String hashedPassword) {
        this.userVO.setPassword(hashedPassword);
    }

    /*
     * @see cn.com.agree.aweb.asapi.User#isFirstSignOn()
     */
    @Override
    public boolean isFirstSignOn() {
        return this.getUserVO().getUpdateTime() == null;
    }

    /**
     * 返回用户VO
     * 
     * @return
     */
    public UserVO getUserVO() {
        return this.userVO;
    }

    /*
     * @see cn.com.agree.aweb.asapi.AuthenticUser#addRole(java.lang.String)
     */
    @Override
    public void addRole(String role) throws AuthenticationException {
        if (this.roles.contains(role)) {
            return;
        }

        this.roles.add(role);
    }

    /*
     * @see cn.com.agree.aweb.asapi.AuthenticUser#addRoles(java.util.Set)
     */
    @Override
    public void addRoles(Set<String> newRoles) throws AuthenticationException {
        this.roles.addAll(newRoles);
    }

    /*
     * @see cn.com.agree.aweb.asapi.AuthenticUser#getRoles()
     */
    @Override
    public Set<String> getRoles() {
        return this.roles;
    }

    /*
     * @see cn.com.agree.aweb.asapi.AuthenticUser#isInRole(java.lang.String)
     */
    @Override
    public boolean isInRole(String role) {
        return this.roles.contains(role);
    }

    /*
     * @see cn.com.agree.aweb.asapi.AuthenticUser#removeRole(java.lang.String)
     */
    @Override
    public void removeRole(String role) throws AuthenticationException {
        this.roles.remove(role);
    }

}
