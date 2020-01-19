import React, {ReactNode} from 'react';
import '../../css/Home.css';

class Home extends React.Component {
    public render(): ReactNode {
        return (
            <section className={"container-fluid bodyHome col-lg-11"}>
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
                <h1>Bienvenue sur caCompilePas.com</h1>
            </div>
        )
    }
}

class Description extends React.Component {
    public render(): ReactNode {
        return (
            <p className={"col-lg-6 description"}>"Crée tes propres lobbies(pages privées ou publiques sur lesquels tu peux trouver des fiches de cours et des espaces de disscusions )" </p>

        )
    }
}

class Buttons extends React.Component {
    render() {
        return (
            <div className={'row ml-xl-4 col-xl-5 col-lg-9 col-md-9 col-sm-9'}>
                <a href={'/perso'}>
                    <button className={'personalPage'}>Page Perso</button>
                </a>
                <a href={'/public'}>
                    <button className={'offset-2 publicLobbies'}>Lobbies publics</button>
                </a>
            </div>
        )
    }
}


export default Home;