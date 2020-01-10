import React, {ReactNode} from 'react';
import swal from 'sweetalert';
import '../../css/Personal.css';
import Request from "../../API/Request";
import Divider from "../General/Divider";
import PublicLobby from "../Public/PublicLobby";
import SubmitButton from "../General/SubmitButton";

interface PersonalState {
    personalInformation: any,
    lobbies: any,
    lobbyToDeleteId: number,
}

class Personal extends React.Component<any, PersonalState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            personalInformation: [],
            lobbies: [],
            lobbyToDeleteId: -1,
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

    public delete(): void {
        new Request(
            '/lobby/delete/' + this.state.lobbyToDeleteId,
            this.refreshData,
        );
    }

    public deleteLobby(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        let removeButton: any = event.target;
        let id: number = removeButton.id.split(/-/)[2];
        this.setState(
            {lobbyToDeleteId: id},
            () =>
                swal({
                    title: 'Es-tu sûr.e de vouloir supprimer ce lobby ?',
                    text: 'Toutes les fiches et les messages du lobby seront irrécupérables !',
                    buttons: ['Non, merci', 'Oui !'],
                    icon: 'warning',
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            this.delete();
                            swal('Ca y est, le lobby a été supprimé !', {
                                icon: 'success',
                            })
                        } else {
                            swal('Rassure-toi, le lobby n\'a pas été supprimé !');
                        }
                    })
        );
    }

    public refreshData(): void {
        new Request(
            '/connection/personal/0',
            this.fetchData,
        );
    }

    public renderLobbies(): ReactNode {
        let res;
        let i: number = 0;
        if (0 !== this.state.lobbies.length && undefined !== this.state.lobbies[0]) {
            res = this.state.lobbies.map(
                (lobby: any) => {
                    i++;
                    return (
                        <PublicLobby
                            key={lobby['id_lobby']}
                            id={lobby['id_lobby']}
                            label={lobby['label_lobby']}
                            description={lobby['description']}
                            logo={lobby['logo']}
                            pseudo={lobby['pseudo']}
                            onTheRight={0 === i % 2}
                            activeRemoveButton={true}
                            delete={this.deleteLobby}/>
                    );
                }
            );
        }
        else {
            res = <h4 className={'text-center col-12 mt-5'}>Il n'y a pas de lobby public pour le moment</h4>;
        }
        return res;
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
            <div className={'container-fluid mt-5 pr-0'}>
                <div className={'row container-fluid pr-0'}>
                    <div className={'row container-fluid pr-0'}>
                        <div className={'col-12'}>
                            <img
                                id={'personal-icon-' + this.state.personalInformation['id_user']}
                                className={'personal-icon'}
                                alt={'Personal icon'}
                            />
                        </div>
                    </div>
                    <div className={'row container-fluid mt-5 pr-0'}>
                        <div className={'offset-lg-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 text-lg-left text-sm-center'}>
                            <h3>{this.state.personalInformation['first_name']}</h3>
                        </div>
                        <div className={'offset-lg-1 col-lg-5 col-md-6 col-sm-6 col-xs-12 mt-4'}>
                            <a href={'/creation'}>
                                <SubmitButton
                                    text={'Crée un lobby ici !'}
                                    onClick={(event: any) => console.log('Lobby creation')}
                                    className={'mt-1px offset-lg-5 col-lg-7 col-md-6 col-sm-12 col-xs-12 container-fluid add-course-sheet-button mt-5'}
                                    disconnectButton={false}
                                />
                            </a>
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
