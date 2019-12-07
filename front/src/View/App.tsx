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
import Context from "../Global/Context";
import PrivateRoute from "../Security/PrivateRoute";
import '../css/App.css';

class App extends React.Component {
    public render(): ReactNode {
        return (
            <Context.Provider value={{
                token: ''
            }
            }>
                <div className="App container-fluid ml-lg-4">
                    <Nav/>
                    <Router>
                        <Switch>
                            <Route exact path='/'>
                                <h2>Accueil</h2>
                            </Route>
                            <PrivateRoute path={'/lobby'} component={Lobbys} rest={[]}>
                            </PrivateRoute>
                            <Route path='/connexion'>
                                <Connection/>
                            </Route>
                            <Route path='*'>
                                <NotFound/>
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </Context.Provider>
        );
    }
}

export default App;
