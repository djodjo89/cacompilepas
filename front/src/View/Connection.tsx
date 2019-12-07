import React, {ChangeEvent, FormEvent, ReactNode} from 'react';
import Request from '../API/Request';
import AuthContext from '../Global/AuthContext';

class Connection extends React.Component<{}, { status: string, token: string }> {
    private email: string;
    private password: string;

    constructor(props: any) {
        super(props);
        this.email = '';
        this.password = '';
        this.state = {
            status: '',
            token: '',
        }
        Connection.contextType = AuthContext;
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.updateConnectStatus = this.updateConnectStatus.bind(this);
        this.setState = this.setState.bind(this);
    }

    public handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.email = event.target.value;
    }

    public handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.password = event.target.value;
    }

    public updateConnectStatus(data: any): void {
        this.setState({status: '' + data['connected']});
        this.setState({token: data['token']});
        localStorage.setItem('token', JSON.stringify(data['token']));
    }

    public submitForm(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        new Request('/connection/login', 'POST', {
            email: this.email,
            password: this.password
        }, this.updateConnectStatus);
    }


    // Commenter !!!









    componentDidUpdate() {
        this.context.setToken = this.context.setToken.bind(this);
        this.context.setToken('mon token !!');
    }

    render(): ReactNode {
        return (
            <section className="content row connection-bloc">
                <AuthContext.Consumer>
                    {
                        (context) => {
                            // context.setToken('mon token : "');
                            return <h1 className={"col-lg-5 col-sm-5 offset-lg-4 offset-sm-2"}>{context.token}</h1>
                        }
                    }
                </AuthContext.Consumer>
                <div className="container">
                    <div className={"row"}>
                        {(() => {
                            if ('true' === this.state.status) {
                                // @ts-ignore
                                window.location = document.referrer;
                            } else if ('false' === this.state.status) {
                                return <div
                                    className="col-lg-3 col-sm-11 offset-lg-4 mt-0 mb-sm-3 rounded-1 connection-error">Identifiants
                                    incorrects</div>;
                            }
                        })()}
                    </div>
                    <div className={"row"}>
                        <form className="col-lg-4 col-lg-offset-4 col-sm" onSubmit={this.submitForm}>
                            <ConnectionInput id={"InputMail"} inputType={"email"} placeholder={"Adresse email"}
                                             className={""} onChange={this.handleEmailChange}/>
                            <ConnectionInput id={"InputPassword"} inputType={"password"}
                                             placeholder={"Mot de passe"}
                                             className={"custom"} onChange={this.handlePasswordChange}/>
                            <ButtonConnection/>
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

    private className: string;

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