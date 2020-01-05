import React, {ReactNode} from 'react';
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
import Admin from '../Admin/Admin';
import PublicLobbies from "../Public/PublicLobbies";
import CourseSheetPage from "../Pages/CourseSheetPage";

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
                        <PrivateRoute path={'/coursesheet'} component={CourseSheetPage} rest={[]}/>
                        <Route path={'/connexion'}>
                            <Connection/>
                        </Route>
                        <PrivateRoute path={'/admin'} component={Admin} rest={[]}/>
                        <Route path={'/public'}>
                            <PublicLobbies/>
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
