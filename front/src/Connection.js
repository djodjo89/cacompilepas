import React from 'react';

class Connection extends React.Component {
    render(){
       return (
        <section className="content row connection-bloc">
            <div className="container">
              <form className="col-lg-4 col-lg-offset-4 col-sm">
                  <EmailAndPseudoInput/>
                  <PasswordInput/>
                  <ButtonConnection/>
              </form>
            </div>

        </section>
       )
    }
}

class EmailAndPseudoInput extends React.Component {
    render(){
        return (
            <div className="form-group">
                <input type="email" className="form-control text-center mt-0 rounded-1" id="InputMailPseudo" aria-describedby="emailHelp" placeholder="Pseudo ou email"/>
            </div> 

        )
    }
}

class PasswordInput extends React.Component {
    render() {
        return(   
            <div className="form-group">
                <input type="password" className="form-control text-center mt-0 rounded-1 custom" id="InputPassword" aria-describedby="emailHelp" placeholder="Mot de Passe"/>
            </div>              
        )
    }
}

class ButtonConnection extends React.Component {
    render(){
        return(
            <button type="button" className="btn btn-default btn-transparent mt-0 rounded-1 custom">Connexion </button>
        )
    }
}

export default Connection;