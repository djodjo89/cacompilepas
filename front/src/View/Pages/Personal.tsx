import React, {ReactNode} from 'react';
import '../../css/Personal.css';
import Request from "../../API/Request";
import Divider from "../General/Divider";
import PublicLobby from "../Public/PublicLobby";

interface PersonalState {
    personalInformation: any,
    lobbies: any,
}

class Personal extends React.Component<any, PersonalState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            personalInformation: [],
            lobbies: [],
        }
        this.fetchData = this.fetchData.bind(this);
        this.fillIcon = this.fillIcon.bind(this);
        this.getIcon = this.getIcon.bind(this);
        this.renderLobbies = this.renderLobbies.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteLobby = this.deleteLobby.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    public componentDidMount(): void {
        this.refreshData();
    }

    public delete(data: any): void {
        this.refreshData();
    }

    public deleteLobby(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        let removeButton: any = event.target;
        new Request(
            '/lobby/delete/' + removeButton.id.split(/-/)[1],
            this.delete,
        );
    }

    public refreshData(): void {
        new Request(
            '/connection/personal/0',
            this.fetchData,
        );
    }

    public renderLobbies(): ReactNode {
        if (undefined === this.state.lobbies['message']) {
            return this.state.lobbies.map(
                (lobby: any) =>
                    <PublicLobby
                        key={lobby['id_lobby']}
                        id={lobby['id_lobby']}
                        label={lobby['label_lobby']}
                        description={lobby['description']}
                        logo={lobby['logo']}
                        pseudo={lobby['pseudo']}
                    />
            );
        }
        else {
            return <div></div>;
        }
    }

    public getIcon(): void {
        new Request(
            '/connection/getIcon/' + this.state.personalInformation['id_user'],
            this.fillIcon,
            'POST',
            {
                path: this.state.personalInformation['icon'],
            },
            'json',
            'blob',
        );
    }

    public fillIcon(data: Blob): void {
        const img: any = document.getElementById('personal-icon-' + this.state.personalInformation['id_user']);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public fetchData(data: any) {
        this.setState({
                personalInformation: data[0],
                lobbies: data[1],
            },
            this.getIcon);
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid mt-5'}>
                <div className={'row container-fluid'}>
                    <div className={'row container-fluid'}>
                        <div className={'col-12'}>
                            <img
                                id={'personal-icon-' + this.state.personalInformation['id_user']}
                                className={'personal-icon'}
                                alt={'Personal icon'}
                            />
                        </div>
                    </div>
                    <div className={'row container-fluid mt-5'}>
                        <div className={'col-12 text-center'}>
                            <h3>{this.state.personalInformation['first_name']}</h3>
                        </div>
                    </div>
                </div>
                <Divider
                    className={'mt-5 offset-lg-2 col-lg-8'}
                />
                <div className={'row container-fluid mt-5'}>
                    <div className={'row container-fluid'}>
                        <div className={'col-12 text-center'}>
                            <h2>Mes lobbies</h2>
                        </div>
                    </div>
                    <div className={'container-fluid ml-lg-5 pl-lg-5'}>
                        <div className={'col-lg-12 offset-lg-1 pr-0'}>
                            {this.renderLobbies()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Personal;
