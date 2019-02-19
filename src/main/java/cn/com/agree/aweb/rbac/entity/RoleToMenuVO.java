package cn.com.agree.aweb.rbac.entity;

import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


/**
 * 角色菜单关联实体
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Entity
@Table(name="aweb_role_to_menu")
public class RoleToMenuVO {
    
    @Id
    @Column(name="RTM_ID", unique=true)
    private String id;
    
    @ManyToOne(cascade={CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="RTM_ROL_ID")
    private RoleVO role;
    
    @ManyToOne(cascade={CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="RTM_MEN_ID")
    private MenuVO menu;
    
    @Column(name="RTM_ACCESS")
    private int access;
    
    public RoleToMenuVO(){
        super();
        try {
            this.id = UUID.randomUUID().toString();
        } catch (Exception e) {
            
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RoleVO getRole() {
        return role;
    }

    public void setRole(RoleVO role) {
        this.role = role;
    }

    public MenuVO getMenu() {
        return menu;
    }

    public void setMenu(MenuVO menu) {
        this.menu = menu;
    }

    public int getAccess() {
        return access;
    }

    public void setAccess(int access) {
        this.access = access;
    }
    
}
