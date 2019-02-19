package cn.com.agree.aweb.rbac.controller;

import javax.validation.constraints.Pattern;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.agree.aweb.asapi.ASAPI;
import cn.com.agree.aweb.asapi.errors.AuthenticationException;
import cn.com.agree.aweb.rbac.DefaultUser;
import cn.com.agree.aweb.rbac.entity.UserVO.Group_UserParamVali;
import cn.com.agree.aweb.webmvc.AWebConstants;
import cn.com.agree.aweb.webmvc.ControllerSupport;
import cn.com.agree.aweb.webmvc.ResultMessage;
import cn.com.agree.aweb.webmvc.interceptor.Interceptor;
import cn.com.agree.aweb.webmvc.interceptor.Interceptors;
import cn.com.agree.aweb.core.utils.VerifyImageUtil;

/**
 * 用户登入登出操作
 * 
 * @author  lanzhanhong
 * @date 2018年12月18日  
 * @version 1.0
 */
@Controller
@Scope(value = "prototype")
@RequestMapping
public class LoginController extends ControllerSupport {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    
    @Autowired
    private ResultMessage resultMessage;

    /**
     * 登陆
     * 
     * @param username
     * @param password
     * @return
     */
    @RequestMapping(value = "signIn.do", method = {RequestMethod.POST})
    @Interceptors(interceptors = { 
            @Interceptor(name = "trace"),
            @Interceptor(name = "parameterValidate"),
            @Interceptor(name = "verify", params = { "checkCodeField", "checkCode" }) })
    @ResponseBody
    public Object signIn( String username, String password) {
        try {
            logger.info("用户[" + username + "]尝试登陆");

            ASAPI.authenticator().login(getRequest(), getResponse());
            ASAPI.accessController().initACRs("AWEB INIT URL");

            logger.info("用户[" + username + "]登陆成功");
           ASAPI.currentRequest().getSession().setAttribute(AWebConstants.USERNAME_SESSION_ATTR_NAME,username);
            ASAPI.authenticator().getCurrentUser().resetCSRFToken();
            resultMessage.success();
            resultMessage.addParameter("result", ASAPI.authenticator().getCurrentUser().getCSRFToken());
        } catch (AuthenticationException e) {
            logger.info("用户[" + username + "]登陆失败");
            logger.error(e.getLogMessage());

            resultMessage.error(e.getUserMessage());
        }

        return resultMessage;
    }

    /**
     * 重定向到登陆页
     * 
     * @return
     */
    @RequestMapping(value = "redirect.do")
    @Interceptors(interceptors = { @Interceptor(name = "trace") })
    public String redirect() {
        DefaultUser currentUser = (DefaultUser) ASAPI.authenticator().getCurrentUser();
        if (currentUser != null && currentUser.isLoggedIn()) {
            return "forward:/index.jsp";
        }

        return "forward:/login.html";
    }

    /**
     * 是否首次登陆
     * 
     * @return
     */
    @RequestMapping(value = "isFirstSignOn.do")
    @Interceptors(interceptors = { 
            @Interceptor(name = "trace"), 
            @Interceptor(name = "session"),
            @Interceptor(name = "csrf"),
            @Interceptor(name = "urlAccess") })
    @ResponseBody
    public Object isFirstSignOn() {
        DefaultUser currentUser = (DefaultUser) ASAPI.authenticator().getCurrentUser();

        if (currentUser != null && currentUser.isFirstSignOn()) {
            resultMessage.success();
        } else {
            resultMessage.error();
        }

        return resultMessage;
    }

