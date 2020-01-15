import React, {ChangeEvent, FormEvent, ReactNode} from 'react';
import swal from 'sweetalert';
import passwordValidator from 'password-validator';
import Request from '../../API/Request';
import DropBox from '../General/DropBox';
import Input from "../General/Input";
import SubmitButton from "../General/SubmitButton";
import Header from "../General/Header";

interface InscriptionState {
    email: string,
    password: string,
    passwordConfirmation: string,
    firstName: string,
    lastName: string,
    pseudo: string,
    validPassword: boolean,
    formWasSubmitted: boolean,
    icon: File | null,
}

class Inscription extends React.Component<any, InscriptionState> {

    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
            password: '',
            passwordConfirmation: '',
            firstName: '',
            lastName: '',
            pseudo: '',
            validPassword: false,
            formWasSubmitted: false,
            icon: null
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handlePseudoChange = this.handlePseudoChange.bind(this);
        this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
        this.handleIconChange = this.handleIconChange.bind(this);
        this.handleIconDrop = this.handleIconDrop.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.redirectToConnection = this.redirectToConnection.bind(this);
        this.setState = this.setState.bind(this);
    }

    public handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({email: event.target.value});
    }

    public handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({password: event.target.value}, this.checkForm);
    }

    public handlePasswordConfirmationChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({passwordConfirmation: event.target.value}, this.checkForm);
    }

    public handleFirstNameChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({firstName: event.target.value});
    }

    public handleLastNameChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({lastName: event.target.value});
    }

    public handlePseudoChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({pseudo: event.target.value});
    }

    public passwordVerification(): boolean {
        const schema = new passwordValidator();
        schema
            .is().min(8)
            .is().max(100)
            .has().uppercase()
            .has().lowercase()
            .has().digits()
            .has().symbols()
            .has().not().spaces();
        return schema.validate(this.state.passwordConfirmation) && this.state.password === this.state.passwordConfirmation;
    }

    public checkForm(): boolean {
        return this.passwordVerification() && this.state.firstName !== '' && this.state.lastName !== '' && this.state.pseudo !== '' && this.state.email !== '';
    }

    public redirectToConnection(data: any): void {
        if ('success' === data['status']) {
            swal({
                title: 'Bravo !',
                text: 'Tu es des nôtres à présent, connecte-toi vite pour' +
                    ' découvrir toutes les possibilités du site !!!',
                buttons: [false],
                timer: 5000,
                // @ts-ignore
            }).then(() => window.location = '/connexion/login');
        } else {
            this.setState({formWasSubmitted: true});
        }
    }

    public submitForm(event: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

        if (this.checkForm()) {
            let formData = new FormData();
            formData.append('first_name', this.state.firstName);
            formData.append('last_name', this.state.lastName);
            formData.append('pseudo', '' + this.state.pseudo);
            formData.append('email', '' + this.state.email);
            formData.append('password', '' + this.state.password);
            formData.append('confirm_password', '' + this.state.passwordConfirmation);
            // @ts-ignore
            formData.append('file', this.state.icon);
            new Request(
                '/connection/register',
                this.redirectToConnection,
                'POST',
                formData,
                // @ts-ignore
                this.state.icon.type,
            );
        } else {
            this.setState({formWasSubmitted: true});
            swal({
                title: 'Formulaire incorrect',
                text: 'Vérifie que ton mot de passe :\n' +
                    '   - Fait au moins 8 caractères\n' +
                    '   - Comporte des majuscules et des minuscules\n' +
                    '   - Contient chiffres et des caractères spéciaux\n' +
                    '   - Ne contient pas d\'espaces\n',
                icon: 'error'
            }).then((r: any) => null);
        }
    }

    public handleIconChange(event: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        // @ts-ignore
        this.setState({icon: event.target.files[0]});
    }

    public handleIconDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState({icon: event.dataTransfer.files[0]});
    }

    render(): ReactNode {
        return (
            <section className={'content row inscription-bloc'}>
                <div className={'container col-12 col-lg-6 col-md-8 col-sm-10'}>
                    <div>
                        <Header
                            h1={'Inscris-toi ici'}
                            p={'Pour accéder à notre super site de fiches de cours !'}
                            containerClassName={'ml-0 ml-lg-2 ml-md-2 ml-sm-2 mb-5'}
                            contentClassName={'pl-0'}
                        />
                        <form id={'register-form'} onSubmit={this.submitForm}>
                            <div className={'row mt-5'}>
                                <Input id={'input-first-name'} inputType={'text'} placeholder={'Prénom'}
                                       formGroupClassName={'col-4'}
                                       className={'connection-input'}
                                       onChange={this.handleFirstNameChange}/>
                                <Input id={'input-last-name'} inputType={'text'} placeholder={'Nom'}
                                       formGroupClassName={'col-4'}
                                       className={'connection-input'}
                                       onChange={this.handleLastNameChange}/>
                                <Input id={'input-pseudo'} inputType={'text'} placeholder={'Pseudo'}
                                       formGroupClassName={'col-4'}
                                       className={'connection-input'}
                                       onChange={this.handlePseudoChange}/>
                                <DropBox
                                    id={'input-icon'}
                                    className={'col-12'}
                                    labelNotDragged={'Glisse ta photo profil ici !'}
                                    labelDragged={'Photo déposée'}
                                    accept={'image/*'}
                                    backgroundClassName={''}
                                    handleFileDrop={this.handleIconDrop}
                                    handleFileChange={this.handleIconChange}
                                />
                                <Input id={'input-email'} inputType={'email'} placeholder={'Adresse email'}
                                       formGroupClassName={'col-12 mt-5'}
                                       className={'connection-input'}onChange={this.handleEmailChange}/>
                                <Input id={'input-password'} inputType={'password'}
                                       placeholder={'Mot de passe'}
                                       formGroupClassName={'col-12 mt-5'}
                                       className={'connection-input'}onChange={this.handlePasswordChange}/>
                                <Input id={'input-password-confirmation'} inputType={'password'}
                                       placeholder={'Confirmation mot de passe'}
                                       formGroupClassName={'col-12 mt-5'}
                                       className={'connection-input'}
                                       onChange={this.handlePasswordConfirmationChange}/>
                                <div className={'col-12 mt-5'}>
                                    <SubmitButton
                                        text={'Inscris-toi !'}
                                        onClick={this.submitForm}
                                        className={'connection-button'}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className={'row mt-2'}>
                            <div className={'col-12 pl-3'}>
                                <p className={'text-center'}>
                                    Déjà inscrit ?
                                    <a
                                        id={'redirect-button'}
                                        className={'h4 pl-3'}
                                        href={'/connexion/login'}
                                    >
                                        <u>
                                            Connecte-toi !
                                        </u>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Inscription;
