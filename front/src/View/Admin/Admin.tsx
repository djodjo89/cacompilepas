import React, {ChangeEvent, ReactNode} from 'react';
import Request from "../../API/Request";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {ReactComponent as Loader} from "../../img/loader.svg";
import PlusIcon from '../../img/plus-icon.png';
import Input from "../General/Input";
import InputArea from "../General/InputArea";
import DropBox from "../General/DropBox";
import '../../css/Admin.css';
import CourseSheets from "../Lobby/CourseSheets";

interface AdminState {
    isAdmin: string,
    currentTab: string,
    currentLabel: string,
    currentDescription: string,
    currentLogo: File | null,
    newLabel: string,
    newDescription: string,
    newLogo: File | null,
    courseSheets: [],
}

class Admin extends React.Component<any, AdminState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            isAdmin: '',
            currentTab: 'presentation',
            currentLabel: '',
            currentDescription: '',
            currentLogo: null,
            newLabel: '',
            newDescription: '',
            newLogo: null,
            courseSheets: [],
        }
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.updateLobbby = this.updateLobbby.bind(this);
        this.update = this.update.bind(this);
        this.navigateToCourseSheets = this.navigateToCourseSheets.bind(this);
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
    }

    public checkIfAdmin(data: any): void {
        if (undefined === data['message']) {
            this.setState({isAdmin: 'true'});
            this.setState({currentLabel: data[0]['label_lobby']});
            this.setState({currentDescription: data[0]['description']});
        } else {
            this.setState({isAdmin: 'false'});
        }
    }

    public componentDidMount(): void {
        new Request('/lobby/consult/' + this.props.location.pathname.split(/\//)[2], 'POST', 'json', {token: localStorage.getItem('token')}, this.checkIfAdmin);
        new Request('/lobby/coursesheets/' + this.props.location.pathname.split(/\//)[2], 'POST', 'json', {token: localStorage.getItem('token')}, this.fillCourseSheets);
    }

    public fillCourseSheets(data: any): void {
        if (undefined === data['message']) {
            this.setState({courseSheets: data});
        }
    }

    public handleLabelChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newLabel: event.target.value});
    }

    public handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newDescription: event.target.value});
    }

    public handleFileDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState({newLogo: event.dataTransfer.files[0]});
    }

    public handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({newLogo: event.target.files[0]});
    }

    public update(data: any): void {
        if (undefined !== data['message_label']) {
            this.setState({currentLabel: this.state.newLabel});
        }
        if (undefined !== data['message_description']) {
            this.setState({currentDescription: this.state.newDescription});
        }
        if (undefined !== data['message_logo']) {
            this.setState({currentLogo: this.state.newLogo});
        }
    }

    public navigateToCourseSheets(event: React.MouseEvent<HTMLLIElement, MouseEvent>): void {
        event.preventDefault();
        let target: any = event.target;
        for (let li of target.parentElement.parentElement.children) {
            li.firstElementChild.className = 'nav-link custom-tab';
        }
        target.className = target.className + ' custom-tab-active';
        this.setState({currentTab: target.attributes.href.value});
    }

    public updateLobbby(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        let formData = new FormData();
        // @ts-ignore
        formData.append('token', localStorage.getItem('token'));
        if ('' !== this.state.newLabel) {
            formData.append('label', this.state.newLabel);
        }
        if ('' !== this.state.newDescription) {
            formData.append('description', this.state.newDescription);
        }
        if (null !== this.state.newLogo) {
            formData.append('file', this.state.newLogo);
            new Request('/lobby/update/' + this.props.location.pathname.split(/\//)[2], 'POST', this.state.newLogo.type, formData, this.update);
        } else {
            new Request('/lobby/update/' + this.props.location.pathname.split(/\//)[2], 'POST', '', formData, this.update);
        }
    }

    public render(): ReactNode {
        return (
            <Router>
                <Switch>
                    <Route exact path={this.props.path}>
                        <h3>Veuillez choisir un lobby</h3>
                    </Route>
                    <Route path={this.props.location.pathname}>
                        {() => {
                            if ('true' === this.state.isAdmin) {
                                let tab;
                                switch (this.state.currentTab) {
                                    case 'presentation':
                                        tab = (
                                            <div className={'container-fluid col-lg-6'}>
                                                <h2>Informations visibles par les visiteurs</h2>
                                                <Input id={'labelInput'} inputType={'text'}
                                                       placeholder={'Titre du lobby (n\'en mets pas un trop long)'}
                                                       className={'mt-5'} onChange={this.handleLabelChange}/>
                                                <div className={'row mt-5'}>
                                                    <InputArea id={'descriptionInput'}
                                                               placeholder={'Nouvelle description du lobby\nRacontes-y ce que tu veux, du moment que ça reste dans le thème de ton lobby'}
                                                               className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                                                               textAreaClassName={''}
                                                               rows={5}
                                                               onChange={this.handleDescriptionChange}
                                                               disabled={false}
                                                    />
                                                    <InputArea id={'descriptionInput'}
                                                               placeholder={'Description actuelle du lobby\n' + this.state.currentDescription}
                                                               className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                                                               textAreaClassName={''}
                                                               rows={5}
                                                               onChange={this.handleDescriptionChange}
                                                               disabled={true}
                                                    />
                                                </div>
                                                <DropBox id={'logoInput'}
                                                         className={'mt-4'}
                                                         label={'Glisse un logo par ici !'}
                                                         accept={'image/*'}
                                                         backgroundClassName={'mt-4'}
                                                         handleFileDrop={this.handleFileDrop}
                                                         handleFileChange={this.handleFileChange}/>
                                                <SubmitButton
                                                    text={'Mettre à jour le lobby'}
                                                    onClick={this.updateLobbby}
                                                    className={''}/>
                                            </div>
                                        );
                                        break;

                                    case 'coursesheets':
                                        tab = (
                                            <div className={'container-fluid col-lg-6'}>
                                                <h2>Informations visibles par les visiteurs</h2>
                                                <div className={'row mt-5'}>
                                                    <div className={'col-sm-4'}>
                                                        <Input id={'titleInput'} inputType={'text'}
                                                               placeholder={'Titre'}
                                                               className={''}
                                                               onChange={this.handleLabelChange}/>
                                                        <DropBox id={'courseSheetInput'}
                                                                 className={'text-sm-left'}
                                                                 backgroundClassName={'mt-1'}
                                                                 label={'Glisse une fiche par ici !'}
                                                                 accept={'.docx,.pdf,.html,.htm,.odp,txt,md'}
                                                                 handleFileDrop={this.handleFileDrop}
                                                                 handleFileChange={this.handleFileChange}/>
                                                    </div>
                                                    <div className={'col-sm-8'}>
                                                        <div className={'row container-fluid'}>
                                                            <InputArea id={'descriptionInput'}
                                                                       placeholder={'Nouvelle description du lobby\nRacontes-y ce que tu veux, du moment que ça reste dans le thème de ton lobby'}
                                                                       className={'col-lg-12 col-md-12 col-sm-12 col-xs-12 course-sheet-textarea'}
                                                                       textAreaClassName={'course-sheet-textarea'}
                                                                       rows={6}
                                                                       onChange={this.handleDescriptionChange}
                                                                       disabled={false}
                                                            />
                                                        </div>
                                                        <div className={'row container-fluid'}>
                                                            <SubmitButton
                                                                text={'Une nouvelle fiche ? Ajoute-la !'}
                                                                onClick={this.updateLobbby}
                                                                className={'col-sm-12 container-fluid add-coursesheet-button'}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'row mt-5'}>
                                                    <CourseSheets id={this.props.location.pathname.split(/\//)[2]} courseSheets={this.state.courseSheets} className={'col-lg-12 col-sm-12 mt-lg-3'}/>
                                                </div>
                                            </div>
                                        );
                                        break;

                                    case 'rights':
                                        tab = <h2>Utilisateurs autorisés à consulter le lobby</h2>;
                                        break;

                                    default:
                                        tab = <h2>Informations visibles par les visiteurs</h2>
                                        break;
                                }
                                return (
                                    <section className={'content row container-fluid'}>
                                        <div className={'row col col-lg-12 col-md-12 col-sm-12 col-xs-12'}>
                                            <div className={'admin-header'}>
                                                <h1>{this.state.currentLabel}</h1>
                                                <nav>
                                                    <ul className="nav nav-tabs custom-tab-nav">
                                                        <li className="nav-item" onClick={this.navigateToCourseSheets}>
                                                            <a className="nav-link custom-tab-active custom-tab"
                                                               href={'presentation'}>Description</a>
                                                        </li>
                                                        <li className="nav-item" onClick={this.navigateToCourseSheets}>
                                                            <a className="nav-link custom-tab"
                                                               href={'coursesheets'}>Fiches</a>
                                                        </li>
                                                        <li className="nav-item" onClick={this.navigateToCourseSheets}>
                                                            <a className="nav-link custom-tab"
                                                               href={'rights'}>Droits</a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                        {tab}
                                    </section>
                                );
                            } else if ('false' === this.state.isAdmin) {
                                return (
                                    <div>
                                        <h1>Vous n'êtes pas administrateur de ce lobby</h1>
                                    </div>
                                );
                            } else {
                                return <div className={'mt-5'}><Loader/></div>
                            }
                        }}
                    </Route>
                </Switch>
            </Router>
        );
    }
}

class SubmitButton extends React.Component<{ text: string, onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, className: string }, {}> {
    public render() {
        return (
            <button className={"btn btn-default btn-transparent mt-5 rounded-1" + this.props.className}
                    onClick={this.props.onClick}><img id={'plus-icon'} className={''} src={PlusIcon}/>{this.props.text}
            </button>
        )
    }
}

export default Admin;
