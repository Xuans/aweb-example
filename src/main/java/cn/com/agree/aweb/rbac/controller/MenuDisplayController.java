package cn.com.agree.aweb.rbac.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.User;
import cn.com.agree.aweb.rbac.service.MenuService;
import cn.com.agree.aweb.webmvc.ControllerSupport;
import cn.com.agree.aweb.webmvc.ResultMessage;
import cn.com.agree.aweb.webmvc.interceptor.Interceptor;
import cn.com.agree.aweb.webmvc.interceptor.Interceptors;


/**
 * 菜单相关
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
@Controller
@Scope(value="prototype")
@RequestMapping(value="springmvc/menu")
public class MenuDisplayController extends ControllerSupport {
    
    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    @Autowired
    private MenuService menuService;
    
    @Autowired
    private ResultMessage resultMessage;
    
    /**
     * 菜单加载
     * @return
     */
    @RequestMapping(value="loadMenu.do")
    @Interceptors(interceptors = { 
            @Interceptor(name="trace"),
//            @Interceptor(name="urlAccess"), 
            @Interceptor(name="session")  
//            @Interceptor(name="csrf")
    })
    @ResponseBody
    public Object loadMenu() {
        
        try {
            User currentUser = ASAPI.authenticator().getCurrentUser();
            JSONArray menus = menuService.queryMenusByRoles(currentUser.getRoles());
        //    JSONObject result = new JSONObject();
          //  result.put("menus", menus);
            resultMessage.success();
            resultMessage.addParameter("result", menus);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            resultMessage.error(e.getMessage());
        }
        
        return resultMessage;
    }
    

}
