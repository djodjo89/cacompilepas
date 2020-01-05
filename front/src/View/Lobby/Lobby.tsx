import React, {ReactNode} from 'react';
import Divider from '../General/Divider';
import Messages from './Messages';
import CourseSheets from "./CourseSheets";
import WriteMessageZone from './WriteMessageZone';
import Request from "../../API/Request";
import '../../css/Lobby.css';
import {
    Switch,
    Route,
    BrowserRouter as Router,
} from "react-router-dom";
import {ReactComponent as Loader} from "../../img/loader.svg";

interface LobbyState {
    right: string,
    courseSheets: [],
    messages: [],
    lobbyInformation: any,
}

class Lobby extends React.Component<any, LobbyState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            right: '',
            courseSheets: [],
            messages: [],
            lobbyInformation: [],
        }
        this.setState = this.setState.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.fillDescription = this.fillDescription.bind(this);
        this.fillMessages = this.fillMessages.bind(this);
        this.refreshCourseSheets = this.refreshCourseSheets.bind(this);
        this.refreshDescription = this.refreshDescription.bind(this);
        this.refreshMessages = this.refreshMessages.bind(this);
    }

    public componentDidMount(): void {
        this.refreshCourseSheets();
        this.refreshDescription();
        this.refreshMessages();
    }

    public sendMessage(event: React.KeyboardEvent<HTMLDivElement>): void {
        if (13 === event.keyCode) {
            let content: any = event.target;
            new Request(
                '/lobby/addMessage/' + this.props.location.pathname.split(/\//)[2],
                this.refreshMessages,
                'POST',
                {content: content.value}
            );
            content.value = '';
        }
    }

    public fillDescription(data: any): void {
        this.setState({lobbyInformation: data[0]});
    }

    public fillMessages(data: any): void {
        this.setState({messages: data});
    }

    public refreshCourseSheets(): void {
        new Request(
            '/lobby/coursesheets/' +
            this.props.location.pathname.split(/\//)[2],
            this.fillCourseSheets
        );
    }

    public refreshMessages(): void {
        new Request('/lobby/messages/' + this.props.location.pathname.split(/\//)[2], this.fillMessages);
    }

    public refreshDescription(): void {
        new Request('/lobby/consult/' + this.props.location.pathname.split(/\//)[2], this.fillDescription);
    }

    public fillCourseSheets(data: any): void {
        if (undefined === data['message']) {
            this.setState({courseSheets: data});
            this.setState({right: 'true'});
        } else if (data['message'].includes('right')) {
            this.setState({right: 'false'});
        } else {
            this.setState({right: 'true'});
        }
    }

    public render(): ReactNode {
        return (
            <Router>
                <Switch>
                    <Route exact path={this.props.path}>
                        <h3>Veuillez choisir un lobby</h3>
                    </Route>
                    <Route path={this.props.location.pathname}>
                        {() => {
                            if ('true' === this.state.right) {
                                return (
                                    <section className={"content row container-fluid pr-sm-0"}>
                                        <LobbyTop
                                            id={this.props.location.pathname.split(/\//)[2]}
                                            lobbyInformation={this.state.lobbyInformation}
                                            courseSheets={this.state.courseSheets}
                                        />
                                        <LobbyBody id={this.props.location.pathname.split(/\//)[2]}
                                                   labelLobby={this.state.lobbyInformation['label_lobby']}
                                                   courseSheets={this.state.courseSheets}
                                                   onEnter={this.sendMessage}
                                                   messages={this.state.messages}
                                        />
                                    </section>
                                );
                            } else if ('false' === this.state.right) {
                                return <h2>Vous n'avez pas les droits nécessaires pour accéder à ce lobby</h2>
                            } else {
                                return <div className={'mt-5'}><Loader/></div>
                            }
                        }}
                    </Route>
                </Switch>
            </Router>
        );
    }
}

class LobbyTop extends React.Component<{ id: string, lobbyInformation: any, courseSheets: [] }, {}> {

    public render(): ReactNode {
        return (
            <div className="row container-fluid">
                <LobbyDescription
                    id={this.props.id}
                />
                <LobbySummary courseSheets={this.props.courseSheets}/>
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
            res.push(<li key={i}><p className={'mb-0'}>{courseSheet['title']}</p></li>);
            i++;
        }
        return res;
    }

    public render(): ReactNode {
        return (
            <section className="col-lg-12 col-sm-12 mt-sm-2 pr-sm-0 pr-xs-0">
                <h2 className="text-left mb-0 mt-0">Sommaire</h2>
                <ul className="lobby-summary-list list-unstyled text-left ml-1 mt-3">
                    {this.renderList()}
                </ul>
                <Divider
                    className={'offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-6 col-xs-6 mt-5 mb-2'}/>
            </section>
        )
    }
}

class LobbyDescription extends React.Component<{ id: string }, { lobby: any }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            lobby: [],
        };
        this.fillDescription = this.fillDescription.bind(this);
        this.getLogo = this.getLogo.bind(this);
        this.fillLogo = this.fillLogo.bind(this);
        this.refreshDescription = this.refreshDescription.bind(this);
    }

    public componentDidMount(): void {
        this.refreshDescription();
    }

    public refreshDescription(): void {
        new Request('/lobby/consult/' + this.props.id, this.fillDescription);
    }

    public fillDescription(data: any): void {
        this.setState(
            {lobby: data[0]},
            this.getLogo);
    }

    public getLogo(): void {
        new Request(
            '/lobby/getLogo/0',
            this.fillLogo,
            'POST',
            {
                idLobby: this.props.id,
                path: this.state.lobby['logo'],
            },
            'json',
            'blob',
        );
    }

    public fillLogo(data: Blob): void {
        const img: any = document.getElementById('lobby-logo' + this.props.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public render(): ReactNode {
        return (
            <section className="col-lg-12 col-sm-12 pr-lg-0 pr-md-0 pr-sm-0 pr-xs-0">
                <div className={'row container-fluid mt-5 p-0'}>
                    <div className={'col-lg-2 col-md-2 col-sm-3 col-xs-4 text-left pr-lg-0'}>
                        <img
                            id={'lobby-logo' + this.props.id}
                            className={'lobby-logo'}
                            alt={'Lobby logo'}
                        />
                    </div>
                    <div className={'col-lg-10 col-md-10 col-sm-9 col-xs-8 pr-0'}>
                        <p className="lobby-page-description">{this.state.lobby['description']}</p>
                    </div>
                    <Divider className={'col-lg-3 col-md-6 col-sm-6 col-xs-6 mt-5 mb-5'}/>
                </div>
            </section>
        )
    }
}

interface LobbyBodyProps {
    id: string,
    labelLobby: string,
    courseSheets: [],
    onEnter: (event: React.KeyboardEvent<HTMLDivElement>) => void,
    messages: any,
}

class LobbyBody extends React.Component<LobbyBodyProps, any> {
    public render(): ReactNode {
        return (
            <div className={'col-lg-12 col-md-12 col-sm-12 col-xs-12'}>
                <div className={'col-lg-6 col-md-6 col-sm-12 col-xs-12 container-fluid'}>
                    <CourseSheets
                        id={this.props.id}
                        courseSheets={this.props.courseSheets}
                        className={'mt-lg-3'}
                        activeRemoveButton={false}
                        removableHashtags={false}
                        delete={undefined}
                    />
                </div>
                <div className={'col-lg-6 col-md-6 col-sm-12 col-xs-12 container-fluid'}>
                    <div className={'row'}>
                        <Messages
                            id={this.props.id}
                            messages={this.props.messages}
                        />
                    </div>
                    <div className={'row'}>
                        <WriteMessageZone
                            labelLobby={this.props.labelLobby}
                            onEnter={this.props.onEnter}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Lobby;
