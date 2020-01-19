import React, {ChangeEvent, ReactNode} from 'react';
import Request from "../../API/Request";
import DropBox from "../General/Inputs/DropBox";
import Input from "../General/Inputs/Input";
import InputArea from "../General/Inputs/InputArea";
import SubmitButton from "../General/Inputs/SubmitButton";
import Header from "../General/Header";
import swal from "sweetalert";

interface LobbyCreationState {
    id: number,
    label: string,
    description: string,
    isPrivate: boolean,
    logo: File | null,
    logoPath: string,
}

class LobbyCreation extends React.Component<any, LobbyCreationState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            id: -1,
            label: '',
            description: '',
            isPrivate: true,
            logo: null,
            logoPath: '',
        }
        this.checkIfOk = this.checkIfOk.bind(this);
        this.createLobby = this.createLobby.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.fillLogo = this.fillLogo.bind(this);
        this.getLogo = this.getLogo.bind(this);
        this.handleLogoDrop = this.handleLogoDrop.bind(this);
        this.handleLogoChange = this.handleLogoChange.bind(this);
    }

    public handleLabelChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({label: event.target.value});
    }

    public handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({description: event.target.value});
    }

    public toggleVisibility(event: ChangeEvent<HTMLInputElement>): void {
        this.setState((state, props) => {
            return {isPrivate: !state.isPrivate};
        });
    }

    public fillLogo(payload: Blob): void {
        const img: any = document.getElementById('lobby-logo' + this.state.id);
        const blob = new Blob([payload], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public checkIfOk(payload: any): void {
        if (payload['success']) {
            swal({
                title: 'Bien joué !',
                text: 'Le lobby ' + this.state.label + ' a bien été créé !',
                buttons: [false],
                icon: 'success',
                timer: 5000,
                // @ts-ignore
            }).then(() => document.location = '/lobby/' + payload['data']['id_lobby']);
        } else {
            swal({
                title: 'Oups !',
                text: 'Il y a eu un soucis lors de la création du lobby, vérifie ' +
                    'que tu as bien rempli tous les champs.',
                icon: 'warning',
            })
        }
    }

    public getLogo(): void {
        new Request(
            '/lobby/get_logo/' + this.state.id,
            this.fillLogo,
            'POST',
            {
                path: this.state.logoPath,
            },
            'json',
            'blob',
        );
    }

    public handleLogoDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState(
            {logo: event.dataTransfer.files[0]},
            this.getLogo
        );
    }

    public handleLogoChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState(
            // @ts-ignore
            {logo: event.target.files[0]},
            this.getLogo
        );
    }

    public createLobby(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        if ('' !== this.state.label && '' !== this.state.description) {
            let formData = new FormData();
            formData.append('label', this.state.label);
            formData.append('description', this.state.description);
            formData.append('private', '' + this.state.isPrivate);

            if (null !== this.state.logo) {
                // @ts-ignore
                formData.append('file', this.state.logo);

                new Request(
                    '/lobby/create',
                    this.checkIfOk,
                    'POST',
                    formData,
                    // @ts-ignore
                    this.state.logo.type,
                );
            } else {
                new Request(
                    '/lobby/create',
                    this.checkIfOk,
                    'POST',
                    formData,
                    // @ts-ignore
                    'jpg',
                );
            }
        } else {
            swal({
                title: 'Oups !',
                text: 'Il y a eu un soucis lors de la création du lobby, vérifie' +
                    ' que tu as bien rempli tous les champs.',
                icon: 'warning',
            })
        }
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid'}>
                <Header
                    h1={'Créer un lobby'}
                    p={'Ici tu peux créer ton propre lobby'}
                />
                <div className={'row'}>
                    <div className={'row container-fluid mb-4 pb-3'}>
                        <div className={'col-lg-6 col-md-6 col-sm-12 col-xs-12'}>
                            <Input id={'label-input'}
                                   inputType={'text'}
                                   placeholder={'Titre du lobby (n\'en mets pas un trop long)'}
                                   checked={false}
                                   className={'mt-5'} onChange={this.handleLabelChange}
                            />
                        </div>
                    </div>
                    <div className={'row container-fluid'}>
                        <div className={'col-lg-6 col-md-6 col-sm-6 col-xs-12'}>
                            <InputArea id={'description-input'}
                                       placeholder={'Nouvelle description du lobby\nRacontes-y ce que tu veux, du moment que ça reste dans le thème de ton lobby'}
                                       className={''}
                                       textAreaClassName={''}
                                       rows={7}
                                       onChange={this.handleDescriptionChange}
                                       disabled={false}
                            />
                        </div>
                        <DropBox
                            id={'logo-upload-input'}
                            className={'col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 mt-sm-0 pt-1 pt-sm-0'}
                            labelNotDragged={'Glisse un logo par ici !'}
                            labelDragged={'Logo déposé !'}
                            accept={'image/*'}
                            backgroundClassName={'mt-1'}
                            handleFileDrop={this.handleLogoDrop}
                            handleFileChange={this.handleLogoChange}
                        />
                    </div>
                    <div className={'row container-fluid mt-3 mt-sm-2'}>
                            <div className={'pl-lg-3 pl-md-3 pl-sm-3 pl-xs-3 pt-lg-2 pt-md-1 pt-sm-3 pt-xs-4 pr-lg-2 pr-md-2 pr-sm-0 pr-xs-0'}>
                                <Input
                                    id={'visibility-input'}
                                    inputType={'checkbox'}
                                    checked={this.state.isPrivate}
                                    placeholder={'LobbyPage privé'}
                                    className={'user-rights-checkbox'}
                                    onChange={this.toggleVisibility}
                                />
                            </div>
                        <div className={'col-11 mt-0 mt-lg-2 mt-md-2 mt-sm-3 pt-0 pl-0 text-left lobby-write-right-label'}>
                            <h4
                                className={'mt-2 mt-lg-2 mt-md-1 pt-1 pt-md-1 ml-3 ml-lg-2 ml-md-2 ml-sm-3'}
                            >
                                Lobby privé (seules les personnes autorisées pourront le
                                consulter
                            </h4>
                        </div>
                    </div>

                    <div className={'row container-fluid'}>
                        <div className={'col-12'}>
                            <SubmitButton
                                text={'Créer le lobby'}
                                onClick={this.createLobby}
                                className={'mt-5'}
                                disconnectButton={'plus'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LobbyCreation;
