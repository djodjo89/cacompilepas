import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Nav from './Nav';
import Footer from './Footer';
import Lobbys from './Lobby';
import Connection from './Connection';
import NotFound from './NotFound';
import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Nav />
      <Router>
        <Switch>
          <Route exact path='/'>
            <h2>Accueil</h2>
          </Route>
          <Route path='/lobby' component={ Lobbys } />
          <Route path='/connexion'>
            <Connection/>
          </Route>
          <Route path='*'>
            <NotFound/>
          </Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
