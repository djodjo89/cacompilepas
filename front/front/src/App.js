import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import logo from './logo.svg';
import Lobby from './Lobby';
import Api from './Api';
import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Api route='/connexion'/>
      <Nav/>
      <Lobby/>
      <Footer/>
    </div>
  );
}

export default App;
