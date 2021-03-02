------------------------------------------------------------
--        Script SQLite  
------------------------------------------------------------


------------------------------------------------------------
-- Table: HAGroup
------------------------------------------------------------
CREATE TABLE HAGroup(
	entityId    TEXT NOT NULL ,
	Name       TEXT NOT NULL,
	CONSTRAINT PK_HAGroup PRIMARY KEY (entityId)
);

------------------------------------------------------------
-- Table: AcessEntity
------------------------------------------------------------
CREATE TABLE AccessEntity(
	userId      INTEGER NOT NULL ,
	entityId    TEXT NOT NULL,
	CONSTRAINT PK_AccessEntity PRIMARY KEY (userId,entityId),
	CONSTRAINT FK_AccessEntity0 FOREIGN KEY (userId) REFERENCES User(id),
	CONSTRAINT FK_AccessEntity1 FOREIGN KEY (entityId) REFERENCES Entity(id)
);


------------------------------------------------------------
-- Table: InsideGroup
------------------------------------------------------------
CREATE TABLE InsideGroup(
	entityId    TEXT NOT NULL ,
	groupEntityId     TEXT NOT NULL,
	CONSTRAINT PK_InsideGroup PRIMARY KEY (entityId,groupEntityId)
	,CONSTRAINT FK_InsideGroup_HAGroup0 FOREIGN KEY (groupEntityId) REFERENCES HAGroup(entityId)
);

------------------------------------------------------------
-- Table: User
------------------------------------------------------------
CREATE TABLE User (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	username	TEXT NOT NULL UNIQUE,
	admin	INTEGER NOT NULL
);

------------------------------------------------------------
-- Table: Entity
------------------------------------------------------------
CREATE TABLE Entity (
	id TEXT NOT NULL,
	PRIMARY KEY(id)
);

