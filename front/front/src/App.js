import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import logo from './logo.svg';
<<<<<<< HEAD
//import Lobby from './Lobby';
import Home from './Home';
=======
import Lobby from './Lobby';
import Api from './Api';
>>>>>>> 972e3ccd164ceb9f363ffaae7293bdc779a003a7
import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Api route='/connexion'/>
      <Nav/>
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
