import React, {ReactNode} from 'react';
import '../../css/Home.css';

class Home extends React.Component {
    public render(): ReactNode {
        return (
            <section className={"container-fluid bodyHome col-lg-9"}>
                <div className={"row"}>
                    <Title/>
                </div>
                <div className={"row"}>
                    <Description/>
                </div>
                <div className={"row buttonsZone"}>
                    <Buttons/>
                </div>
            </section>
        )
    }
}

class Title extends React.Component {
    public render(): ReactNode {
        return (
            <div id={"Title"} className="col-lg-6">
                <h1>Banque de fichiers en lignes pour informaticiens</h1>
            </div>
        )
    }
}

class Description extends React.Component {
    public render(): ReactNode {
        return (
            <p className={"col-lg-6 description"}>"Concurrent direct de StackOverflow, notre plateforme vous aidera à
                trouver des solutions à vos divers problèmes d'informaticiens !" </p>

        )
    }
}

class Buttons extends React.Component {
    render() {
        return (
            <div className={"row ml-xl-4 col-xl-5 col-lg-9 col-md-9 col-sm-9"}>
                <a href={'/'}>
                    <button className={"personalPage"}>Page Perso</button>
                </a>
                <a href={'/'}>
                    <button className={"offset-2 popularCoursheet"}>Fiches Populaires</button>
                </a>
            </div>
        )
    }
}


export default Home;