import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Lobby from './Lobby';
import Router from './Router';
import Route from './Route';
import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Nav/>
      <Router>
        <Route path='/lobby'>
          <Lobby/>
        </Route>
        <Route path='/connexion'>
          <p>Connexion</p>
        </Route>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
