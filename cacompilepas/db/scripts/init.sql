#-----------------------------------------------------------
#        GREATEST DATABASE IN THE UNIVERSE 
#------------------------------------------------------------

#------------------------------------------------------------
# Table: ccp_user
#------------------------------------------------------------

CREATE TABLE ccp_user(
        id_user      Int  Auto_increment  NOT NULL ,
        pseudo       Varchar (1024) NOT NULL ,
        first_name         Varchar (1024) NOT NULL ,
        last_name   Varchar (1024) NOT NULL ,
        icon         Varchar (1024) NOT NULL ,
        password     Varchar (256)  NOT NULL ,
        email        Varchar (64)   NOT NULL UNIQUE
	,CONSTRAINT ccp_user_PK PRIMARY KEY (id_user)
);


#------------------------------------------------------------
# Table: ccp_lobby
#------------------------------------------------------------

CREATE TABLE ccp_lobby(
        id_lobby    Int  Auto_increment  NOT NULL ,
        label_lobby Varchar (256) NOT NULL ,
        description Varchar (1024) NOT NULL ,
        logo        Varchar (1024) NOT NULL ,
        private     Boolean NOT NULL
	,CONSTRAINT ccp_lobby_PK PRIMARY KEY (id_lobby)
);


#------------------------------------------------------------
# Table: ccp_coursesheet
#------------------------------------------------------------

CREATE TABLE ccp_coursesheet(
        id_course_sheet  Int  Auto_increment  NOT NULL ,
        title            Varchar (256) NOT NULL ,
        publication_date DateTime NOT NULL ,
        file_name        Varchar (1024) NOT NULL ,
        description      Varchar (2056) NOT NULL,
        id_lobby_contain Int NOT NULL
	,CONSTRAINT ccp_coursesheet_PK PRIMARY KEY (id_course_sheet)
	,CONSTRAINT ccp_coursesheet_ccp_lobby_FK FOREIGN KEY (id_lobby_contain) REFERENCES ccp_lobby(id_lobby) ON DELETE CASCADE
);


#------------------------------------------------------------
# Table: ccp_rights
#------------------------------------------------------------

CREATE TABLE ccp_rights(
        id_right         Int  Auto_increment  NOT NULL ,
        read_right       Boolean NOT NULL ,
        write_right      Boolean NOT NULL ,
        id_lobby_protect Int NOT NULL ,
        id_user          Int NOT NULL
	,CONSTRAINT ccp_rights_PK PRIMARY KEY (id_right)
	,CONSTRAINT ccp_rights_ccp_lobby_FK FOREIGN KEY (id_lobby_protect) REFERENCES ccp_lobby(id_lobby) ON DELETE CASCADE
        ,CONSTRAINT ccp_rights_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user) ON DELETE CASCADE
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
	,CONSTRAINT ccp_hashtag_PK PRIMARY KEY (label_hashtag, id_course_sheet)
);


#------------------------------------------------------------
# Table: ccp_write
#------------------------------------------------------------

CREATE TABLE ccp_write(
        id_user         Int NOT NULL ,
        id_course_sheet Int NOT NULL
	,CONSTRAINT ccp_write_PK PRIMARY KEY (id_user,id_course_sheet)

	,CONSTRAINT ccp_write_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user) ON DELETE CASCADE
	,CONSTRAINT ccp_write_ccp_coursesheet_FK FOREIGN KEY (id_course_sheet) REFERENCES ccp_coursesheet(id_course_sheet) ON DELETE CASCADE
);


#------------------------------------------------------------
# Table: ccp_have
#------------------------------------------------------------

CREATE TABLE ccp_have(
        id_right Int NOT NULL ,
        id_user  Int NOT NULL
	,CONSTRAINT ccp_have_PK PRIMARY KEY (id_right,id_user)

	,CONSTRAINT ccp_have_ccp_rights_FK FOREIGN KEY (id_right) REFERENCES ccp_rights(id_right) ON DELETE CASCADE
	,CONSTRAINT ccp_have_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user) ON DELETE CASCADE
);


