package cn.com.agree.aweb.rbac;

/**
 * 菜单状态
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
public enum MenuState {
    
    /**
     * 可用状态
     */
    ACTIVE("1"), 
    
    /**
     * 被冻结
     */
    FROZEN("2");
    
    
    private String value;
    
    private MenuState(String value) {
        this.value = value;
    }
    
    public String value() {
        return value;
    }
}
