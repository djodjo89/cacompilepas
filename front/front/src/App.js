import React from 'react';
import Nav from './Nav';
import Footer from './Footer';
import Connection from './Connection';
import logo from './logo.svg';
import Lobby from './Lobby';

import './App.css';

function App() {
  return (
    <div className="App container-fluid ml-lg-4">
      <Nav/>
      <Connection/>
    </div>
  );
}

export default App;