#------------------------------------------------------------
# Table: ccp_own
#------------------------------------------------------------

CREATE TABLE ccp_own(
        id_privilege Int NOT NULL ,
        id_user      Int NOT NULL
	,CONSTRAINT ccp_own_PK PRIMARY KEY (id_privilege,id_user)

	,CONSTRAINT ccp_own_ccp_privilege_FK FOREIGN KEY (id_privilege) REFERENCES ccp_privilege(id_privilege) ON DELETE CASCADE
	,CONSTRAINT ccp_own_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user) ON DELETE CASCADE
);


#------------------------------------------------------------
# Table: ccp_identify
#------------------------------------------------------------

CREATE TABLE ccp_identify(
        id_course_sheet Int NOT NULL ,
        label_hashtag   Varchar (64) NOT NULL
	,CONSTRAINT identify_PK PRIMARY KEY (id_course_sheet,label_hashtag)

	,CONSTRAINT ccp_identify_ccp_coursesheet_FK FOREIGN KEY (id_course_sheet) REFERENCES ccp_coursesheet(id_course_sheet) ON DELETE CASCADE
	,CONSTRAINT ccp_identify_ccp_hashtag_FK FOREIGN KEY (label_hashtag) REFERENCES ccp_hashtag(label_hashtag) ON DELETE CASCADE
);


#------------------------------------------------------------
# Table: ccp_is_admin
#------------------------------------------------------------

CREATE TABLE ccp_is_admin(
        id_user  Int NOT NULL ,
        id_lobby Int NOT NULL
	,CONSTRAINT ccp_is_admin_PK PRIMARY KEY (id_user,id_lobby)

	,CONSTRAINT ccp_is_admin_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user) ON DELETE CASCADE
	,CONSTRAINT ccp_is_admin_ccp_lobby_FK FOREIGN KEY (id_lobby) REFERENCES ccp_lobby(id_lobby) ON DELETE CASCADE
);


#------------------------------------------------------------
# Table: ccp_message
#------------------------------------------------------------

CREATE TABLE ccp_message(
        id_message Int  Auto_increment  NOT NULL ,
        content    Varchar (1024) NOT NULL ,
        send_date  DateTime NOT NULL ,
        id_user  Int  NOT NULL ,
        id_lobby   Int NOT NULL
	,CONSTRAINT ccp_message_PK PRIMARY KEY (id_message)
	,CONSTRAINT ccp_message_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user(id_user) ON DELETE CASCADE
	,CONSTRAINT ccp_message_ccp_lobby_FK FOREIGN KEY (id_lobby) REFERENCES ccp_lobby(id_lobby) ON DELETE CASCADE
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
	,CONSTRAINT ccp_token_ccp_user_FK FOREIGN KEY (id_user) REFERENCES ccp_user (id_user) ON DELETE CASCADE
);

SET GLOBAL event_scheduler ="ON";

CREATE EVENT delete_token_event
ON SCHEDULE EVERY 1 MINUTE ENABLE
        DO 
        DELETE FROM ccp_token
        WHERE last_update_date < DATE_SUB(NOW(), INTERVAL 20 MINUTE)
        OR creation_date < DATE_SUB(NOW(), INTERVAL 1 DAY);

/*************** FIXTURES ************/


/******   ccp_user    ********/

INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (1, 'tomtom', 'Thomas', 'Bonnet', 'pink_pencil_case.jpg', '$2y$10$FU50osy63clx3YmMarOyvOLTxJvGHlJG787D2/fLs7vNp4fk7rI/K', 'thomas@cacompilepas.com');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (2, 'nana', 'nabila', 'benattia', 'pink_pencil_case.jpg', '$2y$10$FU50osy63clx3YmMarOyvOLTxJvGHlJG787D2/fLs7vNp4fk7rI/K', 'nabila@cacompilepas.com');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (3, 'Victor', 'Scrum', 'scrum1968', '', '$2y$10$mypwcPVZJac4.66SL1ormeckRKlaYlcEx2haWD8phNf14/S6cV4PS', 'picard@gmail.com');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (4, 'Dimitry', 'Vegas', 'DV93', 'the-quieter-you-become-the-more-you-can-hear-ram-dass.jpg', '$2y$10$nUolHmfBLK4/RF/qr/YYF.R28CoeyTxBCYiq29itoH3dE549VR78q', 'hippolytepicard@yahoo.fr');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (5, 'Djodjo', 'Mathys', 'Simion', 'richard-small.jpg', '$2y$10$4P6.S2Vmvy1cpzsbqdptFuZPHueTrUfKbcCtBc5i4uw1d7TI.hQ8K', 'mathysSimion@lafourche.fr');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (6, 'Hipopo', 'Hippolyte', 'Picard', 'hippo.jpg', '$2y$10$ZQ6HiWFAQirLP/Mwq4/ILeqvezLsXO..9duGuwOmlzGa9Ox22/TDS', 'picardhippolyte@yahoo.fr');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (7, 'Yukitsuo', 'Alexandre', 'Uy', 'maxresdefault.jpg', '$2y$10$Uk1tEl5d/S5kiASTBCrEvu6U30B4PTNylAwCryLr.h/CY9xXxu35C', 'yukitsuo@yahoo.fr');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (8, 'aurelienMontreuil', 'Aurelien', 'Bossard', 'aurelien.jpeg', '$2y$10$W7LPYjL03b8S.cqEv6sUKuifuoTV0q3hWzSqjOOBuQwuiRTFktyXa', 'aurelienbossard@montreuil.fr');
INSERT INTO cacompilepasdb.ccp_user (id_user, pseudo, first_name, last_name, icon, password, email) VALUES (9, 'manu', 'Emmanuel', 'Macron', 'macron.jpeg', '$2y$10$DUI29lSAy/mzKd4tR7FrBuik0B9WlTupTwprny.O6wiRgU21rvGu2', 'emmanuel@yahoo.fr');

/******   ccp_lobby    ********/

INSERT INTO cacompilepasdb.ccp_lobby (id_lobby, label_lobby, description, logo, private) VALUES (1, 'JAVA 8', 'Découvrez les nouveautes de JAVA 8 , entre lambda , hmap et compagnie vous ne serez pas decu', 'pink_pencil_case.jpg', 1);
INSERT INTO cacompilepasdb.ccp_lobby (id_lobby, label_lobby, description, logo, private) VALUES (2, 'Bases de lassembleur', 'Plongez dans le monde infernal de lassembleur , un monde ou vous devez faire 10 lignes de codes juste pour faire un print', 'Colors-Gucci-Logo.jpg', 1);
INSERT INTO cacompilepasdb.ccp_lobby (id_lobby, label_lobby, description, logo, private) VALUES (3, 'Vim est-il facile a apprendre ? ', 'Retrouver les arguments du perpetuel debat qui a dechiré plus dune familles ', 'Roi_Arthur_livre1.jpg', 1);
INSERT INTO cacompilepasdb.ccp_lobby (id_lobby, label_lobby, description, logo, private) VALUES (4, 'JAVASCRIPT ', 'aucun commentaire', 'Roi_Arthur_livre1.jpg', 1);
INSERT INTO cacompilepasdb.ccp_lobby (id_lobby, label_lobby, description, logo, private) VALUES (5, 'Introduction au langage C', 'Découvrez les bases de ce fabuleux langage', 'logo.png', 0);
INSERT INTO cacompilepasdb.ccp_lobby (id_lobby, label_lobby, description, logo, private) VALUES (6, 'Préparation au 24h des IUT informatiques Dijon 2020', 'Retrouvez les sujets des épreuves de 2019 et avant !! Algo , Web et sécu :)', '24h.jpg', 1);


