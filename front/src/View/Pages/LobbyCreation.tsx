import React, {ChangeEvent, FormEvent, ReactNode} from 'react';
import '../../css/LobbyCreation.css';
import Request from "../../API/Request";


interface InputProps {
    inputType: string;
    placeholder: string;
    className: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

class LobbyCreation extends React.Component {

    private title: string;
    private description: string;
    private privateLobby : boolean;

    constructor(props :any) {
        super(props);
        this.title = '';
        this.description = '';
        this.privateLobby = false;

        this.state = {
            status: '',
            token: '',
            tokenExists: false,
            formWasSubmitted: false,
        }

        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeTypeLobby = this.handleChangeTypeLobby.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.SubmitForm = this.SubmitForm.bind(this);
    }

    public updateConnectStatus(data: any): void {
        this.setState({status: '' + data['connected']});
        localStorage.setItem('token', data['token']);
    }

    public SubmitForm(): void {
        if (this.title === '' || this.description === '') {
            alert("Champ(s) incomplet(s)");
        } else {
            new Request('/Creation', 'POST', 'json', {
                Title: this.title,
                Description: this.description,
                PrivateLobby: this.privateLobby
            });
        }
    }

    public handleChangeTitle(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.title = event.target.value;
    }

    public  handleChangeDescription(event: ChangeEvent<HTMLInputElement>): void{
        // @ts-ignore
        this.description = event.target.value;
    }

    public  handleChangeTypeLobby(): void{
        // @ts-ignore
        this.privateLobby = true;
        console.log(this.privateLobby);
    }

    render() : ReactNode{
        return (
            <section className={"container-fluid "}>
                <h1>Créer un lobby</h1>
                <h2>Sur cette page tu peux créer un super lobby dans lequel toi et tes compagnons de jeu pourront consulter, ajouter et mettre à jour des fiches de cours</h2>

                <form onSubmit={this.SubmitForm}>
                    <Input onChange={this.handleChangeTitle} className={"TitleDescription"} inputType={"text"} placeholder={"Titre du lobby (n'en mets pas un trop long)"}/>
                    <Input onChange={this.handleChangeDescription} className={"DescriptionInput"}inputType={"textarea"} placeholder={"Description du lobby. Met ce que tu veut du moment que cela reste cohérent avec le thème de ton lobby"}/>
                    <div id={"privateButton"}><input onClick={this.handleChangeTypeLobby} type={"checkbox"} value={"private"}/> Lobby privé (seul les personnes autorisées pourront le consulter)</div>
                    <button onClick={this.SubmitForm} className={"CreationLobby"}>Creer le Lobby !</button>
                </form>
            </section>
        )
    }
}

class Input extends React.Component<InputProps, {}> {

    private readonly className: string;

    constructor(props: InputProps) {
        super(props);
        this.className = this.props.className;
    }

    public render(): ReactNode {
        return <div className="form-group">
            <input type={this.props.inputType}
                   className={this.className}
                   placeholder={this.props.placeholder}
                   onFocus={e => e.target.placeholder = ""}
                   onBlur={e => e.target.placeholder = this.props.placeholder}
                   onChange={this.props.onChange}
            />
        </div>
    }
}

/*
class UploadZone extends React.Component{
    render(){
        return (
            <table className={"buttonsZone"}>
                <tr>
                    <td><div className={"uploadPDF"}><Upload/></div></td>
                    <td><div className={"uploadLogo"}><Upload/></div></td>
                </tr>
            </table>
        );
    }
}
 */

export default LobbyCreation;