drop database if exists hotel_database;
create database hotel_database;
ALTER DATABASE hotel_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

use hotel_database;

CREATE TABLE IF not EXISTS Admin (
	id integer auto_increment,
    username varchar(50),
    password varchar(255),
    fullname varchar(100),
    identityNumber varchar(20),
	address varchar(255),
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;

CREATE TABLE IF not EXISTS Room (
	id integer auto_increment,
    roomId varchar(50),
    typeId integer,
    status varchar(50),
    note varchar(255),
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;

CREATE TABLE IF not EXISTS RoomType (
	id integer auto_increment,
    typeName varchar(50),
    price integer,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;

CREATE TABLE IF not EXISTS RoomRent (
	id integer auto_increment,
    roomId integer,
	billId integer DEFAULT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;

CREATE TABLE IF not EXISTS Bill (
	id integer auto_increment,
	guestId integer,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;


CREATE TABLE IF not EXISTS Guest (
	id integer auto_increment,
	fullname varchar(100),
    identityNumber varchar(20),
    address varchar(255),
    typeId integer,
    roomRentId integer,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;

CREATE TABLE IF not EXISTS GuestType (
	id integer auto_increment,
    typeName varchar(50),
    coefficient float,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;


CREATE TABLE IF not EXISTS Rule (
	id integer auto_increment,
    `key` varchar(50),
    `value` varchar(50),
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
	updatedAt datetime DEFAULT CURRENT_TIMESTAMP,
  	deletedAt datetime DEFAULT NULL,
    PRIMARY KEY (id)
) ;

alter table Room
add foreign key (typeId) references RoomType(id);

alter table RoomRent
add foreign key (roomId) references Room(id);

alter table RoomRent
add foreign key (billId) references Bill(id);

alter table Bill
add foreign key (guestId) references Guest(id);

alter table Guest
add foreign key (roomRentId) references RoomRent(id);

alter table Guest
add foreign key (typeId) references GuestType(id);

INSERT INTO Admin(username, password, fullname) 
VALUES 
	('admin', '$2b$10$9ZZoQNSOQ4sM38H3pEIIxuVz8n1t0Xhrn7Q60wKXgNpNld2Ee/ziy', 'Lê Trần Đăng Khoa'), 
    ('admin2', '$2b$10$9ZZoQNSOQ4sM38H3pEIIxuVz8n1t0Xhrn7Q60wKXgNpNld2Ee/ziy', 'Lê Nguyễn Thảo Mi'),
    ('admin3', '$2b$10$9ZZoQNSOQ4sM38H3pEIIxuVz8n1t0Xhrn7Q60wKXgNpNld2Ee/ziy', 'Huỳnh Nguyễn Thị Lựu');

INSERT INTO Rule(`key`, value) 
VALUES 
	('maximumGuest', '3'), 
	('surcharge', '0.25'),
    ('surchargeFrom','3');

INSERT INTO RoomType(typeName, price) 
VALUES 
	('A', 150000), 
    ('B', 170000), 
    ('C', 200000);

INSERT INTO Room(roomId, typeId, status, note) 
VALUES 
	('101', 1, 'Trống', 'Không có máy lạnh'), 
    ('102', 2, 'Trống', 'Có máy lạnh'), 
    ('103', 3, 'Trống', 'Có máy lạnh, bồn tắm'),
    ('104', 3, 'Trống', 'Có máy lạnh, bồn tắm'),
    ('201', 1, 'Đang thuê', 'Không có máy lạnh'),
    ('202', 2, 'Đang thuê', 'Có máy lạnh'),
    ('203', 3, 'Trống', 'Có máy lạnh, bồn tắm');

INSERT INTO GuestType(typeName, coefficient) 
VALUES 
	('Nước ngoài', '1.5'), 
    ('Nội địa', '1');
    


INSERT INTO roomrent(roomId, billId)
VALUES
	(6, NULL),
    (6, NULL),
    (4, NULL),
    (3, NULL),
    (2, NULL),
    (1, NULL),
    (5, NULL);
    
INSERT INTO Guest(fullname, identityNumber, address, typeId, roomRentId)
VALUES 
	("Nguyễn Văn A", "123456789012", "Thành phố HCM", 1, 1),
    ("Lê Thị B", "123456789123", "Vũng Tàu", 1, 2),
    ("Trần Thị C", "123456789456", "Đồng Nai", 1, 3),
    ("Arslan Audley", "52137865312", "Newyork, America", 2, 2);

INSERT INTO bill(guestID)
VALUES
	(4);

UPDATE roomrent set billId = 1 where id = 2

	