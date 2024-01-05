create table _newsletters_template
(
    id          bigserial primary key,
    description varchar(255)                        null,
    created_at  timestamp default CURRENT_TIMESTAMP not null,
    updated_at  timestamp default CURRENT_TIMESTAMP not null
);