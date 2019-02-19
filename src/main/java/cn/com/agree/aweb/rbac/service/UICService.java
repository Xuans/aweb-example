package cn.com.agree.aweb.rbac.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.errors.EncryptionException;
import cn.com.agree.aweb.pa.hibernate.HibernateRepository;
import cn.com.agree.aweb.pa.hibernate.param.Parameters;
import cn.com.agree.aweb.pa.hibernate.param.Parameters.Builder;
import cn.com.agree.aweb.rbac.entity.RoleVO;
import cn.com.agree.aweb.rbac.entity.UserToRoleVO;
import cn.com.agree.aweb.rbac.entity.UserVO;


/**
 * 
 * 用户信息中心服务层
 * 
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
@Service(value="uicService")
public class UICService {
    
    //默认初始密码
    public final static String DEFAULT_PASSWORD = "111111";
    
    //编辑用户时是否重置为初始密码
    public final static String INIT_PASSWORD_TAG = "1";
    
    @Autowired
    private HibernateRepository repository;

    

    /**
     * 所有用户列表
     * @return
     * @throws DataAccessException 
     */
    public List<UserVO> listAllUsers() throws DataAccessException {
    	
        return repository.loadAll(UserVO.class);
    }

    /**
     * 所有角色列表
     * @return
     * @throws DataAccessException 
     */
    public List<RoleVO> listAllRoles() throws DataAccessException {
        return repository.loadAll(RoleVO.class);
    }
    
    /**
     * 角色用户关联列表
     * @return
     * @throws DataAccessException 
     */
    public List<UserToRoleVO> listUtrById(UserVO user) throws DataAccessException {
    	Parameters parameters = Parameters.parametersBuilder().put("user", user).build();
        List<UserToRoleVO> userToRoleVOList = repository.findByHql(" from UserToRoleVO where user =:user", parameters);
        return userToRoleVOList;
    }

    /**
     * 根据用户名查询用户
     * @param username
     * @return
     * @throws DataAccessException 
     */
    public UserVO queryUserByUsername(String username) throws DataAccessException {
    	Parameters parameters = Parameters.parametersBuilder().put("username", username).build();
        List<UserVO> userList = repository.findByHql(" from UserVO where username =:username ", parameters);
        if (userList.size() == 1) {
            return userList.get(0);
        } 

        return null;
    }
    
    /**
     * 添加新用户
     * @param userVO
     * @param createUsername 
     * @throws DataAccessException
     * @throws EncryptionException 
     */
    
    @Transactional(readOnly=false)
    public void addUser(UserVO userVO, String createUsername) throws DataAccessException, EncryptionException {
        UserVO newUser = new UserVO();

        String encPassword = ASAPI.authenticator().hashPassword(DEFAULT_PASSWORD, userVO.getUsername());

        newUser.setUsername(userVO.getUsername());
        newUser.setNickname(userVO.getNickname());
        newUser.setPassword(encPassword);
        newUser.setMailbox(userVO.getMailbox());
        newUser.setTelephone(userVO.getTelephone());
        newUser.setUserType(userVO.getUserType());
        newUser.setCreateUser(createUsername);
        newUser.setCreateTime(new Date());
        newUser.setRemark(userVO.getRemark());
        newUser.setFailedLoginCount(0);
        repository.saveOrUpdate(newUser);
    }
    
    /**
     * 编辑用户
     * @param oldUserVO
     * @param newUserVO
     * @param initPassword
     * @throws DataAccessException 
     * @throws EncryptionException 
     */
    
    @Transactional(readOnly=false)
    public void updateUser(UserVO oldUserVO, UserVO newUserVO,
            String initPassword) throws DataAccessException, EncryptionException {

        oldUserVO.setUserType(newUserVO.getUserType());
        oldUserVO.setNickname(newUserVO.getNickname());
        oldUserVO.setMailbox(newUserVO.getMailbox());
        oldUserVO.setTelephone(newUserVO.getTelephone());
        oldUserVO.setRemark(newUserVO.getRemark());
        //避免影响到首次登陆的用户
        if (oldUserVO.getUpdateTime() != null) {
            oldUserVO.setUpdateTime(new Date());
        }
        
        if (INIT_PASSWORD_TAG.equals(initPassword)) {
            oldUserVO.setPassword(ASAPI.authenticator().hashPassword(DEFAULT_PASSWORD, newUserVO.getUsername()));
        }
        repository.saveOrUpdate(oldUserVO);
    }
    
    /**
     * 根据username list，查询所有UserVO
     * @param ids
     * @return
     * @throws DataAccessException
     */
    public List<UserVO> queryUsersByUsernames(List<String> ids) throws DataAccessException {
    	Parameters parameters = Parameters.parametersBuilder().put("username", ids).build();
        List<UserVO> userVOs = repository.findByHql(" from UserVO where username in (:username) ", parameters);
        return userVOs;
    }
    
    
    
    /**
     * 删除用户以及关联的权限
     * @param userVOs
     * @throws DataAccessException
     */
    
    @Transactional(readOnly=false)
    public void deleteUsersAndCtxRolesByUserVOs(List<UserVO> userVOs) throws DataAccessException {
    	Parameters parameters = Parameters.parametersBuilder().put("user", userVOs).build();
    	repository.executeUpdateByHql(" delete from UserToRoleVO where user in(:user)", parameters);
    	repository.deleteAll(userVOs);
    }
    
    /**
     * 删除单个用户以及关联的权限
     * @param userVO
     * @throws DataAccessException
     */
    @Transactional(readOnly=false)
    public void deleteSingleUserAndCtxRolesByUserVO(UserVO userVO) throws DataAccessException {
        Parameters parameters = Parameters.parametersBuilder().put("user", userVO).build();
        repository.executeUpdateByHql(" delete from UserToRoleVO where user in(:user)", parameters);
        repository.delete(userVO);
    }
    
    /**
     * 获取用户已有的角色
     * @param userID
     * @return
     * @throws DataAccessException
     */
    public List<UserToRoleVO> listUserRelevanceRoles(String userId) throws DataAccessException{
        UserVO user = querySingleUserByUserId(userId);
        Parameters parameters = Parameters.parametersBuilder().put("user", user).build();
        List<UserToRoleVO> userRoles = repository.findByHql(" from UserToRoleVO where user=:user", parameters);
        return userRoles;
    }
    
    /**
     * 执行用户关联角色
     * @param userID
     * @return
     * @throws DataAccessException
     */
    
    @Transactional(readOnly=false)
    public void doUserRelevanceRoles(String userId, String roleIds) throws DataAccessException{
        UserVO user = querySingleUserByUserId(userId);
        Parameters parameters = Parameters.parametersBuilder().put("user", user).build();
        repository.executeUpdateByHql("delete from UserToRoleVO where user=:user", parameters);
        List<UserToRoleVO> list  = new ArrayList<UserToRoleVO>();
        for(String roleId : roleIds.split(",")){
            RoleVO role = repository.load(RoleVO.class, roleId);
            list.add(new UserToRoleVO(user,role));
            repository.save(new UserToRoleVO(user,role));
        }
    }
    
    /**
     * 根据用户ID查询用户
     * @param userID
     * @return
     * @throws DataAccessException
     */
    public UserVO querySingleUserByUserId(String userId) throws DataAccessException{
    	Parameters parameters = Parameters.parametersBuilder().put("userId", userId).build();
        List<UserVO> userList = repository.findByHql(" from UserVO where userId =:userId", parameters);
        UserVO user = null;
        if (userList.size() == 1) {
            user =  userList.get(0);
        } 
        return user;
    }

    /**
     * 解锁用户
     * @param userIDS
     * @throws DataAccessException
     */
    
    @Transactional(readOnly=false)
    public void doUnlockUser(String userIds) throws DataAccessException{
        List<String> ids = new ArrayList<String>();
        for(String id : userIds.split(",")){
            ids.add(id);
        }
        Parameters parameters = Parameters.parametersBuilder().put("ids", ids).build();
        List<UserVO> userList =  repository.findByHql(" from UserVO where userId in(:ids)", parameters);
        if(userList!=null&&userList.size()>0){
            for(UserVO vo : userList){
                vo.setFailedLoginCount(ASAPI.securityConfiguration().getAllowedLoginAttempts());
                repository.update(vo);
            }
        }
    }
    
    
    /**
     * 	条件查询用户列表
     * @param createUser
     * @param queryRoleName
     * @param roleId
     * @return
     * @throws DataAccessException
     */
    public List<UserVO> queryUserListByOpt(String userId, String queryUserName,String createUser) throws DataAccessException {
        Builder builder = Parameters.parametersBuilder();
        String hql = "from UserVO where ";
        ArrayList<String> optionList = new ArrayList<String>();
        if (queryUserName != null && !queryUserName.equals("")) {
            builder.put("username", "%" + queryUserName + "%");
            optionList.add("username");
        }
        if (createUser != null && !createUser.equals("")) {
            builder.put("createUser", "%" + createUser  + "%");
            optionList.add("createUser");
        }
        if (userId != null && !userId.equals("")) {
            builder.put("userId", "%" + userId + "%");
            optionList.add("userId");
        }
        
        for(int i =0, len = optionList.size(); i < len; i++){
            if(i == len-1){
                hql += optionList.get(i)+" like :"+optionList.get(i);
            }else{
                hql += optionList.get(i)+" like :"+optionList.get(i)+ " and ";
            }
        }
        List<UserVO> users = new ArrayList<UserVO>();
        if (optionList.size() == 0) {
        	users = repository.findAll(UserVO.class);
        } else {
        	users =repository.findByHql(hql, builder.build());
        }
        return users;
    }
    
    
}
