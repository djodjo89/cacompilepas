import React from 'react';
import './Home.css';

class Home extends React.Component {
    render(){
        return (
            <section className={"container-fluid bodyHome col-lg-9"}>
                    <div class={"row"}>
                        <Title/>
                    </div>
                <div className={"row"}>
                    <Description/>
                </div>
                    <div class={"row buttonsZone"}>
                        <MySpace/>
                    </div>
            </section>
        )
    }
}

class Title extends React.Component {
    render(){
        return (
            <div id={"Title"} class="col-lg-6">
                <h1>Banque de fichiers en lignes pour informaticiens</h1>
            </div>
        )
    }
}

class Description extends React.Component {
    render(){
        return (
            <p class={"col-lg-6 description"}>"Concurent direct de StackOverflow, notre plateforme vous aidera à trouver des solutions à vos divers problèmes d'informaticiens !" </p>
        )
    }
}

class MySpace extends React.Component {
    render(){
        return (
            <div class={"row ml-xl-4 col-xl-5 col-lg-9 col-md-9 col-sm-9"}>
                <a href={"#"}><button className={"pagePerso"}>Page Perso</button></a>
                <a href={"#"}><button class={"offset-2 fichesPopulaire"}>Fiches Populaires</button></a>
            </div>
        )
    }
}



export default Home;