#-----------------------------------------------------------
#        GREATEST DATABASE IN THE UNIVERSE 
#		hippolyte
#------------------------------------------------------------


#------------------------------------------------------------
# Table: User
#------------------------------------------------------------

CREATE TABLE User(
        id_user      Int  Auto_increment  NOT NULL ,
        pseudo       Varchar (1024) NOT NULL ,
        name         Varchar (1024) NOT NULL ,
        first_name   Varchar (1024) NOT NULL ,
        password     Varchar (64) NOT NULL
	,CONSTRAINT User_PK PRIMARY KEY (id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Lobby
#------------------------------------------------------------

CREATE TABLE Lobby(
        id_lobby    Int  Auto_increment  NOT NULL ,
        label_lobby Varchar (256) NOT NULL ,
        description Varchar (1024) NOT NULL,
        private     Bool NOT NULL
	,CONSTRAINT Lobby_PK PRIMARY KEY (id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: CourseSheet
#------------------------------------------------------------

CREATE TABLE CourseSheet(
        id_course_sheet  Int  Auto_increment  NOT NULL ,
        title            Varchar (256) NOT NULL ,
        publication_date Date NOT NULL ,
        link             Varchar (1024) NOT NULL ,
        id_lobby_Contain Int NOT NULL
	,CONSTRAINT CourseSheet_PK PRIMARY KEY (id_course_sheet)
	,CONSTRAINT CourseSheet_Lobby_FK FOREIGN KEY (id_lobby_Contain) REFERENCES Lobby(id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Rights
#------------------------------------------------------------

CREATE TABLE Rights(
        id_right         Int  Auto_increment  NOT NULL ,
        read_right       Bool NOT NULL ,
        write_right      Bool NOT NULL ,
        id_lobby_Protect Int NOT NULL
	,CONSTRAINT Rights_PK PRIMARY KEY (id_right)
	,CONSTRAINT Rights_Lobby_FK FOREIGN KEY (id_lobby_Protect) REFERENCES Lobby(id_lobby)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Privilege
#------------------------------------------------------------

CREATE TABLE Privilege(
        id_privilege   Int  Auto_increment  NOT NULL ,
        name_privilege Varchar (256) NOT NULL
	,CONSTRAINT Privilege_PK PRIMARY KEY (id_privilege)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Hashtag
#------------------------------------------------------------

CREATE TABLE Hashtag(
        label_hashtag   Varchar (64) NOT NULL ,
        id_course_sheet Int  Auto_increment  NOT NULL
	,CONSTRAINT Hashtag_PK PRIMARY KEY (label_hashtag)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Write
#------------------------------------------------------------

CREATE TABLE Write(
        id_user         Int NOT NULL ,
        id_course_sheet Int NOT NULL
	,CONSTRAINT Write_PK PRIMARY KEY (id_user,id_course_sheet)

	,CONSTRAINT Write_User_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
	,CONSTRAINT Write_CourseSheet0_FK FOREIGN KEY (id_course_sheet) REFERENCES CourseSheet(id_course_sheet)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Have
#------------------------------------------------------------

CREATE TABLE Have(
        id_right Int NOT NULL ,
        id_user  Int NOT NULL
	,CONSTRAINT Have_PK PRIMARY KEY (id_right,id_user)

	,CONSTRAINT Have_Rights_FK FOREIGN KEY (id_right) REFERENCES Rights(id_right)
	,CONSTRAINT Have_User0_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Own
#------------------------------------------------------------

CREATE TABLE Own(
        id_privilege Int NOT NULL ,
        id_user      Int NOT NULL
	,CONSTRAINT Own_PK PRIMARY KEY (id_privilege,id_user)

	,CONSTRAINT Own_Privilege_FK FOREIGN KEY (id_privilege) REFERENCES Privilege(id_privilege)
	,CONSTRAINT Own_User0_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Identify
#------------------------------------------------------------

CREATE TABLE Identify(
        id_course_sheet Int NOT NULL ,
        label_hashtag   Varchar (64) NOT NULL
	,CONSTRAINT Identify_PK PRIMARY KEY (id_course_sheet,label_hashtag)

	,CONSTRAINT Identify_CourseSheet_FK FOREIGN KEY (id_course_sheet) REFERENCES CourseSheet(id_course_sheet)
	,CONSTRAINT Identify_Hashtag0_FK FOREIGN KEY (label_hashtag) REFERENCES Hashtag(label_hashtag)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: isAdmin
#------------------------------------------------------------

CREATE TABLE isAdmin(
        id_user  Int NOT NULL ,
        id_lobby Int NOT NULL
	,CONSTRAINT isAdmin_PK PRIMARY KEY (id_user,id_lobby)

	,CONSTRAINT isAdmin_User_FK FOREIGN KEY (id_user) REFERENCES User(id_user)
	,CONSTRAINT isAdmin_Lobby0_FK FOREIGN KEY (id_lobby) REFERENCES Lobby(id_lobby)
)ENGINE=InnoDB;


/*************** TESTING DATA ************/


/******   USER    ********/


INSERT INTO User VALUES (1,'tomtom','Thomas','Bonnet','root',);
INSERT INTO User VALUES (2,'nana','nabila','benattia','root');


/******   Lobby    ********/

INSERT INTO Lobby VALUES (1,'JAVA 8','Découvrez les nouveautes de JAVA 8 , entre lambda , hmap et compagnie vous ne serez pas decu',TRUE);
INSERT INTO Lobby VALUES (2,'Bases de lassembleur','Plongez dans le monde infernal de lassembleur , un monde ou vous devez faire 10 lignes de codes juste pour faire un print',TRUE);
INSERT INTO Lobby VALUES (3,'Vim est-il facile a apprendre ? ','Retrouver les arguments du perpetuel debat qui a dechiré plus dune familles ',TRUE);
INSERT INTO Lobby VALUES (3,'JAVA SCRIPT ','aucun commentaire',TRUE);


/******   CourseSheet    ********/

INSERT INTO CourseSheet VALUES (1,'Les Lambdas','2019-11-24','ftp://leslambdas.pdf',1);
INSERT INTO CourseSheet VALUES (1,'les registres','2042-12-24','ftp://assembleur.pdf',2);


/******   MESSAGE    ********/

INSERT INTO CourseSheet VALUES (1,'hey les gars.. ca compile pas , vous pouvez maider ?','2019-11-24',1,2);

