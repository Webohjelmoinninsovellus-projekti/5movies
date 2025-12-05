create table "user"
(
    datecreated       date    default CURRENT_DATE not null,
    username          varchar(32)                  not null
        constraint username_pk
            unique,
    avatar_url        varchar(256),
    userid            integer generated always as identity (minvalue 0 maxvalue 65500)
        constraint userid_pk
            primary key,
    password          varchar(128)                 not null,
    "desc"            varchar(256),
    active            boolean default true         not null,
    deactivation_date date
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
    "desc"      varchar(256),
    owner_id    integer                      not null
        constraint group_user_userid_fk
            references "user"
);

alter table "group"
    owner to test;

create table group_item
(
    groupitemid  serial
        primary key,
    groupid      integer      not null
        references "group"
            on delete cascade,
    movieshowid  integer      not null,
    ismovie      boolean      not null,
    title        varchar(256) not null,
    poster_path  varchar(256),
    release_year integer,
    dateadded    timestamp default CURRENT_TIMESTAMP
);

alter table group_item
    owner to test;

create table user_group
(
    id       integer generated always as identity (minvalue 0)
        constraint user_group_pk
            primary key,
    user_id  integer               not null
        constraint user_group_user_userid_fk
            references "user",
    group_id integer               not null
        constraint user_group_group_groupid_fk
            references "group"
            on delete cascade,
    active   boolean default false not null
);

alter table user_group
    owner to test;

create table group_join_request
(
    requestid     integer generated always as identity
        constraint group_join_request_pk
            primary key,
    user_id       integer                                          not null
        constraint group_join_request_user_fk
            references "user",
    group_id      integer                                          not null
        constraint group_join_request_group_fk
            references "group"
            on delete cascade,
    status        varchar(20) default 'pending'::character varying not null,
    request_date  timestamp   default CURRENT_TIMESTAMP            not null,
    response_date timestamp
);

alter table group_join_request
    owner to test;

create unique index group_join_request_unique
    on group_join_request (user_id, group_id)
    where ((status)::text = 'pending'::text);


