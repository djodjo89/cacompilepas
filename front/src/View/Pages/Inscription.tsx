import React, {ChangeEvent, FormEvent, ReactNode} from 'react';
import Request from '../../API/Request';
import '../../css/Inscription.css';
import DropBox from '../General/DropBox';

class Inscription extends React.Component{
    private email: string;
    private password: string;
    private passwordConfirmation: string;
    private prenom: string;
    private nom: string;
    private pseudo: string;
    private passwordValid: boolean;

    constructor(props: any) {
        super(props);
        this.prenom = '';
        this.nom = '';
        this.pseudo = '';
        this.email = '';
        this.password = '';
        this.passwordConfirmation = '';
        this.passwordValid = false;

        this.state = {
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePrenomChange = this.handlePrenomChange.bind(this);
        this.handleNomChange = this.handleNomChange.bind(this);
        this.handlePseudoChange = this.handlePseudoChange.bind(this);
        this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.updateConnectStatus = this.updateConnectStatus.bind(this);
        this.setState = this.setState.bind(this);
    }

    public handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.email = event.target.value;
    }

    public handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
        this.password = event.target.value;
    }

    public handlePasswordConfirmationChange (event: ChangeEvent<HTMLInputElement>) : void {
        this.passwordConfirmation = event.target.value;
        this.passwordVerification();
    }

    public handlePrenomChange (event: ChangeEvent<HTMLInputElement>) : void {
        this.prenom = event.target.value;
    }

    public handleNomChange (event: ChangeEvent<HTMLInputElement>) : void {
        this.nom = event.target.value;
    }

    public handlePseudoChange (event: ChangeEvent<HTMLInputElement>) : void {
        this.pseudo = event.target.value;
    }

    public passwordVerification () : boolean {

        if (this.password.length > 8){
            console.log("mdp suffisament long");
            return true;
        }
        else{
            console.log("mdp trop court");
            return false;
        }

    }

    public checkForm () : boolean {
        console.log(this.passwordVerification());
        if (this.passwordVerification() && this.prenom !== '' && this.nom !== '' && this.pseudo !=='' && this.email !== ''){
            console.log("Formulaire Correct");
            return true;
        }
        else{
            console.log("Form pas correct");
            return false;
        }

    }

    public updateConnectStatus(data: any): void {
        this.setState({status: '' + data['connected']});
        localStorage.setItem('token', data['token']);
    }

    public redirectToConnectionPage(): void {
        // @ts-ignore
        window.location='/connexion';
    }

    public submitForm(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (this.checkForm()){
            new Request(
                '/connection/register',
                this.updateConnectStatus,
                'POST',
                {
                    prenom : this.prenom,
                    nom : this.nom,
                    pseudo : this.pseudo,
                    email: this.email,
                    password: this.password
                },
            );
        }
        else{
            alert("erreur")
        }

        this.setState({formWasSubmitted: true});
    }

    render(): ReactNode {
        return (
            <section className="content row inscription-bloc">
                <div className="container">
                    <div>
                        <form onSubmit={this.submitForm}>
                            <div className={"row buttons-top"}>
                                <InscriptionInput id={"inputPrenom"} inputType={"text"} placeholder={"Prénom"} className={""} onChange={this.handlePrenomChange}/>
                                <InscriptionInput id={"inputNom"} inputType={"text"} placeholder={"Nom"} className={""} onChange={this.handleNomChange}/>
                                <InscriptionInput id={"Pseudo"} inputType={"text"} placeholder={"Pseudo"} className={""} onChange={this.handlePseudoChange}/>
                            </div>

                            <div className={"buttons-bottom"}>
                                <InscriptionInput id={"inputMail"} inputType={"email"} placeholder={"Adresse email"}
                                                  className={""} onChange={this.handleEmailChange}/>
                                <InscriptionInput id={"inputPassword"} inputType={"password"}
                                                  placeholder={"Mot de passe"}
                                                  className={"custom"} onChange={this.handlePasswordChange}/>
                                <InscriptionInput id={"inputPasswordConfirmation"} inputType={"password"}
                                                  placeholder={"Confirmation mot de passe"}
                                                  className={"custom"} onChange={this.handlePasswordChange}/>
                                <div className={"submit-button"}>
                                    <ButtonInscription/>
                                </div>
                            </div>
                        </form>
                        <br/>
                        Déja Inscrit ? <a id={"redirect-button"} onClick={this.redirectToConnectionPage}>Connecte toi ! </a>
                    </div>
                </div>
            </section>
        )
    }
}

interface InscriptionInputProps {
    id: string;
    inputType: string;
    placeholder: string;
    className: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

class InscriptionInput extends React.Component<InscriptionInputProps, {}> {

    private readonly className: string;

    constructor(props: InscriptionInputProps) {
        super(props);
        this.className = "form-control text-center mt-0 rounded-1 " + this.props.className;
    }

    public render(): ReactNode {
        return <div className="form-group">
            <input type={this.props.inputType}
                   className={this.className}
                   id={this.props.id}
                   placeholder={this.props.placeholder}
                   onFocus={e => e.target.placeholder = ""}
                   onBlur={e => e.target.placeholder = this.props.placeholder}
                   onChange={this.props.onChange}
            />
        </div>

    }
}
/*
class DifferentPasswordError extends React.Component<{}, {}> {
    public render (){
        if ()
        return (
            <div>mot de passe différents</div>
        )
    }
}

 */


class ButtonInscription extends React.Component<{}, {}> {
    public render() {
        return (
            <button type="submit" className="btn btn-default btn-transparent mt-0 rounded-1 custom">Connexion</button>
        )
    }
}

export default Inscription;
