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
import AuthContext from "../Global/AuthContext";
import PrivateRoute from "../Security/PrivateRoute";
import '../css/App.css';

class App extends React.Component<{}, { token: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            token: '',
        };
        this.setState = this.setState.bind(this);
    }

    public setToken(newToken: string): void {
        this.setState({ token: newToken });
    }

    public render(): ReactNode {
        return (
            <AuthContext.Provider value={{ token: this.state.token, setToken: this.setToken }}>
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
            </AuthContext.Provider>
        );
    }
}

export default App;
