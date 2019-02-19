package cn.com.agree.aweb.rbac.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import cn.com.agree.aweb.pa.hibernate.HibernateRepository;
import cn.com.agree.aweb.pa.hibernate.param.Parameters;
import cn.com.agree.aweb.rbac.MenuState;
import cn.com.agree.aweb.rbac.entity.MenuVO;
import cn.com.agree.aweb.rbac.entity.RoleToMenuVO;

/**
 * 菜单相关服务
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Transactional
@Service(value = "menuService")
public class MenuService {

    private final static String ID_JSON_KEY = "id";
    private final static String PID_JSON_KEY = "pid";
    private final static String NAME_JSON_KEY = "name";
    private final static String VALUE_JSON_KEY = "value";
    private final static String STATE_JSON_KEY = "state";
    private final static String REMARK_JSON_KEY = "remark";
    private final static String SEQ_JSON_KEY = "seq";
    private final static String ICON_JSON_KEY = "icon";
    private final static String ACCESS_JSON_KEY = "access";
    private final static String TYPE_JSON_KEY = "type";

    
    @Autowired
    private HibernateRepository repository;

    /**
     * 根据角色列表及菜单状态，查询菜单项列表
     * 
     * @param roleVOs
     * @return
     * @throws repositoryException
     */
    public JSONArray queryMenusByRoles(Set<String> roles) throws DataAccessException {

        if (roles == null || roles.size() == 0) {
            return new JSONArray();
        }

        String hql =" from RoleToMenuVO  where RTM_ROL_ID in (:roles)  ";
		Parameters parameters = Parameters.parametersBuilder().put("roles", roles).build();
        List<RoleToMenuVO> roleToMenuVOs = repository.findByHql(hql, parameters);
        // 此处去除多角色导致的重复菜单项，并取角色对应的最高菜单权限等级
        Map<String, Integer> menuRoleMap = new HashMap<String, Integer>();
        for (RoleToMenuVO roleToMenuVO : roleToMenuVOs) {
            String id = roleToMenuVO.getMenu().getId();
            int role = roleToMenuVO.getAccess();

            if (menuRoleMap.containsKey(id)) {
                if (menuRoleMap.get(id) < role) {
                    menuRoleMap.remove(id);
                    menuRoleMap.put(id, role);
                }

            } else {
                menuRoleMap.put(id, role);
            }
        }
        //这个集合用于去除重复菜单
        Set<String> set = new HashSet<String>();
        // 根据available参数，决定是否过滤掉不可用的菜单项
        // 并将结果组织为JSONArray格式
        JSONArray menus = new JSONArray();
        for (RoleToMenuVO roleToMenuVO : roleToMenuVOs) {
            MenuVO menuVO = roleToMenuVO.getMenu();

            if (MenuState.FROZEN.value().equals(menuVO.getState())) {
                continue;
            }
            if (!set.contains(menuVO.getId())) {
                set.add(menuVO.getId());
                
                JSONObject menu = new JSONObject();
                menu.put(ID_JSON_KEY, menuVO.getId());
                menu.put(PID_JSON_KEY, menuVO.getpId());
                menu.put(NAME_JSON_KEY, menuVO.getName());
                menu.put(VALUE_JSON_KEY, menuVO.getValue());
                menu.put(TYPE_JSON_KEY, menuVO.getType());
                menu.put(STATE_JSON_KEY, menuVO.getState());
                menu.put(REMARK_JSON_KEY, menuVO.getRemark());
                menu.put(SEQ_JSON_KEY, menuVO.getSeq());
                menu.put(ICON_JSON_KEY, menuVO.getIcon());
                menu.put(ACCESS_JSON_KEY, menuRoleMap.get(menuVO.getId()));
                menus.add(menu);
            }
        }

        return menus;
    }


}
