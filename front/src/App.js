import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Lobby from './Lobby';
import Request from './Request';
import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Nav/>
      <Lobby/>
      <Footer/>
    </div>
  );
}

export default App;
