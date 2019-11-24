import React from 'react';

class Home extends React.Component {
    render() {
      return (
        <section className="content row container-fluid">
        <Title/> 
        <Button/>
        </section>
      )
    }
  }


class Button extends React.Component{
    render(){
        return(
        <div class="container">
            <div class="col-1">
                <input type="button" value="Page Perso"></input>
            </div>
            <div class="col-1">
                <input type="button" value="Page Perso"></input>
            </div>
        </div>
     )
  }
}

class Title extends React.Component{
    render(){
        return(
            <div class="col-lg-7">
               <h1>Banque de fichiers en lignes pour informaticiens</h1>
            </div>
        )
    }
}
  export default Home;