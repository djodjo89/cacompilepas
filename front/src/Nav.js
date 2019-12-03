import React from 'react';
import logo from './new-logo.svg';
import icon from './logos-2-usable.svg';
import Svg from './Svg.tsx';

let count = 0;
const maxLimit = 20;
const minLimit = 0;
let speed;
let up = true;
function moveSvg() {
  speed = 0.5;
  if (true === up) {
    if (maxLimit > count) {
      if (maxLimit - 5 < count) {
        speed = 0.1;
      }
      // The svg object has a group of rectangles within another group
      // This group has a transform property
      // This transform has two properties : baseVal and animateVal (use baseVal for dynamic modification)
      // The first element of baseVal is a matrix containing a, b, c, d, e and f coordinates
      // e <=> x and f <=> y
      document.getElementById('svg8').children[1].children[1].transform.baseVal[0].matrix.e += 0;
      document.getElementById('svg8').children[1].children[1].transform.baseVal[0].matrix.f -= speed;
      count++;
    }
    if (maxLimit === count) {
      up = false;
    }
  }
  else if (false === up) {
    if (minLimit < count) {
      if (minLimit + 5 > count) {
        speed = 0.1;
      }
      document.getElementById('svg8').children[1].children[1].transform.baseVal[0].matrix.e += 0;
      document.getElementById('svg8').children[1].children[1].transform.baseVal[0].matrix.f += speed;
      count--;
      
    }
    if (minLimit === count) {
      up = true;
    }
  }
}
setInterval(moveSvg, 50);

class Nav extends React.Component {
  render() {
    return (
      <nav className="row mt-3">
        <div className="col-lg-2 col-sm-4 mr-lg-0 mr-sm-0">
          <a id='home-icon' href='/' className='glyphicon glyphicon-home col-lg-1 col-sm-2 pl-lg-0 pl-lg-0 pf-sm-0 mr-lg-4 mr-sm-4'> </a>
          <a id="home-link" href='/' className="mt-1 col-lg-1 col-sm-2 pl-lg-1 pl-sm-2 ml-lg-0">caCompilePas</a>
          <img src={ logo } alt="Logo" style={{ width: '100px', height: '100px' }}/>
          <Svg/>
        </div>
        <form className="form-inline my-2 my-lg-0 col-lg-5 col-sm-5 offset-lg-1 offset-sm-0">
          <label id="search-icon" htmlFor="search">
            <span className="glyphicon glyphicon-search search-icon"></span>
            <span id="search-placeholder">Search...</span>
          </label>
          <input id="search" className="form-control col-lg-12 w-75 mr-sm-2" type="search" aria-label="Search" />
        </form>
        <span id="user" className="glyphicon glyphicon-user col-lg-1 col-sm-2 mt-1 pr-lg-5 pr-sm-1 pl-lg-0 pl-sm-0"></span>
        <img src={ icon } alt="Logo"/>
      </nav>
    )
  }
}

export default Nav;
