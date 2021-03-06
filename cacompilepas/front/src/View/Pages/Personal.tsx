import React, {ReactNode} from 'react';
import swal from 'sweetalert';
import '../../css/Personal.css';
import Request from "../../API/Request";
import Divider from "../General/Divider";
import PublicLobby from "../Public/PublicLobby";
import SubmitButton from "../General/Inputs/SubmitButton";

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
                        }
                    })
        );
    }

    public refreshData(): void {
        new Request(
            '/user/personal',
            this.fetchData,
        );
    }

    public renderButtonCreationLobbyTop(): ReactNode {
        let res;
        let i: number = 0;
        if (0 !== this.state.lobbies.length && undefined !== this.state.lobbies[0]) {
            res = <div className={'offset-lg-1 col-lg-7 col-md-12 col-sm-12 col-xs-12 mt-4'}>
                <a href={'/creation'}>
                    <SubmitButton
                        text={'Crée un lobby ici !'}
                        onClick={(event: any) => null}
                        className={'mt-1px offset-lg-5 col-lg-11 col-md-9 col-sm-12 col-xs-12 container-fluid add-course-sheet-button mt-5'}
                        disconnectButton={'plus'}
                    />
                </a>
            </div>
        }
        else {
            res = <div></div>

        }
        return res;
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
            res = <div className={'col-12 col-lg-5 col-md-10 offset-md-2 col-sm-8 offset-sm-2 mt-4 centered'}>
                         <a href={'/creation'}>
                             <div className={'offset-lg-0 offset-md-2 pl-lg-0 pl-md-5'}>
                                 <SubmitButton
                                     text={'Crée ton premier lobby ici !'}
                                     onClick={(event: any) => null}
                                     className={'mt-1 col-12 col-lg-12 col-md-9 pl-md-5 offset-md-5 col-sm-12 container-fluid add-course-sheet-button mt-5'}
                                     disconnectButton={'plus'}
                                 />
                             </div>
                         </a>
                    </div>

        }
        return res;
    }

    public getIcon(): void {
        new Request(
            '/user/get_icon/' + this.state.personalInformation['id_user'],
            this.fillIcon,
            'POST',
            {
                path: this.state.personalInformation['icon'],
            },
            'json',
            'blob',
        );
    }

    public fillIcon(payload: Blob): void {
        const img: any = document.getElementById('personal-icon-' + this.state.personalInformation['id_user']);
        const blob = new Blob([payload], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public fetchData(payload: any): void {
        this.setState({
                personalInformation: payload['data'][0],
                lobbies: undefined !== payload['data'][1] ? payload['data'][1] : [],
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
                                alt={this.state.personalInformation['pseudo']}
                            />
                        </div>
                    </div>
                    <div className={'row container-fluid mt-5 pr-0'}>
                        <div className={'offset-lg-3 col-lg-3 col-md-6 col-sm-6 col-xs-12 text-lg-left text-sm-center mt-sm-4'}>
                            <h3>{this.state.personalInformation['first_name']}</h3>
                        </div>
                        <div className={'offset-lg-1 col-12 col-lg-5 col-md-6 col-sm-6 mt-4'}>
                            {this.renderButtonCreationLobbyTop()}
                        </div>
                    </div>
                </div>
                <Divider
                    className={'mt-5 offset-lg-2 col-lg-8'}
                />
                <div className={'container-fluid mt-5'}>
                    <div className={'container-fluid'}>
                        <div className={'col-12 text-center'}>
                            <h2>Mes lobbies</h2>
                        </div>
                    </div>
                    <div className={'row container-fluid pl-0 pl-lg-5 ml-lg-5'}>
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

