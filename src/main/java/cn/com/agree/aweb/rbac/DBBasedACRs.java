package cn.com.agree.aweb.rbac;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.springframework.dao.DataAccessException;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.User;
import cn.com.agree.aweb.common.spring.SpringContextHolder;
import cn.com.agree.aweb.core.AwebRuntimeException;
import cn.com.agree.aweb.rbac.service.DBBasedService;

/**
 * 基于数据库实现的权限控制
 * 
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
public class DBBasedACRs {

    private static final String ACRS_SESSION_ATTR_NAME = "s_acrs";

    /** 从spring中获取数据库操作的对象 */
    private DBBasedService dbBasedService;

    public DBBasedACRs() {
        this.dbBasedService = SpringContextHolder.getBean(DBBasedService.class);
    }

    /**
     * 检查用户是否有该url权限
     * 
     * @param url
     * @return
     */
    public boolean isAuthorizedForURL(String url) {
        User user = ASAPI.authenticator().getCurrentUser();
        if (user == null) {
            return false;
        }

        // HttpSession session = user.getSession();
        HttpSession session = ASAPI.currentRequest().getSession(false);
        if (session == null) {
            return false;
        }

        Set<?> urls = (Set<?>) session.getAttribute(ACRS_SESSION_ATTR_NAME);
        if (urls == null) {
            return false;
        }

        return urls.contains(url);
    }

    /**
     * 初始化用户的url权限（用户拥有的菜单权限 >= url的权限 就把urlId添加到用户session中）
     * 
     * @param user
     */
    public boolean initACRs() {
        User user = ASAPI.authenticator().getCurrentUser();
        if (user == null) {
            return false;
        }

        // HttpSession session = user.getSession();
        HttpSession session = ASAPI.currentRequest().getSession(false);
        if (session == null) {
            return false;
        }

        try {
            Set<String> urls = new HashSet<String>();
            String sql = "SELECT distinct URL.URL_ID FROM AWEB_URL_ACCESS URL LEFT JOIN AWEB_ROLE_TO_MENU RTM ON URL.URL_MEN_ID = RTM.RTM_MEN_ID WHERE RTM.RTM_ACCESS >= URL.URL_ACCESS AND RTM.RTM_ROL_ID IN (SELECT UTR_ROL_ID FROM AWEB_USER_TO_ROLE WHERE UTR_USR_ID = '"
                    + user.getUserId()
                    + "') UNION SELECT URL_ID FROM AWEB_URL_ACCESS WHERE URL_MEN_ID = '000000'";
           
            List<?> rows =  dbBasedService.findBySql(sql);
            for (int i = 0, size = rows.size(); i < size; i++) {
                urls.add((String) rows.get(i));
            }

            session.setAttribute(ACRS_SESSION_ATTR_NAME, urls);
        } catch (DataAccessException e) {
        	 throw new AwebRuntimeException("查询用户权限时失败，数据库异常", e);
        }

        return true;
    }

    /**
     * 初始化用户的url权限（用户菜单权限与url权限相等才把urlId添加到用户session中）
     * 
     * @param user
     */
    public boolean initAccessEqualACRs() {
        User user = ASAPI.authenticator().getCurrentUser();
        if (user == null) {
            return false;
        }

        HttpSession session = ASAPI.currentRequest().getSession(false);
        if (session == null) {
            return false;
        }

        try {
            Set<String> urls = new HashSet<String>();
            String sql ="SELECT distinct URL.URL_ID FROM AWEB_URL_ACCESS URL LEFT JOIN AWEB_ROLE_TO_MENU RTM ON URL.URL_MEN_ID = RTM.RTM_MEN_ID WHERE RTM.RTM_ACCESS = URL.URL_ACCESS AND RTM.RTM_ROL_ID IN (SELECT UTR_ROL_ID FROM AWEB_USER_TO_ROLE WHERE UTR_USR_ID = '"
                    + user.getUserId()
                    + "') UNION SELECT URL_ID FROM AWEB_URL_ACCESS WHERE URL_MEN_ID = '000000'";
            List<?> rows = dbBasedService.findBySql(sql);
                    
            for (int i = 0, size = rows.size(); i < size; i++) {
                urls.add((String) rows.get(i));
            }

            session.setAttribute(ACRS_SESSION_ATTR_NAME, urls);
        } catch (DataAccessException e) {
            throw new AwebRuntimeException("查询用户权限时失败，数据库异常", e);
        }

        return true;
    }

}
