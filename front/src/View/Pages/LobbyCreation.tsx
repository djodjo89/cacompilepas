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
        this.setState({id: data['id_lobby']});
        this.setState({logoPath: data['logo']});
        console.log(data);
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
            <div>
                Lobby creation
                <InputArea id={'descriptionInput'}
                           placeholder={'Nouvelle description du lobby\nRacontes-y ce que tu veux, du moment que ça reste dans le thème de ton lobby'}
                           className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                           textAreaClassName={''}
                           rows={5}
                           onChange={this.handleDescriptionChange}
                           disabled={false}
                />
                <Input id={'labelInput'}
                       inputType={'text'}
                       placeholder={'Titre du lobby (n\'en mets pas un trop long)'}
                       checked={false}
                       className={'mt-5'} onChange={this.handleLabelChange}/>
                <div>
                    <DropBox
                        id={'logo-upload-input'}
                        className={''}
                        labelNotDragged={'Glisse un logo par ici !'}
                        labelDragged={'Logo déposé !'}
                        accept={'image/*'}
                        backgroundClassName={''}
                        handleFileDrop={this.handleLogoDrop}
                        handleFileChange={this.handleLogoChange}
                    />
                </div>

                <Input
                    id={'visibilitInput'}
                    inputType={'checkbox'}
                    checked={this.state.isPrivate}
                    placeholder={''}
                    className={'user-rights-checkbox'}
                    onChange={this.toggleVisibility}
                />
                <SubmitButton
                    text={'Mettre à jour le lobby'}
                    onClick={this.createLobby}
                    className={'mt-5'}
                    disconnectButton={false}
                />
            </div>
        );
    }
}

export default LobbyCreation;
