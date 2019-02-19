package cn.com.agree.aweb.rbac;

/**
 * 用户类型
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
public enum UserType {
    
    /**
     * 管理员用户
     */
    ADMIN("0"), 
    
    /**
     * 普通用户
     */
    NORMAL("1");
    
    
    private String value;
    
    private UserType(String value) {
        this.value = value;
    }
    
    public String value() {
        return value;
    }
}
