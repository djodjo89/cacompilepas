import React, {ReactNode} from 'react';
import Divider from '../General/Divider';
import CourseSheet from "./CourseSheet";
import Message from "./Message";
import WriteMessageZone from './WriteMessageZone';
import Request from "../../API/Request";
import '../../css/Lobby.css';
import {
    Switch,
    Route,
    BrowserRouter as Router,
} from "react-router-dom";
import {ReactComponent as Loader} from "../../img/loader.svg";

class Lobby extends React.Component<any, { right: string, courseSheets: [] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            right: '',
            courseSheets: [],
        }
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.setState = this.setState.bind(this);
    }

    public componentDidMount(): void {
        new Request('/lobby/coursesheets/' + this.props.location.pathname.split(/\//)[2], 'POST', 'json', {token: localStorage.getItem('token')}, this.fillCourseSheets);
    }

    public fillCourseSheets(data: any): void {
        if (undefined === data['message']) {
            this.setState({courseSheets: data});
            this.setState({right: 'true'});
        } else {
            this.setState({right: 'false'});
        }
    }

    public render(): ReactNode {
        return (
            <Router>
                <Switch>
                    <Route path={this.props.pathname}>
                        {() => {
                            if ('true' === this.state.right) {
                                return <section className="content row container-fluid">
                                    <LobbyTop id={this.props.location.pathname.split(/\//)[2]}
                                              courseSheets={this.state.courseSheets}/>
                                    <LobbyBody id={this.props.location.pathname.split(/\//)[2]}
                                               courseSheets={this.state.courseSheets}/>
                                </section>;
                            } else if ('false' === this.state.right) {
                                return <h2>Vous n'avez pas les droits nécessaires pour accéder à ce lobby</h2>
                            } else {
                                return <div className={'mt-5'}><Loader/></div>
                            }
                        }}
                    </Route>
                    <Route path={this.props.path}>
                        <h3>Veuillez choisir un lobby</h3>
                    </Route>
                </Switch>
            </Router>
        );
    }
}

class LobbyTop extends React.Component<{ id: string, courseSheets: [] }, {}> {
    public render(): ReactNode {
        return (
            <div className="row col-lg-12 col-sm-12 mt-lg-5 mt-sm-5 mr-lg-0 mr-sm-0">
                <LobbySummary courseSheets={this.props.courseSheets}/>
                <LobbyDescription id={this.props.id}/>
            </div>
        )
    }
}

class LobbySummary extends React.Component<{ courseSheets: [] }, {}> {
    constructor(props: any) {
        super(props);
        this.renderList = this.renderList.bind(this);
    }

    public renderList(): ReactNode {
        let res = [], i = 0;
        for (let courseSheet of this.props.courseSheets) {
            res.push(<li key={i}>{courseSheet['title']}</li>);
            i++;
        }
        return res;
    }

    public render(): ReactNode {
        return (
            <section className="col-lg-6 col-sm-6 ml-lg-0 ml-sm-0 pl-lg-0 pl-sm-0 top-section">
                <h2 className="text-left mb-0">Sommaire</h2>
                <ul className="ccp-list list-unstyled text-left ml-1 mt-3">
                    {this.renderList()}
                </ul>
                <Divider/>
            </section>
        )
    }
}

class LobbyDescription extends React.Component<{ id: string }, { lobby: any }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            lobby: []
        };
        this.fillDescription = this.fillDescription.bind(this);
        this.setState = this.setState.bind(this);
    }

    public componentDidMount(): void {
        new Request('/lobby/consult/' + this.props.id, 'POST', 'json', {token: localStorage.getItem('token')}, this.fillDescription);
    }

    public fillDescription(data: any): void {
        this.setState({lobby: data});
    }

    public render(): ReactNode {
        return (
            <section className="col-lg-6 col-sm-6 pr-sm-0 top-section">
                <h2 className="ml-lg-0 text-left">{this.state.lobby['label_lobby']}</h2>
                <p className="ml-lg-2 ml-sm-1 course-sheet-presentation w-100">{this.state.lobby['description']}</p>
                <Divider/>
            </section>
        )
    }
}

class LobbyBody extends React.Component<{ id: string, courseSheets: [] }, {}> {
    public render(): ReactNode {
        return (
            <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12"}>
                <Messages id={this.props.id}/>
                <CourseSheets id={this.props.id} courseSheets={this.props.courseSheets}/>
                <WriteMessageZone/>
            </div>
        )
    }
}

class Messages extends React.Component<{ id: string }, { messages: [] }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            messages: [],
        }
        this.renderMessage = this.renderMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.fillMessages = this.fillMessages.bind(this);
        this.setState = this.setState.bind(this);
    }

    public componentDidMount(): void {
        new Request('/lobby/messages/' + this.props.id, 'POST', 'json', {token: localStorage.getItem('token')}, this.fillMessages);
    }

    public fillMessages(data: any): void {
        this.setState({messages: data});
    }

    public renderMessage(key: string, content: string, send_date: string, pseudo: string): ReactNode {
        return <Message key={key} content={content} send_date={send_date} pseudo={pseudo}/>;
    }

    public renderMessages(): ({} | null | undefined)[] {
        // @ts-ignore
        if (undefined === this.state.messages['message']) {
            let res = [], i = 0;
            for (let message of this.state.messages) {
                res.push(this.renderMessage(i.toString(), message['content'], message['send_date'], message['pseudo']));
                i++;
            }
            return res;
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className="col-lg-6 col-sm-12 pl-lg-0 pl-sm-0 pr-lg-5 mt-lg-3 mt-sm-4">
                <ul className="messages-list list-unstyled">
                    {this.renderMessages()}
                </ul>
            </div>
        )
    }
}

class CourseSheets extends React.Component<{ id: string, courseSheets: [] }, { courseSheets: [] }> {

    public constructor(props: any) {
        super(props);
        this.renderCourseSheets = this.renderCourseSheets.bind(this);
        this.renderCourseSheet = this.renderCourseSheet.bind(this);
    }

    public renderCourseSheet(i: string, title: string, publication_date: string, link: string, description: string): ReactNode {
        return <CourseSheet key={i} title={title} publication_date={publication_date} link={link}
                            description={description}/>;
    }

    public renderCourseSheets(): ({} | null | undefined)[] {
        // @ts-ignore
        if (undefined === this.props.courseSheets['is_empty']) {
            let res = [], i = 0;
            for (let courseSheet of this.props.courseSheets) {
                res.push(this.renderCourseSheet(i.toString(), courseSheet['title'], courseSheet['publication_date'], courseSheet['link'], courseSheet['description']));
                i++;
            }
            return res;
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className="col-lg-6 col-sm-12 mt-lg-3 course-sheets-section">
                {this.renderCourseSheets()}
            </div>
        )
    }
}

export default Lobby;
