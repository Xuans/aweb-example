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
 * 用户角色关联实体
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Entity
@Table(name="aweb_user_to_role")
public class UserToRoleVO {
    
    @Id
    @Column(name="UTR_ID", unique=true)
    private String id;
    
    @ManyToOne(cascade={CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="UTR_USR_ID")
    private UserVO user;
    
    @ManyToOne(cascade={CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name="UTR_ROL_ID")
    private RoleVO role;
    
    public UserToRoleVO(){
        super();
        try {
            this.id = "";
        } catch (Exception e) {
            
        }
    }

    public UserToRoleVO(UserVO user, RoleVO role) {
        try {
            this.id = UUID.randomUUID().toString();
        } catch (Exception e) {
            
        }
        this.setUser(user);
        this.setRole(role);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserVO getUser() {
        return user;
    }

    public void setUser(UserVO user) {
        this.user = user;
    }

    public RoleVO getRole() {
        return role;
    }

    public void setRole(RoleVO role) {
        this.role = role;
    }
    

    
}
