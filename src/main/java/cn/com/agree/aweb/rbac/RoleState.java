package cn.com.agree.aweb.rbac;

/**
 * 权限状态
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
public enum RoleState {
    
    /**
     * 无效状态
     */
    UNUSABLE("0"), 
    
    /**
     * 可用状态
     */
    ACTIVE("1");
    
    
    private String value;
    
    private RoleState(String value) {
        this.value = value;
    }
    
    public String value() {
        return value;
    }
}
