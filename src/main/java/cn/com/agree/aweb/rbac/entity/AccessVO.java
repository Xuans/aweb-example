package cn.com.agree.aweb.rbac.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * 
 * @author  lanzhanhong
 * @date 2018年12月7日  
 * @version 1.0
 */
@Entity
@Table(name="aweb_access")
public class AccessVO implements Serializable{

    private static final long serialVersionUID = 7194777429655604609L;
    
    @Id
    @Column(name="ACC_CODE")
    private int accCode;
    @Id
    @Column(name="ACC_DESC")
    private String accDesc;
    
    public int getAccCode() {
        return accCode;
    }
    public void setAccCode(int accCode) {
        this.accCode = accCode;
    }
    public String getAccDesc() {
        return accDesc;
    }
    public void setAccDesc(String accDesc) {
        this.accDesc = accDesc;
    }
    
}
