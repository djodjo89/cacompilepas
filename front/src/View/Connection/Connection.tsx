import React, {ChangeEvent, FormEvent, ReactNode} from 'react';
import Request from '../../API/Request';
import '../../css/Connection.css';

interface ConnectionStates {
    // Pending (''), connected ('true') or not connected ('false')
    status: string,
    token: string,
    tokenExists: boolean,
    formWasSubmitted: boolean,
}

class Connection extends React.Component<{}, ConnectionStates> {
    private email: string;
    private password: string;

    constructor(props: any) {
        super(props);
        this.email = '';
        this.password = '';
        this.state = {
            status: '',
            token: '',
            tokenExists: false,
            formWasSubmitted: false,
        }
        this.referrerIsNotConnection = this.referrerIsNotConnection.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.updateConnectStatus = this.updateConnectStatus.bind(this);
        this.setState = this.setState.bind(this);
        this.checkIfAlreadyConnected = this.checkIfAlreadyConnected.bind(this);
    }

    // Check if token is still valid
    public componentDidMount(): void {
        if (undefined !== localStorage.getItem('token') && '' !== localStorage.getItem('token')) {
            new Request(
                '/connection/verification',
                this.checkIfAlreadyConnected,
            );
        }
    }

    public checkIfAlreadyConnected(data: any): void {
        this.setState({tokenExists: data['token_exists']});
        if (false === this.state.tokenExists) {
            localStorage.setItem('token', '');
        }
    }

    // Check if referrer is not '/connexion/login' in order to prevent a redirecting infinite loop
    public referrerIsNotConnection(): boolean {
        // @ts-ignore
        return document.referrer.split(/\//)[3] !== 'connexion' && document.referrer.split(/\//)[4] !== 'login';
    }

    public handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        console.log(this.email);
        this.email = event.target.value;
    }

    public handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.password = event.target.value;
    }

    public updateConnectStatus(data: any): void {
        this.setState({status: '' + data['connected']});
        localStorage.setItem('token', data['token']);
    }

    public submitForm(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        new Request(
            '/connection/login',
            this.updateConnectStatus,
            'POST',
            {
                email: this.email,
                password: this.password
            },
        );
        this.setState({formWasSubmitted: true});
    }

    public redirectToInscriptionPage(): void {
        // @ts-ignore
        window.location='/Inscription';
    }

    render(): ReactNode {
        return (
            <section className="content row connection-bloc">
                <div className="container">
                    <div className={"row"}>
                        {(() => {
                            // If token exists and user connected, redirect to referrer
                            // Else if form was submitted and credentials were incorrect,
                            // display an error message
                            if (undefined !== localStorage.getItem('token') || '' !== localStorage.getItem('token')) {
                                if ('true' === this.state.status || true === this.state.tokenExists) {
                                    if (this.referrerIsNotConnection()) {
                                        // @ts-ignore
                                        window.location = document.referrer;
                                    } else {
                                        // @ts-ignore
                                        window.location = '/';
                                    }
                                } else if ('false' === this.state.status && true === this.state.formWasSubmitted) {
                                    return <div
                                        className="col-lg-3 col-sm-11 offset-lg-4 mt-0 mb-sm-3 rounded-1 connection-error">
                                        Identifiants incorrects
                                    </div>;
                                }
                            } else {
                                return
                            }
                        })()}
                    </div>
                    <div className={"row"}>
                        <form id={"connectForm"} className="col-lg-4 col-lg-offset-4 col-sm" onSubmit={this.submitForm}>
                            <ConnectionInput id={"inputMail"} inputType={"email"} placeholder={"Adresse email"}
                                             className={""} onChange={this.handleEmailChange}/>
                            <ConnectionInput id={"inputPassword"} inputType={"password"}
                                             placeholder={"Mot de passe"}
                                             className={"custom"} onChange={this.handlePasswordChange}/>
                            <ButtonConnection/>
                            <br/>
                            <br/>
                            Pas encore de compte ? <a id={"redirect-button-to-inscription"} onClick={this.redirectToInscriptionPage}>Inscrit toi ! </a>
                        </form>
                    </div>
                </div>
            </section>
        )
    }
}

interface ConnectionInputProps {
    id: string;
    inputType: string;
    placeholder: string;
    className: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

class ConnectionInput extends React.Component<ConnectionInputProps, {}> {

    private readonly className: string;

    constructor(props: ConnectionInputProps) {
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

class ButtonConnection extends React.Component<{}, {}> {
    public render() {
        return (
            <button type="submit" className="btn btn-default btn-transparent mt-0 rounded-1 custom">Connexion</button>
        )
    }
}

export default Connection;

