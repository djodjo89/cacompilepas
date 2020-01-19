import React, {ReactNode} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Link,
} from 'react-router-dom';
import Nav from '../Navigation/Nav';
import LobbyPage from '../Lobby/LobbyPage';
import Connection from '../Connection/Connection';
import NotFound from '../Pages/NotFound';
import PrivateRoute from '../../Security/PrivateRoute';
import '../../css/App.css';
import Home from '../Pages/Home';
import Admin from '../Admin/Admin';
import PublicLobbies from '../Public/PublicLobbies';
import CourseSheetPage from '../CourseSheet/CourseSheetPage';
import Personal from '../Pages/Personal';
import LobbyCreation from '../Lobby/LobbyCreation';
import Inscription from '../Connection/Inscription';
import Breadcrumb from "../Navigation/Breadcrumb";

interface AppState {
    items: any[],
}

class App extends React.Component<any, AppState> {

    private map: any;
    public constructor(props: any) {
        super(props);
        this.state = {
            items: [
            ]
        };
        this.map = {
            '/lobby': 'Lobby',
            '/perso': 'Perso',
            '/admin': 'Admin',
            '/connexion/register': 'Inscription',
            '/connexion/connexion': 'Connexion',
            '/': 'Accueil',
        };
    }

    public componentWillMount(): void {
        /*
        // Breadcumbs logic
        // let firstBre =
        let breadcumbIndex = 0;
        let breadcrums: any = [];
        for (let item in localStorage) {
            if ('breadcrumb-' === item.substr(0, 11)) {
                breadcrums.push({key: item, value: localStorage.getItem(item)});

            }
            if ('breadcrumb-' + breadcumbIndex === item) {

                if (deleteOthers) {
                    localStorage.removeItem('breadcumb-' + breadcumbIndex);
                } else if (localStorage.getItem('breadcumb-' + (breadcumbIndex - 1)) === document.location.pathname + localStorage.getItem('Title')) {
                    deleteOthers = true;
                } else {


                    console.log(item);
                    console.log(localStorage.getItem('breadcumb-' + (breadcumbIndex )));
                    this.state.items.push({
                        // @ts-ignore
                        to: localStorage.getItem('breadcumb-' + breadcumbIndex),
                        label: 'Connexion',
                    });
                    console.log(this.state.items);
               // }

                breadcumbIndex++;
            }
        }

        if (0 !== breadcrums.length) {
            console.log('nope');
            for (let breadcrumb of breadcrums) {
                console.log(localStorage.getItem('breadcrumb-' + breadcumbIndex))
                console.log(this.map);
                console.log('map map')
                // @ts-ignore
                console.log(this.map[localStorage.getItem('breadcrumb-' + breadcumbIndex)])
                console.log('mop mpo')
                this.state.items.push({
                    // @ts-ignore
                    to: localStorage.getItem('breadcrumb-' + breadcumbIndex),
                    // @ts-ignore
                    label: this.map[localStorage.getItem('breadcrumb-' + breadcumbIndex)],
                });
                breadcumbIndex++;
            }

            if (localStorage.getItem('breadcrumb-' + (breadcumbIndex - 1)) !== document.location.pathname) {
                console.log('bread');
                localStorage.setItem('breadcrumb-' + breadcumbIndex, document.location.pathname);
            }
            console.log(localStorage.getItem('breadcrumb-' + (breadcumbIndex - 1)));
            console.log(document.location.pathname);
            console.log(this.state.items);
            console.log('breadcrumb-' + breadcumbIndex);
            console.log(localStorage.getItem('breadcrumb-' + breadcumbIndex));
            console.log(this.state.items);
        } else {
            console.log('ok');
            localStorage.setItem('breadcrumb-' + breadcumbIndex, document.location.pathname);
            this.state.items.push({
                // @ts-ignore
                to: localStorage.getItem('breadcrumb-' + breadcumbIndex),
                label: 'Connexion',
            });
            console.log(this.state.items);
            console.log('breadcrumb-' + breadcumbIndex);
            console.log(localStorage.getItem('breadcrumb-' + breadcumbIndex));
        }*/
        /*

                    <Breadcrumb itemsAfter={1} itemsBefore={1} max={4} separator={'/'}>
                        {this.state.items.map(({to, label}: any) => {
                            return (
                                <div key={to}>
                                    <Link to={to}>{label}</Link>
                                </div>
                            )
                        })}
                    </Breadcrumb>
         */
    }

    public render(): ReactNode {
        return (
            <div className="App container-fluid ml-lg-4">
                <Nav/>
                <Router>
                    <Switch>
                        <Route exact path={'/'}>
                            <Home/>
                        </Route>
                        <PrivateRoute path={'/lobby'} component={LobbyPage} rest={[]}/>
                        <PrivateRoute path={'/course-sheet'} component={CourseSheetPage} rest={[]}/>
                        <Route path={'/connexion/login'}>
                            <Connection referrer={document.referrer}/>
                        </Route>
                        <Route path={'/connexion/register'}>
                            <Inscription/>
                        </Route>
                        <PrivateRoute path={'/admin'} component={Admin} rest={[]}/>
                        <PrivateRoute path={'/creation'} component={LobbyCreation} rest={[]}/>
                        <Route path={'/public'}>
                            <PublicLobbies/>
                        </Route>
                        <PrivateRoute path={'/perso'} component={Personal} rest={[]}/>
                        <Route path={'*'}>
                            <NotFound/>
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
