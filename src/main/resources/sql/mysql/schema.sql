/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2016/3/24 15:04:24                           */
/*==============================================================*/


drop table if exists aweb_global;
drop table if exists aweb_menu;
drop table if exists aweb_role;
drop table if exists aweb_role_to_menu;
drop table if exists aweb_url_access;
drop table if exists aweb_user;
drop table if exists aweb_user_login;
drop table if exists aweb_user_to_role;
drop table if exists aweb_access;

/*==============================================================*/
/* Table: aweb_global                                           */
/*==============================================================*/
create table aweb_global
(
   GLB_KEY              varchar(200) comment '常量的键',
   GLB_VALUE            varchar(200) comment '常量的值',
   GLB_DESC             varchar(200) comment '描述'
);

alter table aweb_global comment '全局键值对表';

/*==============================================================*/
/* Table: aweb_user                                             */
/*==============================================================*/
create table aweb_user
(
   USR_ID               varchar(50) not null,
   USR_USERNAME         varchar(50) comment '用户名',
   USR_PASSWORD         varchar(300) comment '密码',
   USR_NICKNAME         varchar(50) comment '昵称',
   USR_LASTHOSTADDRESS  varchar(20) comment '用户ip',
   USR_MAILBOX          varchar(50) comment '邮箱',
   USR_TELEPHONE        varchar(20) comment '电话号码',
   USR_CREATEUSER       varchar(50) comment '创建用户',
   USR_CREATETIME       varchar(30) comment '创建时间',
   USR_UPDATETIME       varchar(30) comment '更新时间',
   USR_LASTLOGINTIME        varchar(30) comment '最后登录成功时间',
   USR_LASTFAILEDLOGINTIME        varchar(30) comment '最后登录失败时间',
   USR_LOCKTIME         varchar(30) comment '锁定开始时间',
   USR_FAILEDLOGINCOUNT varchar(2) default 0 comment '连续登录错误次数',
   USR_STATE            varchar(1) comment '状态 0:未生效，1:生效 , 2:锁定',
   USR_USERTYPE         varchar(1) comment '用户类型，0:管理员，1:普通用户',
   USR_REMARK           varchar(200) comment '备注',
   primary key (USR_ID)
);

alter table aweb_user comment '用户表';

/*==============================================================*/
/* Table: aweb_menu                                             */
/*==============================================================*/
create table aweb_menu
(  
   MEN_ID               varchar(50) not null,
   MEN_PID              varchar(50) comment '父节点ID',
   MEN_NAME             varchar(100) comment '节点名',
   MEN_VALUE            varchar(200) comment 'url值，为空时，无对应的页面',
   MEN_STATE            varchar(1),
   MEN_REMARK           varchar(200) comment '备注信息',
   MEN_SEQ              varchar(5) comment '菜单序号',
   MEN_ICON             varchar(100) comment '菜单图标',
   MEN_LANG             varchar(10) comment '菜单项语言',
   MEN_TYPE             varchar(20) comment '菜单渲染位置',
   primary key (MEN_ID)
);

alter table aweb_menu comment '菜单表';

/*==============================================================*/
/* Table: aweb_role                                             */
/*==============================================================*/
create table aweb_role
(
   ROL_ID               varchar(50) not null,
   ROL_NAME             varchar(100) comment '角色名',
   ROL_CREATEUSER       varchar(50) comment '创建用户',
   ROL_CREATETIME       varchar(30) comment '创建时间',
   ROL_UPDATETIME       varchar(30) comment '更新时间',
   ROL_REMARK           varchar(200) comment '备注',
   primary key (ROL_ID)
);

alter table aweb_role comment '角色表';

/*==============================================================*/
/* Table: aweb_user_to_role                                     */
/*==============================================================*/
create table aweb_user_to_role
(
   UTR_ID               varchar(50) not null,
   UTR_USR_ID           varchar(50) comment '用户ID',
   UTR_ROL_ID           varchar(50) comment '角色ID',
   primary key (UTR_ID)
);

alter table aweb_user_to_role comment '用户角色关联表';

/*==============================================================*/
/* Table: aweb_role_to_menu                                     */
/*==============================================================*/
create table aweb_role_to_menu
(
   RTM_ID               varchar(50) not null,
   RTM_ROL_ID           varchar(50) comment '角色ID',
   RTM_MEN_ID           varchar(50) comment '菜单ID',
   RTM_ACCESS            integer(1) comment '角色对应菜单的等级',
   primary key (RTM_ID)
);

alter table aweb_role_to_menu comment '角色菜单关联表';

/*==============================================================*/
/* Table: aweb_url_access                                        */
/*==============================================================*/
create table aweb_url_access
(
   URL_ID               varchar(200) not null,
   URL_ACCESS           integer,
   URL_MEN_ID           varchar(100) not null,
   URL_DESC             varchar(100),
   primary key (URL_ID)
);

alter table aweb_url_access comment 'URL权限级别表';

/*==============================================================*/
/* Table: aweb_user_login                                       */
/*==============================================================*/
create table aweb_user_login
(
   ULG_USER_ID          varchar(50) not null comment '用户名',
   ULG_SESSIONID        varchar(50) not null comment 'Session会话ID',
   ULG_LASTHOST         varchar(25) not null comment '最后登录HOST',
   primary key (ULG_USER_ID)
);

alter table aweb_user_login comment '用户登录表';

/*==============================================================*/
/* Table: aweb_access                                           */
/*==============================================================*/
create table aweb_access 
(
   ACC_CODE             integer(1)  null comment '权限码',
   ACC_DESC             varchar(100) null comment '描述'
);

alter table aweb_access comment '权限表';

