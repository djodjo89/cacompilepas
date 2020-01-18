import React, {ReactNode} from "react";
import Request from "../../API/Request";

class LobbyDescription extends React.Component<{ id: string }, { lobby: any }> {
    public constructor(props: { id: string }) {
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
            <section className={'col-lg-12 col-sm-12 pr-0'}>
                <div className={'row container-fluid mt-0 mt-lg-5 mt-md-5 mt-sm-5 p-0'}>
                    <div className={'d-none d-lg-block d-md-block d-sm-block col-lg-2 col-md-2 col-sm-3 col-xs-12 pt-5 pr-0 pl-0'}>
                        <img
                            id={'lobby-logo' + this.props.id}
                            className={'lobby-logo mt-0 mt-lg-4 mt-md-4 mt-sm-4'}
                            alt={this.state.lobby['label_lobby']}
                        />
                    </div>
                    <div className={'col-lg-10 col-md-10 col-sm-9 col-xs-12 pr-0'}>
                        <div className={'row pr-0 pl-0'}>
                            <div className={'col-12 text-left pr-0 pl-0'}>
                                <h1 id={'lobby-label'}>{this.state.lobby['label_lobby']}</h1>
                            </div>
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
