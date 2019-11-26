import React from 'react';
import icon from './new-logo.png';
import Request from './Request';
class Nav extends React.Component {
  render() {
    return (
      <nav className="row mt-3">
        <div className="col-lg-2 col-sm-4 mr-lg-0 mr-sm-0">
          <a id='home-icon' href='/' content='' className='glyphicon glyphicon-home col-lg-1 col-sm-2 pl-lg-0 pl-lg-0 pf-sm-0 mr-lg-4 mr-sm-4'></a>
          <a id="home-link" href='/' className="mt-1 col-lg-1 col-sm-2 pl-lg-1 pl-sm-2 ml-lg-0">caCompilePas</a>
        </div>
        <form className="form-inline my-2 my-lg-0 col-lg-5 col-sm-5 offset-lg-1 offset-sm-0">
          <label id="search-icon" htmlFor="search">
            <span className="glyphicon glyphicon-search search-icon"></span>
            <span id="search-placeholder">Search...</span>
          </label>
          <input id="search" className="form-control col-lg-12 w-75 mr-sm-2" type="search" aria-label="Search" />
        </form>
        <Request method='POST' route='/connection/login' data={{ 'pseudo': 'toto', 'password': 'pass' }}/>
        <span id="user" className="glyphicon glyphicon-user col-lg-1 col-sm-2 mt-1 pr-lg-5 pr-sm-1 pl-lg-0 pl-sm-0"></span>
      </nav>
    )
  }
}

export default Nav;
