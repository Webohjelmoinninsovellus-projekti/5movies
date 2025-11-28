create table "user"
(
    groupid     integer,
    datecreated date    default CURRENT_DATE not null,
    username    varchar(32)                  not null
        constraint username_pk
            unique,
    avatar_url  varchar(256),
    userid      integer generated always as identity (minvalue 0 maxvalue 65500)
        constraint userid_pk
            primary key,
    password    varchar(128)                 not null,
    "desc"      varchar(256),
    active      boolean default true         not null
);

alter table "user"
    owner to test;

create table user_review
(
    ismovie     boolean default true         not null,
    movieshowid integer                      not null,
    date        date    default CURRENT_DATE not null,
    userid      integer                      not null
        constraint user_review_user_userid_fk
            references "user",
    comment     char(1024),
    reviewid    integer generated always as identity (minvalue 0)
        constraint user_review_id_pk
            primary key,
    rating      integer                      not null
);

alter table user_review
    owner to test;

create table user_favourite
(
    id           integer generated always as identity (minvalue 0),
    movieshowid  integer                      not null,
    user_id      integer                      not null
        constraint user_favourite_user_userid_fk
            references "user",
    date         date    default CURRENT_DATE not null,
    ismovie      boolean default true         not null,
    title        varchar(256),
    poster_path  varchar(256),
    release_year integer
);

alter table user_favourite
    owner to test;

create table "group"
(
    groupid     integer generated always as identity (minvalue 0)
        constraint group_pk
            primary key,
    avatar_url  varchar(256),
    name        varchar(32)                  not null,
    datecreated date    default CURRENT_DATE not null,
    active      boolean default true         not null,
    "desc"      varchar(256)
);

alter table "group"
    owner to test;


