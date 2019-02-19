package cn.com.agree.aweb.rbac.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.time.DateFormatUtils;
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

import cn.com.agree.aweb.asapi.reference.accesscontrol.DefaultAccessController;
import cn.com.agree.aweb.rbac.entity.RoleToMenuVO;
import cn.com.agree.aweb.rbac.entity.RoleVO;
import cn.com.agree.aweb.rbac.service.RoleManagerService;
import cn.com.agree.aweb.webmvc.AWebConstants;
import cn.com.agree.aweb.webmvc.ControllerSupport;
import cn.com.agree.aweb.webmvc.DataPrefix;
import cn.com.agree.aweb.webmvc.ObjectValidate;
import cn.com.agree.aweb.webmvc.ResultMessage;
import cn.com.agree.aweb.webmvc.interceptor.Interceptor;
import cn.com.agree.aweb.webmvc.interceptor.Interceptors;


/**
 * 角色管理相关请求控制器
 * 
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
@Controller
@Scope(value="prototype")
@RequestMapping(value="springmvc/role")
public class RoleManagerController extends ControllerSupport {

    private static Logger logger = LoggerFactory.getLogger(RoleManagerController.class);
    
    @Autowired
    private RoleManagerService roleManagerService;
    
    @Autowired
    private ResultMessage resultMessage;
    
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
    public Object listAllRoles() {
        List<RoleVO> roleList = null;
        JSONArray tableData = new JSONArray();
        try {
        	roleList = roleManagerService.listAllRoles();
			for (int i = 0, length = roleList.size(); i < length; i++) {
				RoleVO role = (RoleVO) roleList.get(i);
				JSONArray rowData = new JSONArray();
				rowData.add(role.getRoleId());
				rowData.add(role.getRoleName());
				rowData.add(role.getCreateUser());

				if (role.getCreateTime() != null) {
					rowData.add(DateFormatUtils.format(role.getCreateTime(),
							"yyyy-MM-dd HH:mm:ss"));
				} else {
					rowData.add(role.getCreateTime());
				}
				if (role.getUpdateTime() != null) {
					rowData.add(DateFormatUtils.format(role.getUpdateTime(),
							"yyyy-MM-dd HH:mm:ss"));
				} else {
					rowData.add(role.getUpdateTime());
				}
				rowData.add(role.getRemark());
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
     * 新建角色
     * @param roleVO
     * @return
     */
    @RequestMapping(value="addRole2.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"),
