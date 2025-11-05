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

create table movies_series
(
    id        integer  not null
        constraint moviesseries_id_pk
            primary key,
    name      char(64) not null,
    year      char(16),
    length    time,
    rating    char(16),
    "desc"    char(128),
    genre     char(32),
    image_url char(64),
    imdb_id   integer
);

alter table movies_series
    owner to test;

create table groupuser
(
    id      integer               not null
        constraint usergroup_id_pk
            primary key,
    groupid integer               not null
        constraint groupuser_group_id_fk
            references "group",
    active  boolean default false not null,
    owner   boolean default false
);

alter table groupuser
    owner to test;

create table users
(
    username    name    not null,
    password    varchar not null,
    userid      integer not null
        constraint userid_pk
            primary key,
    groupid     integer
        constraint users_groupuser_id_fk
            references groupuser
            on delete set null,
    datecreated date,
    avatar_url  char(64)
);

alter table users
    owner to test;

create table user_review
(
    reviewid      integer not null
        constraint user_review_id_pk
            primary key,
    userid        integer not null
        constraint user_review_users_userid_fk
            references users,
    comment       char(128),
    movieseriesid integer
        constraint user_review_movies_series_id_fk
            references movies_series,
    rating        char(16),
    date          date
);

alter table user_review
    owner to test;

create table userfavourite
(
    id               integer not null
        constraint favouriteid
            primary key,
    movies_series_id integer not null
        constraint userfavourite_movies_series_id_fk
            references movies_series,
    user_id          integer not null
        constraint userfavourite_users_userid_fk
            references users,
    date             date
);

alter table userfavourite
    owner to test;

create table groupmovies_series
(
    id               integer not null
        constraint groupmovies_series_pk
            primary key,
    movies_series_id integer not null
        constraint groupmovies_series_movies_series_id_fk
            references movies_series,
    groupid          integer not null
        constraint groupmovies_series_group_id_fk
            references "group",
    date             date
);

alter table groupmovies_series
    owner to test;

create table groupcomment
(
    id      integer not null
        constraint groupcomment_pk
            primary key,
    comment char(128),
    groupid integer not null
        constraint groupcomment_group_id_fk
            references "group",
    userid  integer
        constraint groupcomment_users_userid_fk
            references users,
    title   char(64)
);

alter table groupcomment
    owner to test;


