package cn.com.agree.aweb.rbac.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.core.AWebException;
import cn.com.agree.aweb.pa.hibernate.HibernateRepository;
import cn.com.agree.aweb.pa.hibernate.param.Parameters;
import cn.com.agree.aweb.pa.hibernate.param.Parameters.Builder;
import cn.com.agree.aweb.rbac.MenuState;
import cn.com.agree.aweb.rbac.entity.AccessVO;
import cn.com.agree.aweb.rbac.entity.MenuVO;
import cn.com.agree.aweb.rbac.entity.RoleToMenuVO;
import cn.com.agree.aweb.rbac.entity.RoleVO;
import cn.com.agree.aweb.rbac.entity.UserToRoleVO;

import com.alibaba.fastjson.JSONObject;

/**
 * 角色信息服务层
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Transactional
@Service(value = "roleManagerService")
public class RoleManagerService {

    @Autowired
    private HibernateRepository repository;
    
    

    /**
     * 根据角色名查询角色
     * 
     * @param name
     * @return
     * @throws DataAccessException
     */
    public RoleVO queryRoleByRoleName(String name) throws DataAccessException {
    	Parameters parameters = Parameters.parametersBuilder().put("roleName", name).build();
        List<RoleVO> roleList = repository.findByHql(" from RoleVO where roleName =:roleName ", parameters);
        if (roleList.size() == 1) {
            return roleList.get(0);
        }

        return null;
    }

    /**
     * 根据角色ID查询角色RoleVO
     * 
     * @param name
     * @return
     * @throws DataAccessException
     */
    public RoleVO queryRoleByRoleId(String roleId) throws DataAccessException {
        RoleVO role = repository.get(RoleVO.class, roleId);
        return role;
    }

    /**
     * 根据id list，查询所有RoleVO
     * 
     * @param ids
     * @return
     * @throws DataAccessException
     */
    public List<RoleVO> queryRolesByRoleIds(List<String> ids) throws DataAccessException {
    	Parameters parameters = Parameters.parametersBuilder().put("roleIds", ids).build();
        List<RoleVO> roleVOs = repository.findByHql(" from RoleVO where roleId in(:roleIds)", parameters);
        return roleVOs;
    }

    /**
     * 根据角色ID查询角色关联用户列表
     * 
     * @param roleId
     * @return
     * @throws DataAccessException
     */
    public List<UserToRoleVO> queryUserToRoleByRoleId(String roleId) throws DataAccessException {
        List<UserToRoleVO> userToRoleVOs = null;
        RoleVO role = queryRoleByRoleId(roleId);
        Parameters parameters = Parameters.parametersBuilder().put("role", role).build();
        userToRoleVOs =  repository.findByHql(" from UserToRoleVO where role =:role ", parameters);
        return userToRoleVOs;
    }

    /**
     * 根据角色ID查询角色的权限列表
     * 
     * @param roleId
     * @return
     * @throws DataAccessException
     */
    public List<RoleToMenuVO> queryRoleToMenuByRoleId(String roleId) throws DataAccessException {
        List<RoleToMenuVO> roleToMenuVOs = null;
        RoleVO role = queryRoleByRoleId(roleId);
        Parameters parameters = Parameters.parametersBuilder().put("role", role).build();
        roleToMenuVOs = repository.findByHql(" from RoleToMenuVO where role =:role ", parameters);
        return roleToMenuVOs;
    }

    /**
     * 根据菜单id和语言获取MenuVO
     * 
     * @param menuId
     * @return
     * @throws DataAccessException
     */
    public MenuVO queryMenuByMenuId(String menuId) throws DataAccessException {
        Parameters parameters = Parameters.parametersBuilder().put("menuId", menuId).build();
        List<MenuVO> menuList = repository.findByHql(" from MenuVO where id =:menuId", parameters);
        if (menuList.size() == 1) {
            return menuList.get(0);
        }

        return null;
    }
    
    public List<RoleVO> queryRoleListByOpt(String createUser, String queryRoleName,String roleId) throws DataAccessException {
        Builder builder = Parameters.parametersBuilder();
        String hql = "from RoleVO where ";
        ArrayList<String> optionList = new ArrayList<String>();
        if (queryRoleName != null && !queryRoleName.equals("")) {
            builder.put("roleName", "%" + queryRoleName + "%");
            optionList.add("roleName");
        }
        if (createUser != null && !createUser.equals("")) {
            builder.put("createUser", "%" + createUser  + "%");
            optionList.add("createUser");
        }
        if (roleId != null && !roleId.equals("")) {
            builder.put("roleId", "%" + roleId + "%");
            optionList.add("roleId");
        }
        
        for(int i =0, len = optionList.size(); i < len; i++){
            if(i == len-1){
                hql += optionList.get(i)+" like :"+optionList.get(i);
            }else{
                hql += optionList.get(i)+" like :"+optionList.get(i)+ " and ";
            }
        }
        List<RoleVO> roles = new ArrayList<RoleVO>();
        if (optionList.size() == 0) {
            roles = repository.findAll(RoleVO.class);
        } else {
            roles =repository.findByHql(hql, builder.build());
        }
        return roles;
    }
    
    

    /**
     * 所有角色列表
     * 
     * @return
     * @throws DataAccessException
     */
    public List<RoleVO> listAllRoles() throws DataAccessException {
        return  repository.loadAll(RoleVO.class);
    }

    /**
     * 添加新角色
     * 
     * @param role
     * @param createRolename
     * @throws DataAccessException
     */
    public void addRole(RoleVO role, String createRolename) throws DataAccessException {
        role.setCreateUser(createRolename);
        role.setCreateTime(new Date());
        repository.saveOrUpdate(role);
    }
    
    /**
     *  添加新角色
     * @param role
     * @throws DataAccessException
     */
    public void addRole(RoleVO role) throws DataAccessException {
        String createRolename = ASAPI.authenticator().getCurrentUser().getUsername();
        addRole(role, createRolename);
    }

    /**
     * 编辑角色
     * 
     * @param newRoleVO
     * @param oldRoleVO
     * @return
     * @throws DataAccessException
     */
    public RoleVO updateRole(RoleVO newRoleVO, RoleVO oldRoleVO) throws DataAccessException {
        oldRoleVO.setRemark(newRoleVO.getRemark());
        oldRoleVO.setUpdateTime(new java.sql.Date(new Date().getTime()));
        oldRoleVO.setRoleName(newRoleVO.getRoleName());
        oldRoleVO.setRemark(newRoleVO.getRemark());
        repository.saveOrUpdate(oldRoleVO);
        return oldRoleVO;
    }
    
    /**
     *  根据角色ID编辑角色
     * 
     * @param roleId
     * @param newRole
     * @throws DataAccessException
     */
    public void updateRole(String roleId, RoleVO newRole) throws DataAccessException {
        Parameters parameters = Parameters.parametersBuilder().put("roleId",  roleId).build();
        List<RoleVO> roleVOList = repository.findByHql(" from RoleVO where roleId =:roleId ", parameters);
        if(roleVOList.size() == 0) {
            throw AWebException.raise("编辑角色[" + roleId + "]失败，角色不存在");
        }
        RoleVO oldRole = roleVOList.get(0);
        updateRole(newRole, oldRole);
    }

    /**
     * 删除角色
     * 
     * @param roleVOs
     * @throws DataAccessException
     */
    public void deleteRolesAndCtxRolesByUserVOs(List<RoleVO> roleVOs) throws DataAccessException {
        Parameters parameters = Parameters.parametersBuilder().put("role", roleVOs).build();
        List<UserToRoleVO> userRoles = repository.findByHql(" from UserToRoleVO where role in (:role)", parameters);
        List<RoleToMenuVO> roleMenus = repository.findByHql(" from RoleToMenuVO where role in (:role)", parameters);
        repository.deleteAll(userRoles);
        repository.deleteAll(roleMenus);
        repository.deleteAll(roleVOs);
    }

    /**
     * 展示菜单权限列表
     * 
     * @param roleId
     * @throws DataAccessException
     */
    public List<Object> listAllMenus(String roleId) throws DataAccessException {
        List<Object> treeDatas = new ArrayList<Object>();
        List<RoleToMenuVO> roleToMenuVOs = queryRoleToMenuByRoleId(roleId);
        List<MenuVO> menuVOs = (List<MenuVO>) repository.loadAll(MenuVO.class);
        List<AccessVO> accessVOs = (List<AccessVO>) repository.loadAll(AccessVO.class);
    	List<String> menuPIdList = getMenuPIdList(menuVOs);
        for (MenuVO menuVO : menuVOs) {
            if (MenuState.ACTIVE.value().equals(menuVO.getState())) {
                JSONObject menuObj = new JSONObject();
				boolean isParent = isParent(menuPIdList, menuVO);
                menuObj.put("id", menuVO.getId());
                menuObj.put("pId", menuVO.getpId());
                menuObj.put("name", menuVO.getName());
                menuObj.put("open", isParent ? Boolean.TRUE : Boolean.FALSE);
                menuObj.put("isMenuParent", String.valueOf(isParent));
                menuObj.put("remark", menuVO.getId());
                menuObj.put("checked", "false");
                menuObj.put("type", "menuObj");

                int rvoAccess = -1;
                for (RoleToMenuVO rvo : roleToMenuVOs) { // 判断是否已有权限
                    if (menuVO.getId().equals(rvo.getMenu().getId())) {
                        rvoAccess = rvo.getAccess();
                        menuObj.put("checked", "true");
                    }
                }
                treeDatas.add(menuObj);

                if (!isParent) {
                    for (AccessVO vo : accessVOs) {
                        JSONObject accObj = new JSONObject();
                        accObj.put("pId", menuVO.getId());
                        accObj.put("name", vo.getAccDesc());
                        accObj.put("accCode", vo.getAccCode());
                        accObj.put("checked", vo.getAccCode() == rvoAccess ? "true" : "false");
                        accObj.put("type", "accObj");

                        treeDatas.add(accObj);
                    }
                }
            }
        }
        return treeDatas;
    }
    
    private List<String> getMenuPIdList(List<MenuVO> menuVOs) {
		List<String> menuPIdList = new ArrayList<String>();
		for (MenuVO menu : menuVOs) {
			menuPIdList.add(menu.getpId());
		}
		return menuPIdList;
	}
    
	/**
	 * 判断当前菜单是否为父亲菜单
	 * 
	 * @param menuPIdList
	 * @param menuVO
	 * @return
	 * @throws DBSupportException
	 */
	private boolean isParent(List<String> menuPIdList, MenuVO menuVO) {
		if (menuPIdList.contains(menuVO.getId()))
			return true;

		return false;
	}

    /**
     * 执行角色授权菜单权限
     * 
     * @param roleID
     * @param menuIDsWithAccs
     * @throws DataAccessException
     */
    public void doRoleToMenu(String roleID, String menuIDsWithAccs) throws DataAccessException {
        RoleVO role = queryRoleByRoleId(roleID);
        Parameters parameters = Parameters.parametersBuilder().put("role", role).build();
        List<RoleToMenuVO> roleMenus = repository.findByHql(" from RoleToMenuVO where role =:role", parameters);
        repository.deleteAll(roleMenus);
        if (menuIDsWithAccs.length() > 0) {
            List<RoleToMenuVO> list = new ArrayList<RoleToMenuVO>();
            for (String menuIDWithAcc : menuIDsWithAccs.split(",")) {

                String menuID = menuIDWithAcc.split("=")[0];
                int accCode = -1;

                if (menuIDWithAcc.split("=").length > 1) {
                    if (menuIDWithAcc.split("=")[1].equals("PARENT_NODE")) {
                        accCode = 0;
                    } else {
                        accCode = Integer.parseInt(menuIDWithAcc.split("=")[1]);
                    }
                }

                MenuVO menu = queryMenuByMenuId(menuID);
                if (accCode != -1) {
                    RoleToMenuVO rtmVO = new RoleToMenuVO();
                    rtmVO.setMenu(menu);
                    rtmVO.setRole(role);
                    rtmVO.setAccess(accCode);
                    list.add(rtmVO);
                    repository.save(rtmVO);
                }
            }
        }
    }
    
}
