--==============================================================
-- DBMS name:      IBM DB2 UDB 9.5 Common Server
-- Created on:     2016/9/25 1:10:30
--==============================================================


--==============================================================
-- Table: aweb_access
--==============================================================
create table aweb_access
(
   ACC_CODE             INTEGER,
   ACC_DESC             VARCHAR(100)
);

comment on table aweb_access is
'权限表';

comment on column aweb_access.ACC_CODE is
'权限码';

comment on column aweb_access.ACC_DESC is
'描述';

--==============================================================
-- Table: aweb_global
--==============================================================
create table aweb_global
(
   GLB_KEY              VARCHAR(200),
   GLB_VALUE            VARCHAR(200),
   GLB_DESC             VARCHAR(200)
);

comment on table aweb_global is
'全局键值对表';

comment on column aweb_global.GLB_KEY is
'常量的键';

comment on column aweb_global.GLB_VALUE is
'常量的值';

comment on column aweb_global.GLB_DESC is
'描述';

--==============================================================
-- Table: aweb_menu
--==============================================================
create table aweb_menu
(
   MEN_ID               VARCHAR(50)             not null,
   MEN_PID              VARCHAR(50),
   MEN_NAME             VARCHAR(100),
   MEN_VALUE            VARCHAR(200),
   MEN_ISPARENT         VARCHAR(5),
   MEN_STATE            VARCHAR(1),
   MEN_REMARK           VARCHAR(200),
   MEN_LEVEL            VARCHAR(1),
   MEN_SEQ              VARCHAR(5),
   MEN_ICON             VARCHAR(100),
   MEN_LANG             VARCHAR(10),
   MEN_TYPE             varchar(20),
   constraint P_Key_1 primary key (MEN_ID)
);

comment on table aweb_menu is
'菜单表';

comment on column aweb_menu.MEN_PID is
'父节点ID';

comment on column aweb_menu.MEN_NAME is
'节点名';

comment on column aweb_menu.MEN_VALUE is
'url值，为空时，无对应的页面';

comment on column aweb_menu.MEN_ISPARENT is
'是否为父节点';

comment on column aweb_menu.MEN_REMARK is
'备注信息';

comment on column aweb_menu.MEN_LEVEL is
'菜单层级';

comment on column aweb_menu.MEN_SEQ is
'菜单序号';

comment on column aweb_menu.MEN_ICON is
'菜单图标';

comment on column aweb_menu.MEN_LANG is
'菜单项语言';

comment on column aweb_menu.MEN_TYPE is
'菜单渲染位置';

--==============================================================
-- Table: aweb_role
--==============================================================
create table aweb_role
(
   ROL_ID               VARCHAR(50)            not null,
   ROL_NAME             VARCHAR(100),
   ROL_CREATEUSER       VARCHAR(50),
   ROL_CREATETIME       VARCHAR(30),
   ROL_UPDATETIME       VARCHAR(30),
   ROL_REMARK           VARCHAR(200),
   constraint P_Key_1 primary key (ROL_ID)
);

comment on table aweb_role is
'角色表';

comment on column aweb_role.ROL_NAME is
'角色名';

comment on column aweb_role.ROL_CREATEUSER is
'创建用户';

comment on column aweb_role.ROL_CREATETIME is
'创建时间';

comment on column aweb_role.ROL_UPDATETIME is
'更新时间';

comment on column aweb_role.ROL_REMARK is
'备注';

--==============================================================
-- Table: aweb_role_to_menu
--==============================================================
create table aweb_role_to_menu
(
   RTM_ID               VARCHAR(50)            not null,
   RTM_ROL_ID           VARCHAR(50),
   RTM_MEN_ID           VARCHAR(50),
   RTM_ACCESS           INTEGER,
   constraint P_Key_1 primary key (RTM_ID)
);

comment on table aweb_role_to_menu is
'角色菜单关联表';

comment on column aweb_role_to_menu.RTM_ROL_ID is
'角色ID';

comment on column aweb_role_to_menu.RTM_MEN_ID is
'菜单ID';

comment on column aweb_role_to_menu.RTM_ACCESS is
'角色对应菜单的等级';

