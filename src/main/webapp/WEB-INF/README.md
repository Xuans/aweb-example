# 初始化web.xml：


```xml
<?xml version="1.0" encoding="UTF-8"?>

<web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="3.0" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">  
  <display-name>aweb-project-demo</display-name>  
  <description>基于AWeb平台搭建的测试项目</description>  
  <!-- 登陆页面 -->  
  <welcome-file-list> 
    <welcome-file>module/index/index.html</welcome-file> 
  </welcome-file-list>  
  <!-- 默认session超时时间 -->  
  <session-config> 
    <session-timeout>30</session-timeout> 
  </session-config>  
  <!-- 参数 -->  
  <context-param> 
    <param-name>webAppRootKey</param-name>  
    <param-value>aweb.web.root</param-value> 
  </context-param>  
  <context-param> 
    <param-name>contextConfigLocation</param-name>  
    <param-value>classpath*:spring.xml, classpath*:spring-*.xml</param-value> 
  </context-param>  
  <!-- listeners -->  
 
  <listener> 
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class> 
  </listener>  
  <!-- 数据源配置 -->  
  
  <!-- ASAPI提供的过滤器 -->  
  <filter> 
    <filter-name>httpInjection</filter-name>  
    <filter-class>cn.com.agree.aweb.asapi.filters.ASAPIFilter</filter-class>  
  </filter>  
  <filter-mapping> 
    <filter-name>httpInjection</filter-name>  
    <url-pattern>/*</url-pattern> 
  </filter-mapping>  
  
  <!-- 恶意字符转义 -->  
  <filter> 
    <filter-name>simpleParameterEscapeFilter</filter-name>  
    <filter-class>cn.com.agree.aweb.asapi.filters.SimpleParameterEscapeFilter</filter-class>  
    <async-supported>true</async-supported>  
    <init-param> 
      <param-name>escape-key</param-name>  
      <param-value>&amp;||&lt;||&gt;</param-value> 
    </init-param>  
    <init-param> 
      <param-name>escape-val</param-name>  
      <param-value>&amp;amp;||&amp;lt;||&amp;gt;</param-value> 
    </init-param> 
  </filter>  
  <filter-mapping> 
    <filter-name>simpleParameterEscapeFilter</filter-name>  
    <url-pattern>/*</url-pattern> 
  </filter-mapping>  

  <!-- SpringMVC -->  
  <servlet> 
    <servlet-name>springMVCServlet</servlet-name>  
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
    <init-param> 
      <param-name>contextConfigLocation</param-name>  
      <param-value>WEB-INF/classes/springmvc.xml</param-value> 
    </init-param>  
    <load-on-startup>1</load-on-startup>  
    <async-supported>true</async-supported> 
  </servlet>  
  <servlet-mapping> 
    <servlet-name>springMVCServlet</servlet-name>  
    <url-pattern>/</url-pattern> 
  </servlet-mapping>  
  
</web-app>


```

