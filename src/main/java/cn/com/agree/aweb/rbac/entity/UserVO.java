package cn.com.agree.aweb.rbac.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Pattern;

/**
 * 用户实体
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Entity
@Table(name = "aweb_user")
public class UserVO implements Serializable{

    private static final long serialVersionUID = 1377758581385334563L;

    @Id
    @Column(name = "USR_ID", nullable = false, unique = true)
    private String userId;

    @Pattern(regexp = "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$", groups = { Group_UserParamVali.class },
    message = "用户名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位")
    @Column(name = "USR_USERNAME")
    private String username;

    @Pattern(regexp = "(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})", groups = {
            Group_UserParamVali.class }, message="密码长度需在6-30之间，并且包含数字、字母和符号")
    @Column(name = "USR_PASSWORD")
    private String password;

    @Column(name = "USR_NICKNAME")
    private String nickname;

    @Column(name = "USR_LASTHOSTADDRESS")
    private String lastHostAddress;

    @Column(name = "USR_MAILBOX")
    private String mailbox;

    @Column(name = "USR_TELEPHONE")
    private String telephone;

    @Column(name = "USR_CREATEUSER")
    private String createUser;

    @Column(name = "USR_CREATETIME")
    private Date createTime;

    @Column(name = "USR_UPDATETIME")
    private Date updateTime;

    @Column(name = "USR_LASTLOGINTIME")
    private Date lastLoginTime;

    @Column(name = "USR_LASTFAILEDLOGINTIME")
    private Date lastFailedLoginTime;

    @Column(name = "USR_LOCKTIME")
    private Date lockTime;

    @Column(name = "USR_FAILEDLOGINCOUNT")
    private int failedLoginCount;

    @Column(name = "USR_USERTYPE")
    private String userType;

    @Column(name = "USR_REMARK")
    private String remark;

    public UserVO() {
        try {
            this.userId = UUID.randomUUID().toString();
        } catch (Exception e) {
            
        }
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getMailbox() {
        return mailbox;
    }

    public void setMailbox(String mailbox) {
        this.mailbox = mailbox;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
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

    public Date getLockTime() {
        return lockTime;
    }

    public void setLockTime(Date lockTime) {
        this.lockTime = lockTime;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getLastHostAddress() {
        return lastHostAddress;
    }

    public void setLastHostAddress(String lastHostAddress) {
        this.lastHostAddress = lastHostAddress;
    }

    public Date getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(Date lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public Date getLastFailedLoginTime() {
        return lastFailedLoginTime;
    }

    public void setLastFailedLoginTime(Date lastFailedLoginTime) {
        this.lastFailedLoginTime = lastFailedLoginTime;
    }

    public int getFailedLoginCount() {
        return failedLoginCount;
    }

    public void setFailedLoginCount(int failedLoginCount) {
        this.failedLoginCount = failedLoginCount;
    }

    /**
     * 参数校验分组
     * 
     * @author hefuxiang hefuxiang@agree.com.cn
     * @date 2016年9月18日
     */
    public interface Group_UserParamVali {
    }
}
