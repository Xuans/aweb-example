package cn.com.agree.aweb.rbac.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 菜单实体类
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Entity
@Table(name="aweb_menu")
public class MenuVO {
    
    @Id
    @Column(name="MEN_ID", unique=true)
    private String id;

    @Column(name="MEN_PID")
    private String pId;

    @Column(name="MEN_NAME")
    private String name;

    @Column(name="MEN_VALUE")
    private String value;

    @Column(name="MEN_STATE")
    private String state;
    
    @Column(name="MEN_REMARK")
    private String remark;
    
    @Column(name="MEN_SEQ")
    private String seq;
    
    @Column(name="MEN_ICON")
    private String icon;
    
    @Column(name="MEN_LANG")
    private String lang;
    
    @Column(name="MEN_TYPE")
    private String type;
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getpId() {
        return pId;
    }

    public void setpId(String pId) {
        this.pId = pId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getSeq() {
        return seq;
    }

    public void setSeq(String seq) {
        this.seq = seq;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
