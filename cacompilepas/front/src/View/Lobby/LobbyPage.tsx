import React, {ReactNode} from 'react';
import Request from '../../API/Request';
import '../../css/Lobby.css';
import {
    Switch,
    Route,
    BrowserRouter as Router,
} from 'react-router-dom';
import {ReactComponent as Loader} from '../../img/loader.svg';
import LobbyTop from './LobbyTop';
import LobbyBody from './LobbyBody';
import swal from 'sweetalert';

interface LobbyState {
    right: string,
    isAdmin: boolean,
    courseSheets: [],
    messages: [],
    lobbyInformation: any,
    messageContent: string,
}

class LobbyPage extends React.Component<any, LobbyState> {

    private intervalRefresh: any;

    public constructor(props: any) {
        super(props);
        this.state = {
            right: '',
            isAdmin: false,
            courseSheets: [],
            messages: [],
            lobbyInformation: [],
            messageContent: '',
        }
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
        this.setState = this.setState.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.fillDescription = this.fillDescription.bind(this);
        this.fillMessages = this.fillMessages.bind(this);
        this.refreshCourseSheets = this.refreshCourseSheets.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.refreshDescription = this.refreshDescription.bind(this);
        this.refreshAdmin = this.refreshAdmin.bind(this);
        this.refreshMessages = this.refreshMessages.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.intervalRefresh = setInterval(
            () => this.refreshData(),
            1000,
        );
    }

    public componentDidMount(): void {
        this.refreshCourseSheets();
        this.refreshDescription();
        this.refreshAdmin();
        this.refreshMessages();
    }

    public refreshData(): void {
        this.refreshCourseSheets();
        this.refreshDescription();
        this.refreshMessages();
    }

    public componentWillUnmount(): void {
        clearInterval(this.intervalRefresh);
    }

    public checkIfAdmin(payload: any): void {
        this.setState({isAdmin: payload['success']});
    }

    public sendMessage(event: React.MouseEvent<HTMLButtonElement>): void {
        let element: any = event.target;
        let e: any = event.target;
        element.parentElement.children[0].value = '';
        if (undefined !== element.parentElement.children[0].style) {
            element.parentElement.children[0].style.height = '1px';
            element.parentElement.children[0].style.height = (element.parentElement.children[0].scrollHeight) + 'px';
        }
        new Request(
            '/message/add_message',
            this.refreshMessages,
            'POST',
            {
                lobby_id: this.props.location.pathname.split(/\//)[2],
                content: this.state.messageContent,
            },
        );
    }

    public fillDescription(payload: any): void {
        if (payload['success']) {
            this.setState({lobbyInformation: payload['data'][0]});
            this.setState({right: 'true'});
        } else {
            this.setState({right: 'false'});
        }
    }

    public fillMessages(payload: any): void {
        this.setState({messages: payload['success'] ? payload : []});
    }

    public refreshCourseSheets(): void {
        new Request(
            '/course_sheet/course_sheets',
            this.fillCourseSheets,
            'POST',
            {
                'lobby_id': this.props.location.pathname.split(/\//)[2],
            }
        );
    }

    public refreshAdmin(): void {
        new Request(
            '/user/check_if_admin',
            this.checkIfAdmin,
            'POST',
            {
                'lobby_id': this.props.location.pathname.split(/\//)[2],
            }
        );
    }

    public refreshMessages(payload: any = {'success': true}): void {
        if (payload['success']) {
            new Request(
                '/message/messages',
                this.fillMessages,
                'POST',
                {
                    lobby_id: this.props.location.pathname.split(/\//)[2],
                }
            );
        } else if (false === payload['success']) {
            swal({
                title: 'Tu ne peux pas écrire de message ici',
                text: 'L\'admin de ce lobby ne t\'a pas donné l\'autorisation d\'envoyer de message ici, tu peux lui en faire la demande si tu le souhaites.',
                icon: 'error'
            }).then((r: any) => null);
        }
    }

    public refreshDescription(): void {
        new Request('/lobby/consult/' + this.props.location.pathname.split(/\//)[2], this.fillDescription);
    }

    public fillCourseSheets(payload: any): void {
        this.setState({courseSheets: payload['success'] ? payload : []});
    }

    public updateMessage(content: string): void {
            this.setState({messageContent: content});
    }

    public render(): ReactNode {
        return (
            <Router>
                <Switch>
                    <Route path={this.props.location.pathname}>
                        {() => {
                            if ('true' === this.state.right) {
                                return (
                                    <section className={"content row container-fluid pr-0"}>
                                        <LobbyTop
                                            id={this.props.location.pathname.split(/\//)[2]}
                                            lobbyInformation={this.state.lobbyInformation}
                                            isAdmin={this.state.isAdmin}
                                            courseSheets={this.state.courseSheets}
                                        />
                                        <LobbyBody id={this.props.location.pathname.split(/\//)[2]}
                                                   labelLobby={this.state.lobbyInformation['label_lobby']}
                                                   courseSheets={this.state.courseSheets}
                                                   messages={this.state.messages}
                                                   sendMessage={this.sendMessage}
                                                   updateMessage={this.updateMessage}
                                                   isAdmin={this.state.isAdmin}
                                        />
                                    </section>
                                );
                            } else if ('false' === this.state.right) {
                                return <h2>Tu n'as pas les droits nécessaires pour accéder à ce lobby</h2>
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
