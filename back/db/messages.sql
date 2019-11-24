#------------------------------------------------------------
# Table: _User
#------------------------------------------------------------

CREATE TABLE _User(
        id_user      Int  Auto_increment  NOT NULL ,
        pseudo       Varchar (1024) NOT NULL ,
        name         Varchar (1024) NOT NULL ,
        first_name   Varchar (1024) NOT NULL ,
        password     Varchar (64) NOT NULL
	,CONSTRAINT _User_PK PRIMARY KEY (id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: _Lobby
#------------------------------------------------------------

CREATE TABLE _Lobby(
        id_lobby    Int  Auto_increment  NOT NULL ,
        label_lobby Varchar (256) NOT NULL ,
        private     Bool NOT NULL
	,CONSTRAINT _Lobby_PK PRIMARY KEY (id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: _Message
#------------------------------------------------------------

CREATE TABLE _Message(
        id_message Int  Auto_increment  NOT NULL ,
        content    Varchar (1024) NOT NULL ,
        send_date  Date NOT NULL ,
        id_sender  Int  Auto_increment  NOT NULL ,
        id_lobby   Int NOT NULL
	,CONSTRAINT _Message_PK PRIMARY KEY (id_message)
	,CONSTRAINT _Message__User_FK FOREIGN KEY (id_user) REFERENCES _User(id_user)
	,CONSTRAINT _Message__Lobby0_FK FOREIGN KEY (id_lobby) REFERENCES _Lobby(id_lobby)
)ENGINE=InnoDB;

