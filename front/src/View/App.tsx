import React, {ReactNode} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Nav from './Nav';
import Lobbys from './Lobbys';
import Connection from './Connection';
import NotFound from './NotFound';
import PrivateRoute from "../Security/PrivateRoute";
import '../css/App.css';

class App extends React.Component {
    public render(): ReactNode {
        console.log(localStorage.getItem('token'));
        return (
            <div className="App container-fluid ml-lg-4">
                <Nav/>
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <h2>Accueil</h2>
                        </Route>
                        <PrivateRoute path={'/lobby'} component={Lobbys} rest={[]}/>
                        <Route path='/connexion'>
                            <Connection/>
                        </Route>
                        <Route path='*'>
                            <NotFound/>
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
