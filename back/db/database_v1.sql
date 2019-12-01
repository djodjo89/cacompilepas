#-----------------------------------------------------------
#        GREATEST DATABASE IN THE UNIVERSE 
#------------------------------------------------------------

CREATE DATABASE cacompilepas;
#------------------------------------------------------------
# Table: User
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_user(
        id_user      Int  Auto_increment  NOT NULL ,
        pseudo       Varchar (1024) NOT NULL ,
        name         Varchar (1024) NOT NULL ,
        first_name   Varchar (1024) NOT NULL ,
        password     Varchar (64) NOT NULL
	,CONSTRAINT User_PK PRIMARY KEY (id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: lobby
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_lobby(
        id_lobby    Int  Auto_increment  NOT NULL ,
        label_lobby Varchar (256) NOT NULL ,
        description Varchar (1024) NOT NULL,
        private     Boolean NOT NULL
	,CONSTRAINT lobby_PK PRIMARY KEY (id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: coursesheet
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_coursesheet(
        id_course_sheet  Int  Auto_increment  NOT NULL ,
        title            Varchar (256) NOT NULL ,
        publication_date Date NOT NULL ,
        link             Varchar (1024) NOT NULL ,
        id_lobby_Contain Int NOT NULL
	,CONSTRAINT coursesheet_PK PRIMARY KEY (id_course_sheet)
	,CONSTRAINT coursesheet_lobby_FK FOREIGN KEY (id_lobby_Contain) REFERENCES lobby(id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Rights
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_rights(
        id_right         Int  Auto_increment  NOT NULL ,
        read_right       Boolean NOT NULL ,
        write_right      Boolean NOT NULL ,
        id_lobby_Protect Int NOT NULL
	,CONSTRAINT Rights_PK PRIMARY KEY (id_right)
	,CONSTRAINT Rights_lobby_FK FOREIGN KEY (id_lobby_Protect) REFERENCES lobby(id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Privilege
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_privilege(
        id_privilege   Int  Auto_increment  NOT NULL ,
        name_privilege Varchar (256) NOT NULL
	,CONSTRAINT Privilege_PK PRIMARY KEY (id_privilege)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Hashtag
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_hashtag(
        label_hashtag   Varchar (64) NOT NULL ,
        id_course_sheet Int  Auto_increment  NOT NULL
	,CONSTRAINT Hashtag_PK PRIMARY KEY (label_hashtag)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Write
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_write(
        id_user         Int NOT NULL ,
        id_course_sheet Int NOT NULL
	,CONSTRAINT Write_PK PRIMARY KEY (id_user,id_course_sheet)

	,CONSTRAINT Write_User_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
	,CONSTRAINT Write_coursesheet0_FK FOREIGN KEY (id_course_sheet) REFERENCES coursesheet(id_course_sheet)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Have
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_have(
        id_right Int NOT NULL ,
        id_user  Int NOT NULL
	,CONSTRAINT Have_PK PRIMARY KEY (id_right,id_user)

	,CONSTRAINT Have_Rights_FK FOREIGN KEY (id_right) REFERENCES Rights(id_right)
	,CONSTRAINT Have_User0_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Own
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_own(
        id_privilege Int NOT NULL ,
        id_user      Int NOT NULL
	,CONSTRAINT Own_PK PRIMARY KEY (id_privilege,id_user)

	,CONSTRAINT Own_Privilege_FK FOREIGN KEY (id_privilege) REFERENCES Privilege(id_privilege)
	,CONSTRAINT Own_User0_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Identify
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_identify(
        id_course_sheet Int NOT NULL ,
        label_hashtag   Varchar (64) NOT NULL
	,CONSTRAINT Identify_PK PRIMARY KEY (id_course_sheet,label_hashtag)

	,CONSTRAINT Identify_coursesheet_FK FOREIGN KEY (id_course_sheet) REFERENCES coursesheet(id_course_sheet)
	,CONSTRAINT Identify_Hashtag0_FK FOREIGN KEY (label_hashtag) REFERENCES Hashtag(label_hashtag)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: isAdmin
#------------------------------------------------------------

CREATE TABLE caCompilePas.ccp_isadmin(
        id_user  Int NOT NULL ,
        id_lobby Int NOT NULL
	,CONSTRAINT isAdmin_PK PRIMARY KEY (id_user,id_lobby)

	,CONSTRAINT isAdmin_User_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
	,CONSTRAINT isAdmin_lobby0_FK FOREIGN KEY (id_lobby) REFERENCES lobby(id_lobby)
)ENGINE=InnoDB;


CREATE TABLE caCompilePas.ccp_message(
        id_message Int  Auto_increment  NOT NULL ,
        content    Varchar (1024) NOT NULL ,
        send_date  Date NOT NULL ,
        id_user  Int  Auto_increment  NOT NULL ,
        id_lobby   Int NOT NULL
	,CONSTRAINT _Message_PK PRIMARY KEY (id_message)
	,CONSTRAINT _Message__User_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
	,CONSTRAINT _Message__lobby0_FK FOREIGN KEY (id_lobby) REFERENCES lobby(id_lobby)
)ENGINE=InnoDB;

/*************** TESTING DATA ************/


/******   USER    ********/


INSERT INTO ccp_user VALUES (1,'tomtom','Thomas','Bonnet','root',);
INSERT INTO ccp_user VALUES (2,'nana','nabila','benattia','root');


/******   lobby    ********/

INSERT INTO ccp_lobby VALUES (1,'JAVA 8','Découvrez les nouveautes de JAVA 8 , entre lambda , hmap et compagnie vous ne serez pas decu',TRUE);
INSERT INTO ccp_lobby VALUES (2,'Bases de lassembleur','Plongez dans le monde infernal de lassembleur , un monde ou vous devez faire 10 lignes de codes juste pour faire un print',TRUE);
INSERT INTO ccp_lobby VALUES (3,'Vim est-il facile a apprendre ? ','Retrouver les arguments du perpetuel debat qui a dechiré plus dune familles ',TRUE);
INSERT INTO ccp_lobby VALUES (3,'JAVA SCRIPT ','aucun commentaire',TRUE);


/******   coursesheet    ********/

INSERT INTO ccp_coursesheet VALUES (1,'Les Lambdas','2019-11-24','ftp://leslambdas.pdf',1);
INSERT INTO ccp_coursesheet VALUES (1,'les registres','2042-12-24','ftp://assembleur.pdf',2);


/******   MESSAGE    ********/

INSERT INTO ccp_message VALUES (1,'hey les gars.. ca compile pas , vous pouvez maider ?','2019-11-24',1,2);