/******   ccp_coursesheet    ********/

INSERT INTO ccp_coursesheet (title,publication_date,file_name,description,id_lobby_contain) VALUES ('Les lambdas','2019-11-24','les-lambdas.pdf','Découvrez l\'une des nouveautés les plus importantes de java 8. Les lambdas permettent une implémentation simple et efficace de la programmation fonctionnelle évitant.',1);
INSERT INTO ccp_coursesheet (title,publication_date,file_name,description,id_lobby_contain) VALUES ('Les registres','2042-12-24','assembleur.pdf','Après ce cours vous aurez compris l\'origine de l\'univers',2);
INSERT INTO ccp_coursesheet (title,publication_date,file_name,description,id_lobby_contain) VALUES ('Les design pattern','2019-12-09','design-patterns.pdf','Les design pattern sont des façons de programmer réutilisables permettant d\'apporter des réponses à des problèmes récurrents dans les programmes informatiques',2);


/******   ccp_message    ********/

/**LOBBY JAVA 8 ***/

INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('tro bien se cite, sa vo clerement pa stakovèrflo !!!', '2019-12-09',1,1);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Je suis daccord il set vraiment génial !', '2019-12-09',2,1);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('hey les gars... ca compile pas , vous pouvez maider ?','2019-11-24',3,1);

/**LOBBY Introduction au langage C ***/

INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('finalement un pointeur cest quoi concretement ? quelque peut apporter une explication', '2019-12-09',4,5);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Ecoute.. Un pointeur est un objet dont la valeur est égale à l''adresse d''un autre objet.. cest pas compliqué qd même ', '2019-12-09',3,5);

/**LOBBY preparation au 24 des IUT **/

INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('hate dy être en tout cas !!', '2019-12-09',6,6);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Merci à ce qui on creé ce lobby OMG il ya toutes les annales des années précédentes !', '2019-12-09',9,6);


/** VIM **/

INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Les gars comment on fait pour quitter Vim??', '2019-12-09',2,3);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Bonjour à tous : est ce que vous savez comment on quiite VIM cest important cela fait 3 jours qu eje suis dessus', '2019-12-09',3,3);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Avis à la population !! Je vais uploader une fiche bientot vous aurez toutes les réponses ', '2019-12-09',6,3);

/** ASM  **/

INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Ce langage est génial !! ', '2019-12-09',7,2);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('pardon ?', '2019-12-09',2,2);

/** JAVA  8**/

INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Vraiment bravo pour les fiches !! Elles sont très complètes ', '2019-12-09',8,1);
INSERT INTO ccp_message (content,send_date,id_user,id_lobby) VALUES ('Pouvez mettre un cours sur les Streams svp ?', '2019-12-09',7,1);




/******   ccp_rights     ********/

INSERT INTO ccp_rights (read_right,write_right,id_lobby_protect,id_user) VALUES (true,false,1,1);
INSERT INTO ccp_rights (read_right,write_right,id_lobby_protect,id_user) VALUES (true,true,2,2);

/******   ccp_is_admin   ********/
INSERT INTO ccp_is_admin (id_user, id_lobby) VALUES (1, 1);
INSERT INTO ccp_is_admin (id_user, id_lobby) VALUES (2, 2);
INSERT INTO ccp_is_admin (id_user, id_lobby) VALUES (3, 3);
INSERT INTO ccp_is_admin (id_user, id_lobby) VALUES (3, 4);
INSERT INTO ccp_is_admin (id_user, id_lobby) VALUES (4, 5);
INSERT INTO ccp_is_admin (id_user, id_lobby) VALUES (5, 6);


/******   ccp_hashtag    ********/
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("programmation", 1);
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("java", 1);
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("lambdas", 1);
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("Java8", 1);
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("assembleur",2);
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("dépression", 2);
INSERT INTO ccp_hashtag (label_hashtag, id_course_sheet) VALUES ("design pattern", 3);