    /**
     * 修改密码
     * 
     * @param oldPassword
     * @param newPassword
     * @param repeatNewPassword
     * @return
     */
    @RequestMapping(value = "changePassword.do")
    @Interceptors(interceptors = { 
            @Interceptor(name = "trace"), 
            @Interceptor(name = "session"),
            @Interceptor(name = "csrf"),
            @Interceptor(name="parameterValidate")})
    @ResponseBody
    public Object changePassword(String oldPassword,
            @Pattern(regexp = "(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})", groups = {
                    Group_UserParamVali.class }) String newPassword,
            @Pattern(regexp = "(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})", groups = {
                    Group_UserParamVali.class }) String repeatNewPassword) {
        DefaultUser currentUser = (DefaultUser) ASAPI.authenticator().getCurrentUser();

        try {
            logger.info("用户[" + currentUser.getUsername() + "]尝试修改密码");
            currentUser.changePassword(oldPassword, newPassword, repeatNewPassword);

            logger.info("用户[" + currentUser.getUsername() + "]修改密码成功");
            resultMessage.success();
        } catch (AuthenticationException e) {
            logger.info("用户[" + currentUser.getUsername() + "]修改密码失败");
            logger.info(e.getLogMessage());

            resultMessage.error(e.getUserMessage());
        }

        return resultMessage;
    }

    /**
     * 登出
     * 
     * @return
     */
    @RequestMapping(value = "signOut.do")
    @Interceptors(interceptors = { 
            @Interceptor(name = "trace"), 
      //      @Interceptor(name = "urlAccess"),
            @Interceptor(name = "session"), 
            @Interceptor(name = "csrf") })
    @ResponseBody
    public Object signOut() {
        DefaultUser currentUser = (DefaultUser) ASAPI.authenticator().getCurrentUser();

        if (currentUser != null) {
            currentUser.logout();

            logger.info("用户[" + currentUser.getUsername() + "]登出");
        }
        resultMessage.success();
        return resultMessage;
    }
    
    
    /**
     * 获取CSRFToken
     * @return
     */
    @RequestMapping(value = "getCSRFToken.do")
    @Interceptors(interceptors = { 
            @Interceptor(name = "trace") 
             })
    @ResponseBody
    public Object getCSRFToken() {
        DefaultUser user = (DefaultUser) ASAPI.authenticator().getCurrentUser();
        if (user != null) {
            resultMessage.success();
            resultMessage.addParameter("result", user.getCSRFToken());
        }else{
            resultMessage.error("获取CSRFToken失败！");
        }

        return resultMessage;
    }
    
    
    /**
     * 操作session
     * @param util
     * @param request
     */
    private void doSessionOperation(VerifyImageUtil util, HttpServletRequest request) {
        HttpSession session = request.getSession();
        Object verifyObj = null;
        
        if (session != null) {
            verifyObj = session.getAttribute("s_verifyObj");
            
            if (verifyObj != null) {
                session.removeAttribute("s_verifyObj");
            }
            
            session.setAttribute("s_verifyObj", util.getString());
            
        }
    }
    /**
     * 将验证图片写入response流中
     * @param util
     * @param response
     * @throws IOException
     */
    private void writeVerifyImage(VerifyImageUtil util, HttpServletResponse response) throws IOException {
        
        response.setHeader(HttpHeaders.PRAGMA, "no-cache");
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-cache");
        response.setDateHeader(HttpHeaders.EXPIRES, 0);
        response.setContentType("image/jpeg");
        
        ServletOutputStream sos = null;
        try {
            sos = response.getOutputStream();
            
            ByteArrayInputStream bais = util.getImage();
            BufferedImage image = ImageIO.read(bais);
            ImageIO.write(image, "jpeg", sos);
            
            sos.flush();
        } catch (IOException e) {
            throw e;
        } finally {
            if (sos != null) {
                sos.close();
            }
        }
    }
    
    /**
     * 获取验证码图片
     * 
     * @return
     */
    @RequestMapping(value = "verifyImage.do")
    @Interceptors(interceptors = { 
            @Interceptor(name = "trace") 
             })
    @ResponseBody
    public Object verifyImage() {
        VerifyImageUtil util = VerifyImageUtil.instance();
        try {
            doSessionOperation(util, getRequest());
            writeVerifyImage(util, getResponse());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        
        return null;
    }
}