--==============================================================
-- Table: aweb_url_access
--==============================================================
create table aweb_url_access
(
   URL_ID               VARCHAR(200)           not null,
   URL_ACCESS           INTEGER,
   URL_MEN_ID           VARCHAR(100)           not null,
   URL_DESC             VARCHAR(100),
   constraint P_Key_1 primary key (URL_ID)
);

comment on table aweb_url_access is
'URL权限级别表';

--==============================================================
-- Table: aweb_user
--==============================================================
create table aweb_user
(
   USR_ID               VARCHAR(50)            not null,
   USR_USERNAME         VARCHAR(50),
   USR_PASSWORD         VARCHAR(300),
   USR_NICKNAME         VARCHAR(50),
   USR_LASTHOSTADDRESS  VARCHAR(20),
   USR_MAILBOX          VARCHAR(50),
   USR_TELEPHONE        VARCHAR(20),
   USR_CREATEUSER       VARCHAR(50),
   USR_CREATETIME       VARCHAR(30),
   USR_UPDATETIME       VARCHAR(30),
   USR_LASTLOGINTIME    VARCHAR(30),
   USR_LASTFAILEDLOGINTIME VARCHAR(30),
   USR_LOCKTIME         VARCHAR(30),
   USR_FAILEDLOGINCOUNT VARCHAR(2)             default '0',
   USR_STATE            VARCHAR(1),
   USR_USERTYPE         VARCHAR(1),
   USR_REMARK           VARCHAR(200),
   constraint P_Key_1 primary key (USR_ID)
);

comment on table aweb_user is
'用户表';

comment on column aweb_user.USR_USERNAME is
'用户名';

comment on column aweb_user.USR_PASSWORD is
'密码';

comment on column aweb_user.USR_NICKNAME is
'昵称';

comment on column aweb_user.USR_LASTHOSTADDRESS is
'用户ip';

comment on column aweb_user.USR_MAILBOX is
'邮箱';

comment on column aweb_user.USR_TELEPHONE is
'电话号码';

comment on column aweb_user.USR_CREATEUSER is
'创建用户';

comment on column aweb_user.USR_CREATETIME is
'创建时间';

comment on column aweb_user.USR_UPDATETIME is
'更新时间';

comment on column aweb_user.USR_LASTLOGINTIME is
'最后登录成功时间';

comment on column aweb_user.USR_LASTFAILEDLOGINTIME is
'最后登录失败时间';

comment on column aweb_user.USR_LOCKTIME is
'锁定开始时间';

comment on column aweb_user.USR_FAILEDLOGINCOUNT is
'连续登录错误次数';

comment on column aweb_user.USR_STATE is
'状态 0:未生效，1:生效 , 2:锁定';

comment on column aweb_user.USR_USERTYPE is
'用户类型，0:管理员，1:普通用户';

comment on column aweb_user.USR_REMARK is
'备注';

--==============================================================
-- Table: aweb_user_login
--==============================================================
create table aweb_user_login
(
   ULG_USER_ID          VARCHAR(50)            not null,
   ULG_SESSIONID        VARCHAR(50)            not null,
   ULG_LASTHOST         VARCHAR(25)            not null,
   constraint P_Key_1 primary key (ULG_USER_ID)
);

comment on table aweb_user_login is
'用户登录表';

comment on column aweb_user_login.ULG_USER_ID is
'用户名';

comment on column aweb_user_login.ULG_SESSIONID is
'Session会话ID';

comment on column aweb_user_login.ULG_LASTHOST is
'最后登录HOST';

--==============================================================
-- Table: aweb_user_to_role
--==============================================================
create table aweb_user_to_role
(
   UTR_ID               VARCHAR(50)            not null,
   UTR_USR_ID           VARCHAR(50),
   UTR_ROL_ID           VARCHAR(50),
   constraint P_Key_1 primary key (UTR_ID)
);

comment on table aweb_user_to_role is
'用户角色关联表';

comment on column aweb_user_to_role.UTR_USR_ID is
'用户ID';

comment on column aweb_user_to_role.UTR_ROL_ID is
'角色ID';

