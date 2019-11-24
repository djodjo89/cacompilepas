import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import logo from './logo.svg';
//import Lobby from './Lobby';
import Home from './Home';
import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Nav/>
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
