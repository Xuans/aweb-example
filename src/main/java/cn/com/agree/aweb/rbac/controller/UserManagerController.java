package cn.com.agree.aweb.rbac.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.errors.EncryptionException;
import cn.com.agree.aweb.core.AWebException;
import cn.com.agree.aweb.rbac.UserType;
import cn.com.agree.aweb.rbac.entity.RoleVO;
import cn.com.agree.aweb.rbac.entity.UserToRoleVO;
import cn.com.agree.aweb.rbac.entity.UserVO;
import cn.com.agree.aweb.rbac.service.UICService;
import cn.com.agree.aweb.webmvc.AWebConstants;
import cn.com.agree.aweb.webmvc.ControllerSupport;
import cn.com.agree.aweb.webmvc.DataPrefix;
import cn.com.agree.aweb.webmvc.ObjectValidate;
import cn.com.agree.aweb.webmvc.ResultMessage;
import cn.com.agree.aweb.webmvc.interceptor.Interceptor;
import cn.com.agree.aweb.webmvc.interceptor.Interceptors;

/**
 * 用户管理相关请求控制器
 * 
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
@Controller
@Scope(value="prototype")
@RequestMapping(value="springmvc/user")
public class UserManagerController extends ControllerSupport {
    
    private static Logger logger = LoggerFactory.getLogger(UserManagerController.class);
    
    @Autowired
    private UICService uicService;
    
    @Autowired
    private ResultMessage resultMessage;
    
    
    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    /**
     * 查询所有用户列表
     * @return
     */
    @RequestMapping(value="listAllUsers.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace")
            
    })
    @ResponseBody
    public Object listAllUsers() {
        List<UserVO> userList = null;
        JSONArray tableData = new JSONArray();
        try {
        	userList = uicService.listAllUsers();
        	
        	
			for (int i = 0, length = userList.size(); i < length; i++) {
				UserVO user = (UserVO) userList.get(i);

				JSONArray rowData = new JSONArray();
				rowData.add(user.getUserId());
				rowData.add(user.getUsername());
				rowData.add(user.getNickname());
				rowData.add(user.getCreateUser());
				rowData.add(formatter.format(user.getCreateTime()));

				String locked = user.getFailedLoginCount() >= ASAPI
						.securityConfiguration().getAllowedLoginAttempts() ? "锁定"
						: "正常";
				rowData.add(locked);

				tableData.add(rowData);
			}
            
            resultMessage.success();
            resultMessage.addParameter("result", tableData);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    
    /**
     * 查询所有角色列表
     * @return
     */
    @RequestMapping(value="listAllRoles.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object listAllRoles(String userId) {
    	JSONObject returnData = new JSONObject();
        List<RoleVO> roleList = null;
        List<UserToRoleVO> userToRoleVOList = null;
        List<JSONArray> roles = new ArrayList<JSONArray>();
		List<JSONArray> utr = new ArrayList<JSONArray>();
        try {
        	UserVO user = uicService.querySingleUserByUserId(userId);
        	roleList = uicService.listAllRoles();
        	userToRoleVOList = uicService.listUtrById(user);
			for (int i = 0, length = roleList.size(); i < length; i++) {
				RoleVO role = (RoleVO) roleList.get(i);
				JSONArray rowData = new JSONArray();
				rowData.add(role.getRoleId());
				rowData.add(role.getRoleName());
				rowData.add(role.getRemark());
				roles.add(rowData);
			}
			
			
			for (int i = 0, length = userToRoleVOList.size(); i < length; i++) {
				UserToRoleVO userToRoleVO = (UserToRoleVO) userToRoleVOList.get(i);
				JSONArray rowData = new JSONArray();
				rowData.add(userToRoleVO.getId());
				rowData.add(userToRoleVO.getRole().getRoleId());
				rowData.add(userToRoleVO.getUser().getUserId());
				utr.add(rowData);
			}
			returnData.put("roles", roles);
			returnData.put("utr", utr);
            resultMessage.success();
            resultMessage.addParameter("result", returnData);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 验证用户名是否重复
     * @return
     */
    @RequestMapping(value="ifUsernameExist.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object ifUsernameExist(String username) {
        
        try {
            UserVO userVO = uicService.queryUserByUsername(username);
            if (userVO == null) {
                resultMessage.success();
            } else {
                resultMessage.error("用户名已存在");
            }
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 新建用户
     * @param username
     * @return
     */
    @RequestMapping(value="addUser2.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session"), 
            @Interceptor(name="parameterValidate")
    })
    @ResponseBody
    public Object addUser2(@DataPrefix("newUser")@ObjectValidate UserVO newUser) {
        
        try {
            UserVO oldUserVO = uicService.queryUserByUsername(newUser.getUsername());
            if (oldUserVO != null) {
                resultMessage.error("用户不存在");
            } else {
                uicService.addUser(newUser, 
                        ASAPI.authenticator().getCurrentUser().getUsername());
                
                resultMessage.success();
                //返回前，清理敏感数据
                newUser.setUserId("");
                newUser.setPassword(null);
                resultMessage.addParameter("result", newUser);
            }
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        } catch (EncryptionException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        return resultMessage;
    }
    
    /**
     * 新建用户
     * @param username
     * @return
     */
    @RequestMapping(value="addUser.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session"), 
//            @Interceptor(name="parameterValidate")
    })
    @ResponseBody
    public Object addUser(String username,String nickname,String remark,String email,String telephone,String userType) {
        
        try {
            UserVO oldUserVO = uicService.queryUserByUsername(username);
            UserVO newUser = new UserVO();
            newUser.setUsername(username);
            newUser.setNickname(nickname);
            newUser.setRemark(remark);
            newUser.setMailbox(email);
            newUser.setTelephone(telephone);
            newUser.setUserType(userType);
            if (oldUserVO != null) {
                resultMessage.error("用户不存在");
            } else {
                uicService.addUser(newUser, 
                        ASAPI.authenticator().getCurrentUser().getUsername());
                
                resultMessage.success();
                //返回前，清理敏感数据
                newUser.setUserId("");
                newUser.setPassword(null);
                resultMessage.addParameter("result", newUser);
            }
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        } catch (EncryptionException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        return resultMessage;
    }
    
    /**
     * 编辑用户
     * @param username
     * @return
     */
    @RequestMapping(value="editUser2.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name = "parameterValidate"),
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object editUser2(String userId, @DataPrefix("newUser")@ObjectValidate UserVO newUser) {
        try {
            UserVO oldUserVO = uicService.querySingleUserByUserId(userId);
            
            if (oldUserVO == null) {
                resultMessage.error("用户不存在");
            } else {
                uicService.updateUser(oldUserVO, newUser, "0");
                
                resultMessage.success();
                
                //清理敏感数据
                oldUserVO.setUserId("");
                oldUserVO.setPassword(null);
                resultMessage.addParameter("result", oldUserVO);
            }
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        } catch (EncryptionException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 编辑用户
     * @param username
     * @return
     */
    @RequestMapping(value="editUser.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
//            @Interceptor(name = "parameterValidate"),
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object editUser(String userId,String username,String nickname,String remark,String email,String telephone,String userType) {
        try {
            UserVO oldUserVO = uicService.querySingleUserByUserId(userId);
            UserVO newUser = new UserVO();
            newUser.setUsername(username);
            newUser.setNickname(nickname);
            newUser.setRemark(remark);
            newUser.setMailbox(email);
            newUser.setTelephone(telephone);
            newUser.setUserType(userType);
            if (oldUserVO == null) {
                resultMessage.error("用户不存在");
            } else {
                uicService.updateUser(oldUserVO, newUser, "0");
                
                resultMessage.success();
                
                //清理敏感数据
                oldUserVO.setUserId("");
                oldUserVO.setPassword(null);
                resultMessage.addParameter("result", oldUserVO);
            }
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        } catch (EncryptionException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 删除用户
     * @param userIDS
     * @return
     */
    @RequestMapping(value="deleteUser.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object deleteUser(String usernames) {
        
        try {
            List<String> userList = new ArrayList<String>();
            for (String username: usernames.split(",")) {
            	userList.add(username);
            }
            List<UserVO> userVOs = uicService.queryUsersByUsernames(userList);
            String currentUsername = (String) getSession().getAttribute(AWebConstants.USERNAME_SESSION_ATTR_NAME);
            
            for (UserVO userVO: userVOs) {
                if (userVO.getUsername().equals(currentUsername)) {
                    resultMessage.error("您不能删除您自己的账号");
                    
                }
                
                if (UserType.ADMIN.value().equals(userVO.getUserType())) {
                    resultMessage.error("您不能删除管理员账号");
                }
            }
            
            uicService.deleteUsersAndCtxRolesByUserVOs(userVOs);
            resultMessage.success();
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 获取用户已有的角色
     * @param userID
     * @return
     */
    @RequestMapping(value="listUserRelevanceRoles.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object listUserRelevanceRoles(String userId) {
        try {
            List<UserToRoleVO> userRoles = uicService.listUserRelevanceRoles(userId);
            resultMessage.success();
            resultMessage.addParameter("result", userRoles);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 执行用户关联角色
     * @param userID
     * @return
     */
    @RequestMapping(value="doUserRelevanceRoles.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object doUserRelevanceRoles(String userId, String roleIds) {
        try {
            uicService.doUserRelevanceRoles(userId, roleIds);
            resultMessage.success();
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    
    
    
    /**
     * 解锁用户 
     * @param userIDS
     * @return
     */
    @RequestMapping(value="doUnlockUser.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object doUnlockUser(String userIds) {
        try {
            uicService.doUnlockUser(userIds);
            resultMessage.success();
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        return resultMessage;
    }
    
    
    /**
     * 条件查询角色列表
     * @param roleID
     * @return
     */
    @RequestMapping(value="queryUserListByOpt.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object queryUserListByOpt(String userId, String queryUserName,String createUser){
        try {
        	JSONArray tableData = new JSONArray();
        	List<UserVO> users = uicService.queryUserListByOpt(createUser, queryUserName, userId);
        	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			for (int i = 0, length = users.size(); i < length; i++) {
				UserVO user = (UserVO) users.get(i);

				JSONArray rowData = new JSONArray();
				rowData.add(user.getUserId());
				rowData.add(user.getUsername());
				rowData.add(user.getNickname());
				rowData.add(user.getCreateUser());
				rowData.add(formatter.format(user.getCreateTime()));

				String locked = user.getFailedLoginCount() >= ASAPI
						.securityConfiguration().getAllowedLoginAttempts() ? "锁定"
						: "正常";
				rowData.add(locked);

				tableData.add(rowData);
			}
            resultMessage.success();
            resultMessage.addParameter("result", tableData);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    
    /**
     * 根据用户ID查询用户
     * @param roleID
     * @return
     */
    @RequestMapping(value="querySingleUserByUserId.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object querySingleUserByUserId(String userId){
        try {
        	UserVO user = uicService.querySingleUserByUserId(userId);
        	JSONObject info = new JSONObject();
			if (user == null) {
				throw AWebException.raise("用户不存在");
			}
			SimpleDateFormat formatter = new SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			info.put("userId", user.getUserId());
			info.put("username", user.getUsername());
			info.put("nickname", user.getNickname());
			info.put("telephone", user.getTelephone());
			info.put("email", user.getMailbox());
			info.put("userType", user.getUserType());
			info.put(
					"createTime",
					user.getCreateTime() != null ? formatter.format(user
							.getCreateTime()) : "");
			info.put("createUser", user.getCreateUser());
			info.put(
					"lastFailedLoginTime",
					user.getLastFailedLoginTime() != null ? formatter
							.format(user.getLastFailedLoginTime()) : "");
			info.put("failedLoginCount", user.getFailedLoginCount());
			info.put("lastHostAddress", user.getLastHostAddress());
			info.put("remark", user.getRemark());
			info.put("lastHostAddress", user.getLastHostAddress());
			info.put(
					"lockTime",
					user.getLockTime() != null ? formatter.format(user
							.getLockTime()) : "");
			info.put(
					"lastLoginTime",
					user.getLastLoginTime() != null ? formatter.format(user
							.getLastLoginTime()) : "");
			info.put(
					"updateTime",
					user.getUpdateTime() != null ? formatter.format(user
							.getUpdateTime()) : "");
            resultMessage.success();
            resultMessage.addParameter("result", info);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }


}
