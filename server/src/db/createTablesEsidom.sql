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
	userId      TEXT NOT NULL ,
	entityId    TEXT NOT NULL,
	CONSTRAINT PK_AcessEntity PRIMARY KEY (userId,entityId)
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


