import React, {ReactNode} from 'react';
import Upload from './Upload';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Nav from '../General/Nav';
import Lobby from '../Lobby/Lobby';
import Connection from '../Connection/Connection';
import NotFound from '../Pages/NotFound';
import PrivateRoute from "../../Security/PrivateRoute";
import '../../css/App.css';
import Home from "../Pages/Home";

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
                        <PrivateRoute path={'/lobby'} component={Lobby} rest={[]}/>
                        <Route path={'/connexion'}>
                            <Connection/>
                        </Route>
                        <Route path={'/upload'}>
                            <Upload/>
                        </Route>
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
