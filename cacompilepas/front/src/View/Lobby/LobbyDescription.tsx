import React, {ReactNode} from 'react';
import Request from '../../API/Request';
import adminIcon from "../../img/admin.png";

interface LobbyDescriptionProps {
    id: string,
}

interface LobbyDescriptionState {
    isAdmin: boolean,
    lobby: any,
}

class LobbyDescription extends React.Component<LobbyDescriptionProps, LobbyDescriptionState> {
    public constructor(props: { id: string }) {
        super(props);
        this.state = {
            isAdmin: false,
            lobby: [],
        };
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
        this.fillDescription = this.fillDescription.bind(this);
        this.getLogo = this.getLogo.bind(this);
        this.fillLogo = this.fillLogo.bind(this);
        this.refreshAdmin = this.refreshAdmin.bind(this);
        this.refreshDescription = this.refreshDescription.bind(this);
    }

    public componentDidMount(): void {
        this.refreshAdmin();
        this.refreshDescription();
    }

    public checkIfAdmin(payload: any): void {
        this.setState({isAdmin: payload['success']});
    }

    public refreshAdmin(): void {
        new Request(
            '/user/check_if_admin',
            this.checkIfAdmin,
            'POST',
            {
                'lobby_id': this.props.id,
            }
        );
    }

    public refreshDescription(): void {
        new Request('/lobby/consult/' + this.props.id, this.fillDescription);
    }

    public fillDescription(payload: any): void {
        this.setState(
            {lobby: payload['data'][0]},
            this.getLogo);
    }

    public getLogo(): void {
        new Request(
            '/lobby/get_logo/' + this.props.id,
            this.fillLogo,
            'POST',
            {
                path: this.state.lobby['logo'],
            },
            'json',
            'blob',
        );
    }

    public fillLogo(payload: Blob): void {
        const img: any = document.getElementById('lobby-logo' + this.props.id);
        const blob = new Blob([payload], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public render(): ReactNode {
        return (
            <section className={'col-lg-12 col-sm-12 pr-0'}>
                <div className={'row container-fluid mt-0 mt-lg-5 mt-md-5 mt-sm-5 p-0'}>
                    <div
                        className={'d-none d-lg-block d-md-block d-sm-block col-lg-2 col-md-2 col-sm-3 col-xs-12 pt-5 pr-0 pl-0'}>
                        <img
                            id={'lobby-logo' + this.props.id}
                            className={'lobby-logo mt-0 mt-lg-4 mt-md-4 mt-sm-4'}
                            alt={this.state.lobby['label_lobby']}
                        />
                    </div>
                    <div className={'col-lg-10 col-md-10 col-sm-9 col-xs-12 pr-0'}>
                        <div className={'row pr-0 pl-0'}>
                            <div className={'col-11 col-lg-9 col-md-9 text-left pr-0 pl-0'}>
                                <h1 id={'lobby-label'}>{this.state.lobby['label_lobby']}</h1>
                            </div>
                            {
                                (() => {
                                    return this.state.isAdmin
                                        ? <div className={'col-1 col-lg-3 col-md-3 text-right pt-0 pt-lg-5 pt-md-5 mt-5 mt-lg-0 mt-md-0'}>
                                            <a
                                                href={'/admin/' + this.props.id}
                                            >
                                                <div className={'row'}>
                                                    <div className={'col-10 pr-0'}>
                                                        <p className={'h3 d-none d-lg-block mt-0 pt-0 pt-lg-1 pr-0 text-right'}>Admin du lobby</p>
                                                    </div>
                                                    <div className={'col-2'}>
                                                        <img
                                                            src={adminIcon}
                                                            alt={'Icon de l\'admin'}
                                                            className={'admin-icon'}
                                                        />
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        : <div></div>
                                })()
                            }
                        </div>
                        <div className={'row pr-0 pl-0'}>
                            <div className={'col-12 pr-0 pl-0'}>
                                <p className="lobby-page-description">{this.state.lobby['description']}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default LobbyDescription;
