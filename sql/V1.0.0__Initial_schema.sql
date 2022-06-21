create table offering (
    id serial primary key,
    name varchar(100) not null,
    price integer not null
);

create table bundle (
    id serial primary key,
    name varchar(100) not null,
    price integer not null
);

create table bundle_offering (
    bundle_id integer,
    offering_id integer,
    primary key (bundle_id, offering_id),
    foreign key (bundle_id) references bundle (id),
    foreign key (offering_id) references offering (id)
);

create table user_subscription (
    id serial primary key,
    user_id varchar(100),
    bundle_id integer,
    offering_id integer,
    foreign key (bundle_id) references bundle (id),
    foreign key (offering_id) references offering (id),
    constraint check_only_one check ((bundle_id is null) <> (offering_id is null)),
    constraint u_user_sub unique (user_id, bundle_id, offering_id)
);
