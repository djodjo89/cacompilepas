import React, {ChangeEvent, FormEvent, ReactNode} from 'react';
import Request from '../API/Request';
import Context from '../Global/Context';

class Connection extends React.Component<{}, { status: string }> {
    private email: string;
    private password: string;
    private token: string;

    constructor(props: any) {
        super(props);
        this.email = '';
        this.password = '';
        this.token = '';
        this.state = {
            status: ''
        };
        React.createContext({
            token: ''
        });
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.updateConnectStatus = this.updateConnectStatus.bind(this);
        this.changeToken = this.changeToken.bind(this);
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
    }

    public submitForm(event: FormEvent<HTMLFormElement>): ReactNode {
        event.preventDefault();
        console.log(this.token);
        new Request('/connection/login', 'POST', {
            email: this.email,
            password: this.password
        }, this.updateConnectStatus);
        this.token = 'ieo867YI3Oh80RFY';
        return <div>
            <Context.Provider value={{
                token: this.token
            }}>
            </Context.Provider>
            <Context.Consumer>
                {(context) => {
                        this.changeToken(context);
                        return <p>{context.token}</p>
                }}
            </Context.Consumer>
        </div>;
    }


    // Commenter !!!

    public changeToken(obj: any): void {
        obj.token = 'TEI°93_R398YHIO3';
    }

    render(): ReactNode {
        return (
                <section className="content row connection-bloc">
                    <Context.Consumer>
                        {
                            (context) => {
                                this.changeToken(context);
                                return <h1 className={"col-lg-5 col-sm-5 offset-lg-4 offset-sm-2"}>{this.token}</h1>
                            }
                        }
                    </Context.Consumer>
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