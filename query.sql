create table master_kategori(
    id bigint not null primary key auto_increment,
    name varchar(20) not null,
    created_at datetime default current_timestamp,
    updated_at datetime default null,
    deleted_at datetime default null
);

insert into master_kategori(name, created_at) values
('Saat Upacara', 'Hari Biasa');

create table pasien(
    id bigint not null primary key auto_increment,
    name varchar(100) not null,
    kelas varchar(6) not null,
    kategori_id bigint not null,
    date date not null,
    time time not null,
    keluhan text not null,
    penanganan text not null,
    created_at datetime default current_timestamp,
    updated_at datetime default null,
    deleted_at datetime default null
);