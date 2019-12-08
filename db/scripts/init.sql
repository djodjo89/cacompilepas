#-----------------------------------------------------------
#        GREATEST DATABASE IN THE UNIVERSE 
#------------------------------------------------------------

#------------------------------------------------------------
# Table: ccp_user
#------------------------------------------------------------

CREATE TABLE ccp_user(
        id_user      Int  Auto_increment  NOT NULL ,
        pseudo       Varchar (1024) NOT NULL ,
        name         Varchar (1024) NOT NULL ,
        first_name   Varchar (1024) NOT NULL ,
        password     Varchar (64) NOT NULL,
        email        Varchar (64) NOT NULL
	,CONSTRAINT ccp_user_PK PRIMARY KEY (id_user)
);


#------------------------------------------------------------
# Table: ccp_lobby
#------------------------------------------------------------

CREATE TABLE ccp_lobby(
        id_lobby    Int  Auto_increment  NOT NULL ,
        label_lobby Varchar (256) NOT NULL ,
        description Varchar (1024) NOT NULL,
        private     Boolean NOT NULL
	,CONSTRAINT ccp_lobby_PK PRIMARY KEY (id_lobby)
);


#------------------------------------------------------------
# Table: ccp_coursesheet
#------------------------------------------------------------

CREATE TABLE ccp_coursesheet(
        id_course_sheet  Int  Auto_increment  NOT NULL ,
        title            Varchar (256) NOT NULL ,
        publication_date Date NOT NULL ,
        link             Varchar (1024) NOT NULL ,
        id_lobby_Contain Int NOT NULL
	,CONSTRAINT ccp_coursesheet_PK PRIMARY KEY (id_course_sheet)
	,CONSTRAINT ccp_coursesheet_ccp_lobby_FK FOREIGN KEY (id_lobby_Contain) REFERENCES ccp_lobby(id_lobby)
);


#------------------------------------------------------------
# Table: ccp_rights
#------------------------------------------------------------

CREATE TABLE ccp_rights(
        id_right         Int  Auto_increment  NOT NULL ,
        read_right       Boolean NOT NULL ,
        write_right      Boolean NOT NULL ,
        id_lobby_Protect Int NOT NULL
	,CONSTRAINT ccp_rights_PK PRIMARY KEY (id_right)
	,CONSTRAINT ccp_rights_ccp_lobby_FK FOREIGN KEY (id_lobby_Protect) REFERENCES ccp_lobby(id_lobby)
);


#------------------------------------------------------------
# Table: ccp_privilege
#------------------------------------------------------------

CREATE TABLE ccp_privilege(
        id_privilege   Int  Auto_increment  NOT NULL ,
        name_privilege Varchar (256) NOT NULL
	,CONSTRAINT ccp_privilege_PK PRIMARY KEY (id_privilege)
);


#------------------------------------------------------------
# Table: ccp_hashtag
#------------------------------------------------------------

CREATE TABLE ccp_hashtag(
        label_hashtag   Varchar (64) NOT NULL ,
        id_course_sheet Int  NOT NULL
	,CONSTRAINT ccp_hashtag_PK PRIMARY KEY (label_hashtag)
);


#------------------------------------------------------------
# Table: ccp_write
#------------------------------------------------------------

CREATE TABLE ccp_write(
        id_user         Int NOT NULL ,
        id_course_sheet Int NOT NULL
	,CONSTRAINT ccp_write_PK PRIMARY KEY (id_user,id_course_sheet)

	,CONSTRAINT ccp_write_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user)
	,CONSTRAINT ccp_write_ccp_coursesheet_FK FOREIGN KEY (id_course_sheet) REFERENCES ccp_coursesheet(id_course_sheet)
);


#------------------------------------------------------------
# Table: ccp_have
#------------------------------------------------------------

CREATE TABLE ccp_have(
        id_right Int NOT NULL ,
        id_user  Int NOT NULL
	,CONSTRAINT ccp_have_PK PRIMARY KEY (id_right,id_user)

	,CONSTRAINT ccp_have_ccp_rights_FK FOREIGN KEY (id_right) REFERENCES ccp_rights(id_right)
	,CONSTRAINT ccp_have_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user)
);


#------------------------------------------------------------
# Table: ccp_own
#------------------------------------------------------------

CREATE TABLE ccp_own(
        id_privilege Int NOT NULL ,
        id_user      Int NOT NULL
	,CONSTRAINT ccp_own_PK PRIMARY KEY (id_privilege,id_user)

	,CONSTRAINT ccp_own_ccp_privilege_FK FOREIGN KEY (id_privilege) REFERENCES ccp_privilege(id_privilege)
	,CONSTRAINT ccp_own_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user)
);


