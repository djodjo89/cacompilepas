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
            <h2>Connexion</h2>
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
