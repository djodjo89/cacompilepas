import React, {ChangeEvent, FormEvent, ReactElement, ReactNode} from 'react';
import Request from '../../API/Request';
import '../../css/Connection.css';
import Input from "../General/Inputs/Input";
import SubmitButton from "../General/Inputs/SubmitButton";
import Header from "../General/Header";
import swal from "sweetalert";

interface ConnectionStates {
    email: string,
    password: string,
    // Pending (''), connected ('true') or not connected ('false')
    status: string,
    token: string,
    tokenExists: boolean,
    formWasSubmitted: boolean,
}

class Connection extends React.Component<{ referrer: string }, ConnectionStates> {

    constructor(props: { referrer: string }) {
        super(props);
        this.state = {
            email: '',
            password: '',
            status: '',
            token: '',
            tokenExists: false,
            formWasSubmitted: false,
        }
        this.checkIfAlreadyConnected = this.checkIfAlreadyConnected.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.redirect = this.redirect.bind(this);
        this.referrerIsNotConnection = this.referrerIsNotConnection.bind(this);
        this.setState = this.setState.bind(this);
        this.submit = this.submit.bind(this);
        this.updateConnectStatus = this.updateConnectStatus.bind(this);
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

    public checkIfAlreadyConnected(payload: any): void {
        this.setState({tokenExists: payload['success']});
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
        this.setState({email: event.target.value});
    }

    public handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({password: event.target.value});
    }

    public updateConnectStatus(payload: any): void {
        this.setState(
            {status: '' + payload['success']},
            () => this.setState(
                {formWasSubmitted: true},
                () => localStorage.setItem('token', payload['success'] ? payload['data']['token'] : '')
            )
        );
    }

    public submit(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        new Request(
            '/connection/login',
            this.updateConnectStatus,
            'POST',
            {
                email: this.state.email,
                password: this.state.password
            },
        );
    }

    public redirect(): void {
        // @ts-ignore
        window.location = this.referrerIsNotConnection() ? this.props.referrer : '/';
    }

    render(): ReactNode {
        return (
            <section className={'content row connection-bloc'}>
                <div className={'container-fluid'}>
                    <Header
                        h1={'Connecte-toi ici'}
                        p={'Comme ça tu pourras accéder à notre super site de fiches de cours !'}
                        containerClassName={'mt-5 pt-5 ml-0 ml-lg-2 ml-md-2 ml-sm-2 mb-5'}
                        contentClassName={'offset-lg-3 offset-md-2 pl-0 pl-lg-0 pl-md-4 pl-sm-3'}
                    />
                    <div className={'row'}>
                        {(() => {
                            // If token exists and user connected, redirect to referrer
                            // Else if form was submitted and credentials were incorrect,
                            // display an error message
                            if (undefined !== localStorage.getItem('token') || '' !== localStorage.getItem('token')) {
                                if ('true' === this.state.status || this.state.tokenExists) {
                                    if (this.state.tokenExists) {
                                        this.redirect();
                                    } else {
                                        swal({
                                            title: 'Ca y est !',
                                            text: 'Tu es connecté à présent, amuse-toi bien !',
                                            icon: 'success',
                                            buttons: [false],
                                            timer: 2000,
                                            // @ts-ignore
                                        }).then(() => window.location = this.referrerIsNotConnection() ? this.props.referrer : '/');
                                    }
                                } else if ('false' === this.state.status && true === this.state.formWasSubmitted) {
                                    return (
                                        <div
                                            className={'container-fluid col-lg-6 col-md-8 col-sm-11 mb-3 pb-0 pr-4 pr-md-5 pr-sm-0 pl-4 pl-lg-4 pl-md-5 pl-sm-0'}
                                        >
                                            <div className={'col-12 p-0'}>
                                                <div className={'col-12 p-3 rounded bg-danger connection-error'}>
                                                    Identifiants incorrects
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            }
                        })()}
                    </div>
                    <div className={'row'}>
                        <form
                            id={'connect-form'}
                            className={'col-lg-6 col-md-8 col-sm-12 offset-lg-3 pr-sm-5 pl-lg-4 pl-sm-5 container-fluid'}
                            onSubmit={this.submit}
                        >
                            <div className={'row pl-4'}>
                                <div className={'row container-fluid pr-0'}>
                                    <div className={'col-12 p-0'}>
                                        <Input
                                            id={'input-email'}
                                            inputType={'email'}
                                            placeholder={'Adresse email'}
                                            checked={false}
                                            className={'connection-input'}
                                            onChange={this.handleEmailChange}
                                        />
                                    </div>
                                </div>
                                <div className={'row container-fluid mt-5 pr-0'}>
                                    <div className={'col-12 p-0'}>
                                        <Input
                                            id={'input-password'}
                                            inputType={'password'}
                                            placeholder={'Mot de passe'}
                                            checked={false}
                                            className={'connection-input'}
                                            onChange={this.handlePasswordChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <SubmitButton
                                text={'Connexion'}
                                onClick={this.submit}
                                className={'mt-5 connection-button'}
                            />
                            <div className={'row mt-2'}>
                                <div className={'col-12 pl-3'}>
                                    <p className={'text-center'}>
                                        Tu n'as pas de compte ?
                                        <a
                                            id={'redirect-button'}
                                            className={'h4 pl-3'}
                                            href={'/connexion/register'}
                                        >
                                            <u>
                                                Inscris-toi !
                                            </u>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        )
    }
}

export default Connection;
