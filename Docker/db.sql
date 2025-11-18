create table "group"
(
    id     integer  not null
        constraint groupid_pk
            primary key,
    name   char(45) not null,
    "desc" char(128)
);

alter table "group"
    owner to test;

create table group_user
(
    id      integer               not null
        constraint usergroup_id_pk
            primary key,
    groupid integer               not null
        constraint group_user_group_id_fk
            references "group",
    active  boolean default false not null,
    owner   boolean default false
);

alter table group_user
    owner to test;

create table "user"
(
    username    varchar(32) not null,
    password    varchar(32) not null,
    userid      integer     not null
        constraint userid_pk
            primary key,
    groupid     integer
        constraint user_groupuser_id_fk
            references group_user
            on delete set null,
    datecreated date,
    avatar_url  char(64)
);

alter table "user"
    owner to test;

create table user_review
(
    reviewid    integer                       not null
        constraint user_review_id_pk
            primary key,
    userid      integer                       not null
        constraint user_review_users_userid_fk
            references "user",
    comment     char(128),
    movieshowid integer default '-1'::integer not null,
    rating      char(16),
    date        date,
    ismovie     boolean default true          not null
);

alter table user_review
    owner to test;

create table user_favourite
(
    id          integer              not null
        constraint favouriteid
            primary key,
    movieshowid integer              not null,
    user_id     integer              not null
        constraint userfavourite_users_userid_fk
            references "user",
    date        date,
    ismovie     boolean default true not null
);

alter table user_favourite
    owner to test;

create table group_movieshow
(
    id          integer              not null
        constraint group_movieshow_pk
            primary key,
    movieshowid integer              not null,
    groupid     integer              not null
        constraint group_movieshow_group_id_fk
            references "group",
    date        date,
    ismovie     boolean default true not null
);

alter table group_movieshow
    owner to test;

create table group_comment
(
    id      integer not null
        constraint group_comment_pk
            primary key,
    comment char(128),
    groupid integer not null
        constraint group_comment_group_id_fk
            references "group",
    userid  integer
        constraint groupcomment_users_userid_fk
            references "user",
    title   char(64)
);

alter table group_comment
    owner to test;


