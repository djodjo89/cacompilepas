import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
          <a className="navbar-brand" href="#">Navbar</a>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2 ml-lg-4" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-light my-2 my-sm-0 ml-lg-2" type="submit">Search</button>
          </form>
          <button className="btn btn-outline-light">M'inscrire</button>        
        </nav>
      </header>
      <section className="App-section">
        <h1 className="h1">
          Banque de fiches en lignes pour informaticiens.
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
        <div className="container offset-3 mt-5">
          <div className="row">
            <div className="col col-lg-3">
              <button className="btn btn-light text-primary col-lg-12">Mon espace perso</button>
            </div>
            <div className="col col-lg-3">
              <button className="btn btn-outline-light col-lg-12" href="#">Les fiches</button>
            </div>
          </div>
        </div>
      </section>
      <footer>
        <p>Copyrights</p>
      </footer>
    </div>
  );
}

export default App;
