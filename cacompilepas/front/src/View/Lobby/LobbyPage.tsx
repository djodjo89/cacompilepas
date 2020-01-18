import React, {ReactNode} from 'react';
import Request from "../../API/Request";
import '../../css/Lobby.css';
import {
    Switch,
    Route,
    BrowserRouter as Router,
} from "react-router-dom";
import {ReactComponent as Loader} from "../../img/loader.svg";
import LobbyTop from "./LobbyTop";
import LobbyBody from "./LobbyBody";

interface LobbyState {
    right: string,
    courseSheets: [],
    messages: [],
    lobbyInformation: any,
}

class LobbyPage extends React.Component<any, LobbyState> {

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
                '/message/add_message/' + this.props.location.pathname.split(/\//)[2],
                this.refreshMessages,
                'POST',
                {content: content.value}
            );
            content.value = '';
        }
    }

    public fillDescription(payload: any): void {
        this.setState({lobbyInformation: payload[0]});
    }

    public fillMessages(payload: any): void {
        this.setState({messages: payload});
    }

    public refreshCourseSheets(): void {
        new Request(
            '/coursesheet/coursesheets/' +
            this.props.location.pathname.split(/\//)[2],
            this.fillCourseSheets
        );
    }

    public refreshMessages(): void {
        new Request('/message/messages/' + this.props.location.pathname.split(/\//)[2], this.fillMessages);
    }

    public refreshDescription(): void {
        new Request('/lobby/consult/' + this.props.location.pathname.split(/\//)[2], this.fillDescription);
    }

    public fillCourseSheets(payload: any): void {
        if (payload['success']) {
            this.setState({courseSheets: payload});
            this.setState({right: 'true'});
        } else if (payload['data']['message'].includes('right')) {
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
                                    <section className={"content row container-fluid pr-0"}>
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

export default LobbyPage;