//            @Interceptor(name = "parameterValidate"),
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object addRole2(@DataPrefix("newRole") @ObjectValidate RoleVO newRole){
        String currentUserName = (String) getSession().getAttribute(AWebConstants.USERNAME_SESSION_ATTR_NAME);
        try {
            roleManagerService.addRole(newRole, currentUserName);
            DefaultAccessController.reset();
            
            resultMessage.success();
            resultMessage.addParameter("result", newRole);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        return resultMessage;
    }
    
    
    /**
     * 新建角色
     * @param roleVO
     * @return
     */
    @RequestMapping(value="addRole.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"),
//            @Interceptor(name = "parameterValidate"),
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object addRole(String roleName, String remark){
        String currentUserName = (String) getSession().getAttribute(AWebConstants.USERNAME_SESSION_ATTR_NAME);
        try {
        	RoleVO newRole = new RoleVO();
        	newRole.setRemark(remark);
        	newRole.setRoleName(roleName);
            roleManagerService.addRole(newRole, currentUserName);
            DefaultAccessController.reset();
            
            resultMessage.success();
            resultMessage.addParameter("result", newRole);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        return resultMessage;
    }
    
    
    /**
     * 编辑角色
     * @param roleVO
     * @return
     */
    @RequestMapping(value="editRole2.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
//            @Interceptor(name = "parameterValidate"),
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object editRole2(String roleId, @DataPrefix("newRole") @ObjectValidate RoleVO newRole){
        try {
            RoleVO oldRoleVO = roleManagerService.queryRoleByRoleId(roleId);
            if (oldRoleVO == null) {
                resultMessage.error("角色不存在");
            } else {
                roleManagerService.updateRole(newRole, oldRoleVO);
                DefaultAccessController.reset();
                
                resultMessage.success();
                resultMessage.addParameter("result", oldRoleVO);
            }
            
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 编辑角色
     * @param roleVO
     * @return
     */
    @RequestMapping(value="editRole.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
//            @Interceptor(name = "parameterValidate"),
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object editRole(String roleId, String roleName, String remark){
        try {
            RoleVO oldRoleVO = roleManagerService.queryRoleByRoleId(roleId);
            if (oldRoleVO == null) {
                resultMessage.error("角色不存在");
            } else {
            	RoleVO newRole = new RoleVO();
            	newRole.setRemark(remark);
            	newRole.setRoleName(roleName);
                roleManagerService.updateRole(newRole, oldRoleVO);
                DefaultAccessController.reset();
                
                resultMessage.success();
                resultMessage.addParameter("result", oldRoleVO);
            }
            
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    
    /**
     * 删除角色
     * @param roleVO
     * @return
     */
    @RequestMapping(value="deleteRole.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object deleteRole(String roleIds){
         List<String> roleList = new ArrayList<String>();
         for (String roleId: roleIds.split(",")) {
        	 roleList.add(roleId);
         }
         try {
            List<RoleVO> roleVOs = roleManagerService.queryRolesByRoleIds(roleList);
            roleManagerService.deleteRolesAndCtxRolesByUserVOs(roleVOs);
            DefaultAccessController.reset();
            
            resultMessage.success();
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        return resultMessage;
    }
    
    
    /**
     * 展示菜单权限列表
     * @param 
     * @return
     */
    @RequestMapping(value="listAllMenus.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object listAllMenus(String roleId){
        try {
            Object treeDatas = roleManagerService.listAllMenus(roleId);
            resultMessage.success();
            resultMessage.addParameter("result", treeDatas);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }

    /**
     * 执行角色授权菜单权限
     * @param roleID
     * @return
     */
    @RequestMapping(value="doRoleToMenu.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object doRoleToMenu(String roleId, String menuIdsWithAccs){
        try {
            roleManagerService.doRoleToMenu(roleId, menuIdsWithAccs);
            DefaultAccessController.reset();
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
    @RequestMapping(value="queryRoleListByOpt.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object queryRoleListByOpt(String createUser, String queryRoleName,String roleId){
        try {
        	JSONArray tableData = new JSONArray();
        	List<RoleVO> roles = roleManagerService.queryRoleListByOpt(createUser, queryRoleName, roleId);
			for (int i = 0, length = roles.size(); i < length; i++) {
				RoleVO role = (RoleVO) roles.get(i);
				JSONArray rowData = new JSONArray();
				rowData.add(role.getRoleId());
				rowData.add(role.getRoleName());
				rowData.add(role.getCreateUser());
				if (role.getCreateTime() != null) {
					rowData.add(DateFormatUtils.format(role.getCreateTime(),
							"yyyy-MM-dd HH:mm:ss"));
				} else {
					rowData.add(role.getCreateTime());
				}
				if (role.getUpdateTime() != null) {
					rowData.add(DateFormatUtils.format(role.getUpdateTime(),
							"yyyy-MM-dd HH:mm:ss"));
				} else {
					rowData.add(role.getUpdateTime());
				}
				rowData.add(role.getRemark());
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
     * 根据角色ID查询角色
     * @param roleID
     * @return
     */
    @RequestMapping(value="queryRoleByRoleId.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object queryRoleByRoleId(String roleId){
        try {
        	JSONObject info = new JSONObject();
        	RoleVO role = roleManagerService.queryRoleByRoleId(roleId);
        	info.put("roleName", role.getRoleName());
			info.put("remark", role.getRemark());
            resultMessage.success();
            resultMessage.addParameter("result", info);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    
    /**
     * 根据角色ID查询角色的权限列表
     * @param roleID
     * @return
     */
    @RequestMapping(value="queryRoleToMenuByRoleId.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
            @Interceptor(name="urlAccess"), 
            @Interceptor(name="csrf"),
            @Interceptor(name="session") 
    })
    @ResponseBody
    public Object queryRoleToMenuByRoleId(String roleId){
        try {
        	List<RoleToMenuVO> roleToMenuVOs = roleManagerService.queryRoleToMenuByRoleId(roleId);
            resultMessage.success();
            resultMessage.addParameter("result", roleToMenuVOs);
        } catch (DataAccessException e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
}
