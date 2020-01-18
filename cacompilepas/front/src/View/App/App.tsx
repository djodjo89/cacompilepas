import React, {ReactNode} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Nav from '../General/Nav';
import LobbyPage from '../Lobby/LobbyPage';
import Connection from '../Connection/Connection';
import NotFound from '../Pages/NotFound';
import PrivateRoute from "../../Security/PrivateRoute";
import '../../css/App.css';
import Home from "../Pages/Home";
import Admin from '../Admin/Admin';
import PublicLobbies from "../Public/PublicLobbies";
import CourseSheetPage from "../CourseSheet/CourseSheetPage";
import Personal from "../Pages/Personal";
import LobbyCreation from "../Lobby/LobbyCreation";
import Inscription from "../Connection/Inscription";

class App extends React.Component {
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
                        <PrivateRoute path={'/perso'} component={ Personal} rest={[]}/>
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
