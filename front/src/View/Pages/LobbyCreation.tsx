import React, {ChangeEvent, ReactNode} from 'react';
import Request from "../../API/Request";
import DropBox from "../General/DropBox";
import Input from "../General/Input";
import InputArea from "../General/InputArea";
import SubmitButton from "../General/SubmitButton";

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
            return {isPrivate: true === state.isPrivate ? false : true};
        });
    }

    public fillLogo(data: Blob): void {
        const img: any = document.getElementById('lobby-logo' + this.state.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public checkIfOk(data: any): void {
        if (undefined !== data['id_lobby']) {
            // @ts-ignore
            document.location = '/lobby/' + data['id_lobby'];
        }
    }

    public getLogo(): void {
        new Request(
            '/lobby/getLogo/0',
            this.fillLogo,
            'POST',
            {
                idLobby: this.state.id,
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
        let formData = new FormData();
        formData.append('label', this.state.label);
        formData.append('description', this.state.description);
        formData.append('private', '' + this.state.isPrivate);
        // @ts-ignore
        formData.append('file', this.state.logo);
        new Request(
            '/lobby/create/' + -1,
            this.checkIfOk,
            'POST',
            formData,
            // @ts-ignore
            this.state.logo.type,
        );
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid'}>
                <div className={'row'}>
                    <div className={'col-12 text-left'}>
                        <h1>Créer un lobby</h1>
                    </div>
                    <div className={'col-12'}>
                        <p>Ici tu peux créer ton propre lobby</p>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'row container-fluid'}>
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
                            className={'col-lg-6 col-md-6 col-sm-6 col-xs-12'}
                            labelNotDragged={'Glisse un logo par ici !'}
                            labelDragged={'Logo déposé !'}
                            accept={'image/*'}
                            backgroundClassName={''}
                            handleFileDrop={this.handleLogoDrop}
                            handleFileChange={this.handleLogoChange}
                        />
                    </div>
                    <div className={'row container-fluid'}>
                            <div className={'pl-lg-3 pl-md-3 pl-sm-3 pl-xs-3 pt-lg-2 pt-md-1 pt-sm-3 pt-xs-4 pr-lg-2 pr-md-2 pr-sm-0 pr-xs-0'}>
                                <Input
                                    id={'visibilitInput'}
                                    inputType={'checkbox'}
                                    checked={this.state.isPrivate}
                                    placeholder={'Lobby privé'}
                                    className={'user-rights-checkbox'}
                                    onChange={this.toggleVisibility}
                                />
                            </div>
                            <h4
                                className={'col-11 pl-0 text-left lobby-write-right-label'}
                            >
                                Lobby privé (seules les personnes autorisées pourront le
                                consulter
                            </h4>
                    </div>

                    <div className={'row container-fluid'}>
                        <div className={'col-12'}>
                            <SubmitButton
                                text={'Mettre à jour le lobby'}
                                onClick={this.createLobby}
                                className={'mt-5'}
                                disconnectButton={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LobbyCreation;
