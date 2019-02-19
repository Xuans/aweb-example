INSERT INTO aweb_user (USR_ID,USR_USERNAME,USR_PASSWORD,USR_NICKNAME,USR_LASTHOSTADDRESS,USR_MAILBOX,USR_TELEPHONE,USR_CREATEUSER,USR_CREATETIME,USR_UPDATETIME,USR_LASTLOGINTIME,USR_LASTFAILEDLOGINTIME,USR_LOCKTIME,USR_USERTYPE,USR_STATE,USR_FAILEDLOGINCOUNT,USR_REMARK) VALUES ('112233445566','admin123','Mmfm49DajwW8wV/vD3YsCVQnDfJpwLJ8h5IMMPLxCTYRw6KKlKAPnOB+ne3/+XVHKiiAFlusoNfANqSz5D428Q==','管理员','localhost','admin@agree.com','15088888888','admin',to_date('2015-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS'),to_date('2015-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS'),to_date('2015-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS'),null,null,'0','1','0','管理员');

INSERT INTO aweb_role (ROL_ID, ROL_NAME, ROL_CREATEUSER, ROL_CREATETIME, ROL_UPDATETIME, ROL_REMARK) VALUES('admin','admin',null,null,null,'管理员');

INSERT INTO aweb_user_to_role (UTR_ID, UTR_USR_ID, UTR_ROL_ID) VALUES('aaaaaaa','112233445566','admin');

INSERT INTO aweb_menu (MEN_ID, MEN_PID, MEN_NAME, MEN_VALUE,MEN_STATE,MEN_REMARK,MEN_SEQ,MEN_ICON,MEN_LANG,MEN_TYPE) VALUES ('000000','TOP','',null,'2',null,'19','fa-key','zh_CN','LEFT');
INSERT INTO aweb_menu (MEN_ID, MEN_PID, MEN_NAME, MEN_VALUE,MEN_STATE,MEN_REMARK,MEN_SEQ,MEN_ICON,MEN_LANG,MEN_TYPE) VALUES ('userMgr','','用户管理','','1','','0','fa fa-user','zh_CN','left_catalog');
INSERT INTO aweb_menu (MEN_ID, MEN_PID, MEN_NAME, MEN_VALUE,MEN_STATE,MEN_REMARK,MEN_SEQ,MEN_ICON,MEN_LANG,MEN_TYPE) VALUES ('userList','userMgr','用户列表','usrMgr#userMgr#userList','1','','0','','zh_CN','left_catalog');
INSERT INTO aweb_menu (MEN_ID, MEN_PID, MEN_NAME, MEN_VALUE,MEN_STATE,MEN_REMARK,MEN_SEQ,MEN_ICON,MEN_LANG,MEN_TYPE) VALUES ('roleList','userMgr','角色列表','rolMgr#roleMgr#roleList','1','','1','','zh_CN','left_catalog');
INSERT INTO aweb_menu (MEN_ID, MEN_PID, MEN_NAME, MEN_VALUE,MEN_STATE,MEN_REMARK,MEN_SEQ,MEN_ICON,MEN_LANG,MEN_TYPE) VALUES ('changePassword','userMgr','密码修改','changePassword#global#changePassword','1','','2','','zh_CN','left_catalog');

INSERT INTO aweb_role_to_menu (RTM_ID, RTM_ROL_ID, RTM_MEN_ID, RTM_ACCESS) VALUES ('aaaa-bbbb-ccc63','admin','userMgr',20);
INSERT INTO aweb_role_to_menu (RTM_ID, RTM_ROL_ID, RTM_MEN_ID, RTM_ACCESS) VALUES ('aaaa-bbbb-ccc66','admin','userList',20);
INSERT INTO aweb_role_to_menu (RTM_ID, RTM_ROL_ID, RTM_MEN_ID, RTM_ACCESS) VALUES ('aaaa-bbbb-ccc69','admin','roleList',20);
INSERT INTO aweb_role_to_menu (RTM_ID, RTM_ROL_ID, RTM_MEN_ID, RTM_ACCESS) VALUES ('aaaa-bbbb-ccc70','admin','changePassword',20);

/* aweb_access */
INSERT INTO aweb_access (ACC_CODE,ACC_DESC) values (10,'查看权限');
INSERT INTO aweb_access (ACC_CODE,ACC_DESC) values (20,'操作权限');




