package cn.com.agree.aweb.rbac.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.com.agree.aweb.pa.hibernate.HibernateRepository;
import cn.com.agree.aweb.pa.hibernate.param.Parameters;
import cn.com.agree.aweb.rbac.entity.UserToRoleVO;
import cn.com.agree.aweb.rbac.entity.UserVO;

@Service(value="dbBasedService")
public class DBBasedService {
	
	@Autowired
    private HibernateRepository repository;
	
	public  List<?> findBySql(String sql){
		return  repository.findBySql(sql);
	}
	
	public  UserVO findUserById(long accountId){
		return  repository.load(UserVO.class, accountId);
	}
	
	public  List<UserVO> findUserByUsername(String username){
		Parameters parameters = Parameters.parametersBuilder().put("username", username).build();
        List<UserVO> userVOList = repository.findByHql(" from UserVO where username =:username", parameters);
        return userVOList;
	}
	
	public  List<UserToRoleVO> findUserRoleByUserId(String userId){
		Parameters parameters = Parameters.parametersBuilder().put("userId", userId).build();
        List<UserToRoleVO> userToRoleVOList = repository.findByHql(" from UserToRoleVO where UTR_USR_ID=:userId", parameters);
	    return userToRoleVOList;
	}
	
	@Transactional(readOnly=false)
	public  void saveUser(UserVO userVO){
		repository.saveOrUpdate(userVO);
	}

}