#------------------------------------------------------------
# Table: ccp_identify
#------------------------------------------------------------

CREATE TABLE ccp_identify(
        id_course_sheet Int NOT NULL ,
        label_hashtag   Varchar (64) NOT NULL
	,CONSTRAINT identify_PK PRIMARY KEY (id_course_sheet,label_hashtag)

	,CONSTRAINT ccp_identify_ccp_coursesheet_FK FOREIGN KEY (id_course_sheet) REFERENCES ccp_coursesheet(id_course_sheet)
	,CONSTRAINT ccp_identify_ccp_hashtag_FK FOREIGN KEY (label_hashtag) REFERENCES ccp_hashtag(label_hashtag)
);


#------------------------------------------------------------
# Table: ccp_is_admin
#------------------------------------------------------------

CREATE TABLE ccp_is_admin(
        id_user  Int NOT NULL ,
        id_lobby Int NOT NULL
	,CONSTRAINT ccp_is_admin_PK PRIMARY KEY (id_user,id_lobby)

	,CONSTRAINT ccp_is_admin_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user)
	,CONSTRAINT ccp_is_admin_ccp_lobby_FK FOREIGN KEY (id_lobby) REFERENCES ccp_lobby(id_lobby)
);


#------------------------------------------------------------
# Table: ccp_message
#------------------------------------------------------------

CREATE TABLE ccp_message(
        id_message Int  Auto_increment  NOT NULL ,
        content    Varchar (1024) NOT NULL ,
        send_date  Date NOT NULL ,
        id_user  Int  NOT NULL ,
        id_lobby   Int NOT NULL
	,CONSTRAINT ccp_message_PK PRIMARY KEY (id_message)
	,CONSTRAINT ccp_message_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user)
	,CONSTRAINT ccp_message_ccp_lobby_FK FOREIGN KEY (id_lobby) REFERENCES ccp_lobby(id_lobby)
);


#------------------------------------------------------------
# Table: ccp_token
#------------------------------------------------------------

CREATE TABLE ccp_token(
	token Varchar (512) NOT NULL UNIQUE ,
	creation_date DateTime NOT NULL ,
	last_update_date DateTime NOT NULL ,
	id_user Int NOT NULL UNIQUE
        ,CONSTRAINT ccp_token_PK PRIMARY KEY (token)
	,CONSTRAINT ccp_token_ccp_user_FK FOREIGN KEY (id_user) references ccp_user (id_user)
);

SET GLOBAL event_scheduler ="ON";

CREATE EVENT delete_token_event
ON SCHEDULE EVERY 1 MINUTE ENABLE
        DO 
        DELETE FROM ccp_token
        WHERE last_update_date < DATE_SUB(NOW(), INTERVAL 20 MINUTE)
        OR creation_date < DATE_SUB(NOW(), INTERVAL 1 DAY);

/*************** TESTING DATA ************/


/******   ccp_user    ********/


INSERT INTO ccp_user VALUES (1,'tomtom','Thomas','Bonnet','root', 'thomas@cacompilepas.com');
INSERT INTO ccp_user VALUES (2,'nana','nabila','benattia','root', 'nabila@cacompilepas.com');


/******   ccp_lobby    ********/

INSERT INTO ccp_lobby VALUES (1,'JAVA 8','Découvrez les nouveautes de JAVA 8 , entre lambda , hmap et compagnie vous ne serez pas decu',TRUE);
INSERT INTO ccp_lobby VALUES (2,'Bases de lassembleur','Plongez dans le monde infernal de lassembleur , un monde ou vous devez faire 10 lignes de codes juste pour faire un print',TRUE);
INSERT INTO ccp_lobby VALUES (3,'Vim est-il facile a apprendre ? ','Retrouver les arguments du perpetuel debat qui a dechiré plus dune familles ',TRUE);
INSERT INTO ccp_lobby VALUES (4,'JAVASCRIPT ','aucun commentaire',TRUE);


/******   ccp_coursesheet    ********/

INSERT INTO ccp_coursesheet VALUES (1,'Les Lambdas','2019-11-24','ftp://leslambdas.pdf',1);
INSERT INTO ccp_coursesheet VALUES (2,'les registres','2042-12-24','ftp://assembleur.pdf',2);


/******   ccp_message    ********/

INSERT INTO ccp_message VALUES (1,'hey les gars.. ca compile pas , vous pouvez maider ?','2019-11-24',1,2);

