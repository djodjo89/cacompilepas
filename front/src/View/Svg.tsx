import React from 'react';
import { ReactComponent as Logo } from "../img/new-logo-2.svg";

interface SvgProps {
  id: string
  alt: string
}

class Svg extends React.PureComponent {

  public move() {
    let count = 0;
    const maxLimit = 20;
    const minLimit = 0;
    //let speed = 0.5;
    let up = true;
    
    if (true === up) {
      if (maxLimit > count) {
        if (maxLimit - 5 < count) {
          //speed = 0.1;
        }
        // The svg object has a group of rectangles within another group
        // This group has a transform property
        // This transform has two properties : baseVal and animateVal (use baseVal for dynamic modification)
        // The first element of baseVal is a matrix containing a, b, c, d, e and f coordinates
        // e <=> x and f <=> y
        //document.getElementById('home-icon').children[1].children[1].transform.baseVal[0].matrix.e += 0;
        //document.getElementById('home-icon').children[1].children[1].transform.baseVal[0].matrix.f -= speed;
        count++;
      }
      if (maxLimit === count) {
        up = false;
      }
    }
    else if (false === up) {
      if (minLimit < count) {
        if (minLimit + 5 > count) {
          //speed = 0.1;
        }
        // document.getElementById('home-icon').children[1].children[1].transform.baseVal[0].matrix.e += 0;
        // document.getElementById('home-icon').children[1].children[1].transform.baseVal[0].matrix.f += speed;
        count--;
        
      }
      if (minLimit === count) {
        up = true;
      }
    }
  }
        
  public beginAnimation() {
    setInterval(this.move, 50);
  }

  public render(): React.ReactNode {
    return (
		<Logo/>
    )
  }
}

export default Svg;
				