package cn.com.agree.aweb.rbac.entity;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 角色实体
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Entity
@Table(name = "aweb_role")
public class RoleVO {
    
    @Id
    @Column(name = "ROL_ID")
    private String roleId;
    
    @Column(name = "ROL_NAME")
    private String roleName;
    
    @Column(name = "ROL_CREATEUSER")
    private String createUser;
    
    @Column(name = "ROL_CREATETIME")
    private Date createTime;
    
    @Column(name = "ROL_UPDATETIME")
    private Date updateTime;
    
    @Column(name = "ROL_REMARK")
    private String remark;

    public RoleVO() {
        try {
            this.roleId = UUID.randomUUID().toString();
        } catch (Exception e) {
            
        }
    }
    
    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
    
    
}
