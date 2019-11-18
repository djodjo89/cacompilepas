import React from 'react';
import Divider from './Divider';
import userIcon from './icon-female-user.svg';
import exampleImage from './example.png';

class Lobby extends React.Component {
  render() {
    return (
      <section className="content row container-fluid">
        <LobbyTop/>
        <LobbyBody/>
      </section>
    )
  }
}

class LobbyTop extends React.Component {
  render() {
    return (
      <div className="row col-lg-12 col-sm-12 mt-lg-5 mt-sm-5 mr-lg-0 mr-sm-0">
        <LobbySummary/>
        <LobbyDescription/>
      </div>
    )
  }
}

class LobbySummary extends React.Component {
  render() {
    return (
      <section className="col-lg-6 col-sm-6 ml-lg-0 ml-sm-0 pl-lg-0 pl-sm-0 top-section">
        <h2 className="text-left mb-0">Sommaire</h2>
        <SummaryList/>
        <Divider/>
      </section>
    )
  }
}

class SummaryList extends React.Component {
  render() {
    return (
      <ul className="ccp-list list-unstyled text-left ml-1 mt-3">
        <li>Les lambdas</li>
        <li>Les HashMaps</li>
        <li>Function&lt;E,T&gt;</li>
        <li>Le SYSOUT</li>
        <li>Les HashMaps</li>
        <li>Function&lt;E,T&gt;</li>
        <li>Le SYSOUT</li>
        <li>Les HashMaps</li>
        <li>Function&lt;E,T&gt;</li>
        <li>Le SYSOUT</li>
      </ul>
    )
  }
}

class LobbyDescription extends React.Component {
  render() {
    return (
      <section className="col-lg-6 col-sm-6 pr-sm-0 top-section">
        <h2 className="ml-lg-0 text-left">Cours JAVA avancés</h2>
        <p className="ml-lg-2 ml-sm-1 course-sheet-presentation w-100">Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte.Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte.Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte.</p>
        <Divider/>
      </section>
    )
  }
}

class LobbyBody extends React.Component {
  render() {
    return (
      <div>
        <Messages/>
        <CourseSheets/>
        <WriteMessageZone/>
      </div>
    )
  }
}

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.renderMessage = this.renderMessage.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
  }
  renderMessage() {
    return <Message/>;
  }
  renderMessages() {
    let res = [];
    for (let i = 0; i < 10; i++)
      res.push(this.renderMessage());
    return res;
  }
  render() {
    return (
      <div className="col-lg-6 col-sm-12 pl-lg-0 pl-sm-0 pr-lg-5 mt-lg-3 mt-sm-4">
        <ul className="messages-list list-unstyled">
          { this.renderMessages() }
        </ul>
      </div>
    )
  }
}

class Message extends React.Component {
  render() {
    return (
      <li className="col-lg-11 ml-lg-0 ml-sm-0 mt-lg-5 mt-sm-3 mb-lg-5 mb-sm-5">
        <div className="row col-lg-12 col-sm-12 pl-sm-0">
          <img src={ userIcon } className="App-logo col-lg-1 col-sm-1 pr-lg-0 pr-sm-0 pl-lg-0 pl-sm-0" alt="logo" />
          <h4 className="col-sm-9 offset-sm-1 mb-sm-0 pl-sm-0 mt-sm-4 ml-lg-2 ml-sm-4">Bidule, le 17 Novembre 2019</h4>
        </div>
        <div className="row col-lg-12 col-sm-12 ml-lg-4">
          <p className="col-lg-12 col-sm-10 offset-lg-0 offset-sm-1 message-body mt-sm-0 pl-sm-2">Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression.</p>
        </div>
      </li>
    )
  }
}

class CourseSheets extends React.Component {
  constructor(props) {
    super(props);
    this.renderCourseSheets = this.renderCourseSheets.bind(this);
    this.renderCourseSheet = this.renderCourseSheet.bind(this);
  }
  renderCourseSheet() {
    return <CourseSheet/>;
  }
  renderCourseSheets() {
    let res = [];
    for (let i = 0; i < 10; i++)
      res.push(this.renderCourseSheet());
    return res;
  }
  render() {
    return (
      <div className="col-lg-6 col-sm-12 mt-lg-3 course-sheets-section">
        { this.renderCourseSheets() }
      </div>
    )
  }
}

class CourseSheet extends React.Component {
  render() {
    return (
      <div className="course-sheet-card row mt-5">
        <div className="col-lg-2 mt-lg-4 pl-lg-0 pr-lg-0">
          <img className="course-sheet-image rounded" src={ exampleImage }/>
        </div>
        <div className="col-lg-10">
          <h3 className="text-left mt-lg-0">Titre de la fiche</h3>
          <div className="course-sheet-presentation ml-lg-1">
           <p className="course-sheet-description">Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte.</p>
           <footer className="pl-lg-0">
              <a href="#" className="col-lg-6 text-lg-left pl-lg-0 d-block mt-lg-2">Lien vers la fiche</a>
              <h4 className="col-lg-6 text-lg-right">Mathys</h4>
           </footer>
          </div>
        </div>
      </div>
    )
  }
}

class WriteMessageZone extends React.Component {
  render() {
    return (
      <div className="col-lg-12 mt-lg-5 ml-lg-0 pl-lg-0">
        <div className="write-message-zone rounded text-left pt-lg-3 pl-lg-3">Ecrire un message sur #CoursJAVAAvances</div>
      </div>
    )
  }
}

export default Lobby;