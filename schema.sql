drop database schola;
create database schola;

use schola;

create table users (
  id varchar(8) unique not null,
  firebase_id varchar(64) unique not null,
  display_name varchar(255),
  account_name varchar(24) unique not null,
  notify_on_purchase_mail boolean,
  notify_on_purchase_web boolean,
  notify_on_review_mail boolean,
  notify_on_review_web boolean,
  notify_on_update_mail boolean,
  notify_on_update_web boolean,
  profile_message mediumtext,
  majors mediumtext,
  photo_id varchar(8),
  twitter varchar(64),
  web varchar(255),
  facebook varchar(64),
  banned boolean,
  fulltext (display_name,profile_message,majors) with parser ngram
) engine=innodb character set utf8mb4;

create table texts(
  id varchar(8) unique not null,
  author_id varchar(8) not null,
  title varchar(255),
  state smallint,
  abstract mediumtext,
  explanation mediumtext,
  photo_id varchar(8),
  price smallint,
  chapter_order varchar(1024),
  category1 varchar(3),
  category2 varchar(3),
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  number_of_updated mediumint not null,
  number_of_sales int not null,
  number_of_reviews int not null,
  is_best_seller boolean not null,
  learning_contents varchar(1048),
  learning_requirements varchar(1048),
  rate float,
  rate_ratio_1 tinyint, 
  rate_ratio_2 tinyint, 
  rate_ratio_3 tinyint, 
  rate_ratio_4 tinyint, 
  rate_ratio_5 tinyint,
  is_public boolean not null,
  notice mediumtext,
  fulltext (title,abstract,learning_contents,learning_requirements) with parser ngram,
  constraint cst_texts_author_id
    foreign key (author_id)
    references users (id)
) engine=innodb character set utf8mb4;

create table chapters (
  id varchar(8) unique not null,
  text_id varchar(8) not null,
  is_trial_reading_available boolean not null,
  title varchar(255),
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  content mediumtext,
  number_of_characters tinyint,
  toc text,
  fulltext (title,content) with parser ngram,
  constraint cst_chapters_text_id
    foreign key (text_id)
    references texts (id)
) engine=innodb character set utf8mb4;

create table purchases (
  user_id varchar(8) not null,
  text_id varchar(8) not null,
  created_at timestamp not null default current_timestamp,
  constraint cst_purchases_user_id
    foreign key (user_id)
    references users (id),
  constraint cst_purchases_text_id
    foreign key (text_id)
    references texts(id),
  primary key(user_id, text_id)
) engine=innodb character set utf8mb4;

create table reviews (
  id varchar(8) unique not null,
  user_id varchar(8) not null,
  text_id varchar(8) not null,
  title varchar(128) not null,
  rate tinyint not null,
  comment mediumtext not null,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  fulltext (title,comment) with parser ngram,
  constraint cst_reviews_user_id
    foreign key (user_id)
    references users (id),
  constraint cst_reviews_text_id
    foreign key (text_id)
    references texts(id),
  primary key(user_id, text_id)
) engine=innodb character set utf8mb4;

create table notices (
  id varchar(8) unique not null,
  user_id varchar(8) not null,
  message varchar(512) not null,
  url varchar(256) not null,
  created_at timestamp not null default current_timestamp,
  readed boolean
) engine=innodb character set utf8mb4;

create table accesslogs (
  created_at timestamp not null default current_timestamp,
  host varchar(255) not null,
  text_id varchar(8) not null,
  constraint cst_accesslogs_text_id
    foreign key (text_id)
    references texts (id)
) engine=innodb character set utf8mb4;