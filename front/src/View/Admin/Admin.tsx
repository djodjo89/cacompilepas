import React, {ChangeEvent, ReactNode} from 'react';
import Request from '../../API/Request';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import {ReactComponent as Loader} from '../../img/loader.svg';
import Input from '../General/Input';
import InputArea from '../General/InputArea';
import DropBox from '../General/DropBox';
import '../../css/Admin.css';
import CourseSheets from '../Lobby/CourseSheets';
import Users from './Users';
import HashtagInput from "../General/HashtagInput";
import SubmitButton from "../General/SubmitButton";
import Messages from "../Lobby/Messages";

interface AdminState {
    id: number,
    isAdmin: string,
    currentTab: string,
    currentLabel: string,
    currentDescription: string,
    currentLogo: File | null,
    newLabel: string,
    newDescription: string,
    newLogo: File | null,
    courseSheets: [],
    messages: [],
    newCourseSheetTitle: string,
    newCourseSheetDescription: string,
    newCourseSheetDocument: File | null,
    users: [],
    newUserEmail: string,
    private: string,
    hashtagInputIsNotEmpty: boolean,
    hashtagsView: ReactNode,
    hashtags: string[],
    logoPath: string,
}

class Admin extends React.Component<any, AdminState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            id: this.props.location.pathname.split(/\//)[2],
            isAdmin: '',
            currentTab: 'presentation',
            currentLabel: '',
            currentDescription: '',
            currentLogo: null,
            newLabel: '',
            newDescription: '',
            newLogo: null,
            courseSheets: [],
            messages: [],
            newCourseSheetTitle: '',
            newCourseSheetDescription: '',
            newCourseSheetDocument: null,
            users: [],
            newUserEmail: '',
            private: '',
            hashtagInputIsNotEmpty: true,
            hashtagsView: <div></div>,
            hashtags: [],
            logoPath: '',
        }
        this.init = this.init.bind(this);
        this.init();
    }

    public init(): void {
        this.addUser = this.addUser.bind(this);
        this.checkIfAdmin = this.checkIfAdmin.bind(this);
        this.emptyInput = this.emptyInput.bind(this);
        this.fetchCourseSheets = this.fetchCourseSheets.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.fillPresentation = this.fillPresentation.bind(this);
        this.fillUsers = this.fillUsers.bind(this);
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.fillMessages = this.fillMessages.bind(this);
        this.fillLogo = this.fillLogo.bind(this);
        this.handleCourseSheetDocumentDrop = this.handleCourseSheetDocumentDrop.bind(this);
        this.getLogo = this.getLogo.bind(this);
        this.handleCourseSheetDocumentChange = this.handleCourseSheetDocumentChange.bind(this);
        this.handleCourseSheetTitleChange = this.handleCourseSheetTitleChange.bind(this);
        this.handleCourseSheetDescriptionChange = this.handleCourseSheetDescriptionChange.bind(this);
        this.handleUserEmailChange = this.handleUserEmailChange.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleLogoDrop = this.handleLogoDrop.bind(this);
        this.handleLogoChange = this.handleLogoChange.bind(this);
        this.addCourseSheet = this.addCourseSheet.bind(this);
        this.navigate = this.navigate.bind(this);
        this.refreshPresentation = this.refreshPresentation.bind(this);
        this.refreshCourseSheets = this.refreshCourseSheets.bind(this);
        this.refreshMessages = this.refreshMessages.bind(this);
        this.refreshVisibility = this.refreshVisibility.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
        this.refreshAdmin = this.refreshAdmin.bind(this);
        this.removeCourseSheetFromLobby = this.removeCourseSheetFromLobby.bind(this);
        this.removeMessageFromLobby = this.removeMessageFromLobby.bind(this);
        this.removeUserFromLobby = this.removeUserFromLobby.bind(this);
        this.toggleWriteRights = this.toggleWriteRights.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.updateLobbby = this.updateLobbby.bind(this);
        this.update = this.update.bind(this);
        this.updateHashtagsView = this.updateHashtagsView.bind(this);
        this.updateHashtags = this.updateHashtags.bind(this);
        this.updateText = this.updateText.bind(this);
        this.updateVisibility = this.updateVisibility.bind(this);
    }

    public componentDidMount(): void {
        this.refreshAdmin();
        this.refreshPresentation();
        this.refreshCourseSheets();
        this.refreshMessages();
        this.refreshUsers();
        this.refreshVisibility();
    }

    public checkIfAdmin(data: any): void {
        if (true === data['isAdmin']) {
            this.setState({isAdmin: 'true'});
        } else {
            this.setState({isAdmin: 'false'});
        }
    }

    public fillPresentation(data: any): void {
        if (undefined === data['message']) {
            this.setState({currentLabel: data[0]['label_lobby']});
            this.setState({currentDescription: data[0]['description']});
            this.setState(
                {logoPath: data[0]['logo']},
                this.getLogo
            );
        }
    }

    public fillCourseSheets(data: any): void {
        if (undefined === data['message']) {
            this.setState(
                {courseSheets: data},
                () => this.forceUpdate(() => this.render())
            );
        } else {
            this.setState({courseSheets: []},
                () => this.forceUpdate(() => this.render())
            );
        }
    }

    public fillMessages(data: any): void {
        if (undefined === data['message']) {
            this.setState(
                {messages: data},
                () => this.forceUpdate(() => this.render())
            );
        } else {
            this.setState({messages: []},
                () => this.forceUpdate(() => this.render())
            );
        }
    }

    public fillUsers(data: any): void {
        if (undefined === data['message']) {
            this.setState({users: data});
        } else {
            this.setState({users: []});
        }
    }

    public updateVisibility(data: any): void {
        if (undefined === data['message']) {
            '1' === data[0]['private'] ? this.setState({private: 'true'}) : this.setState({private: 'false'});
        }
    }

    public refreshVisibility(): void {
        new Request('/lobby/visibility/' + this.state.id, this.updateVisibility);
    }

    public handleLabelChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newLabel: event.target.value});
    }

    public handleCourseSheetTitleChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newCourseSheetTitle: event.target.value});
    }

    public handleDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newDescription: event.target.value});
    }

    public handleCourseSheetDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newCourseSheetDescription: event.target.value});
    }

    public handleLogoDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState(
            {newLogo: event.dataTransfer.files[0]},
            this.getLogo
        );
    }

    public handleLogoChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState(
            // @ts-ignore
            {newLogo: event.target.files[0]},
            this.getLogo
        );
    }

    public handleCourseSheetDocumentDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState({newCourseSheetDocument: event.dataTransfer.files[0]});
    }

    public handleCourseSheetDocumentChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({newCourseSheetDocument: event.target.files[0]});
    }

    public update(data: any): void {
        if (undefined !== data['message_label']) {
            this.setState({currentLabel: this.state.newLabel});
        }
        if (undefined !== data['message_description']) {
            this.setState({currentDescription: this.state.newDescription});
        }
        if (undefined !== data['message_logo']) {
            this.setState(
                {logoPath: data['path']},
                this.getLogo
            );
            this.setState(
                {currentLogo: this.state.newLogo},
                this.getLogo
            );
        }
    }

    public navigate(event: React.MouseEvent<HTMLLIElement, MouseEvent>): void {
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
            new Request(
                '/lobby/update/' + this.state.id,
                this.update,
                'POST',
                formData,
                this.state.newLogo.type,
            );
        } else {
            new Request(
                '/lobby/update/' + this.state.id,
                this.update,
                'POST',
                formData,
                '',
            );
        }
    }

    public addCourseSheet(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        let formData = new FormData();
        // @ts-ignore
        formData.append('token', localStorage.getItem('token'));
        if (
            '' !== this.state.newCourseSheetTitle &&
            '' !== this.state.newCourseSheetDescription &&
            null !== this.state.newCourseSheetDocument
        ) {
            formData.append('title', this.state.newCourseSheetTitle);
            formData.append('description', this.state.newCourseSheetDescription);
            formData.append('hashtags', JSON.stringify(this.state.hashtags));
            formData.append('file', this.state.newCourseSheetDocument);
            new Request(
                '/lobby/newCourseSheet/' + this.state.id,
                this.refreshCourseSheets,
                'POST',
                formData,
                this.state.newCourseSheetDocument.type,
            );
        }
    }

    public refreshAdmin(): void {
        new Request('/lobby/checkIfAdmin/' + this.state.id, this.checkIfAdmin);
    }

    public refreshPresentation(): void {
        new Request('/lobby/consult/' + this.state.id, this.fillPresentation);
    }

    public refreshCourseSheets(): void {
        new Request('/lobby/coursesheets/' + this.state.id, this.fillCourseSheets);
    }

    public refreshMessages(): void {
        new Request('/lobby/messages/' + this.state.id, this.fillMessages);
    }

    public refreshUsers(): void {
        new Request('/lobby/users/' + this.state.id, this.fillUsers);
    }

    public fetchCourseSheets(data: any): void {
        if (data['message'].includes('successfully')) {
            this.refreshCourseSheets();
        }
    }

    public fetchMessages(data: any): void {
        if ('success' === data['status']) {
            this.refreshMessages();
        }
    }

    public fetchUsers(data: any): void {
        if (data['message'].includes('successfully')) {
            this.refreshUsers();
        }
    }

    public removeCourseSheetFromLobby(event: React.MouseEvent<HTMLImageElement, MouseEvent>): void {
        let removeButton: any = event.target;
        new Request('/lobby/deleteCourseSheet/' + this.state.id,
            this.fetchCourseSheets,
            'POST',
            {
                id: removeButton.id.split(/-/)[3],
            });
    }

    public removeMessageFromLobby(event: React.MouseEvent<HTMLImageElement, MouseEvent>): void {
        let removeButton: any = event.target;
        new Request('/lobby/deleteMessage/' + this.state.id,
            this.fetchMessages,
            'POST',
            {
                id: removeButton.id.split(/-/)[2],
            });
    }

    public removeUserFromLobby(event: React.MouseEvent<HTMLImageElement, MouseEvent>): void {
        let removeButton: any = event.target;
        new Request('/lobby/removeUser/' + this.state.id,
            this.fetchUsers,
            'POST',
            {
                id: removeButton.id.split(/-/)[2],
            });
    }

    public toggleWriteRights(event: React.ChangeEvent<HTMLInputElement>): void {
        let action: string = true === event.target.checked ?
            'addWriteRight/' :
            'removeWriteRight/';
        new Request(
            '/lobby/' + action + this.state.id,
            this.fetchUsers,
            'POST',
            {
                id: event.target.id.split(/-/)[3],
            },
        );
    }

    public addUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        new Request(
            '/lobby/addUser/' + this.state.id,
            this.refreshUsers,
            'POST',
            {
                email: this.state.newUserEmail,
            },
        );
    }

    public handleUserEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newUserEmail: event.target.value});
    }

    public toggleVisibility(event: ChangeEvent<HTMLInputElement>): void {
        let action: string;

        action = 'true' === this.state.private ?
            'makePublic/' : 'makePrivate/';
        new Request('/lobby/' + action + this.state.id, this.refreshVisibility);
    }

    public emptyInput(isEmpty: boolean): void {
        this.setState({hashtagInputIsNotEmpty: isEmpty});
    }

    public updateHashtagsView(hashtagsView: ReactNode): void {
        this.setState({hashtagsView: hashtagsView});
    }

    public updateHashtags(hashtags: string[]): void {
        console.log(hashtags);
        this.setState({hashtags: hashtags});
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

    public fillLogo(data: Blob): void {
        const img: any = document.getElementById('lobby-logo-' + this.state.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public updateText(): void {

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
                                            <div className={'container-fluid col-12 col-lg-8 offset-lg-2 pl-4'}>
                                                <h2>Informations visibles par les visiteurs</h2>
                                                <Input id={'label-input'}
                                                       inputType={'text'}
                                                       placeholder={'Titre du lobby (n\'en mets pas un trop long)'}
                                                       checked={false}
                                                       className={'mt-5'} onChange={this.handleLabelChange}/>
                                                <div className={'row mt-5'}>
                                                    <InputArea id={'new-description-input'}
                                                               placeholder={'Nouvelle description du lobby\nRacontes-y ce que tu veux, du moment que ça reste dans le thème de ton lobby'}
                                                               className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                                                               textAreaClassName={''}
                                                               rows={5}
                                                               onChange={this.handleDescriptionChange}
                                                               disabled={false}
                                                    />
                                                    <InputArea id={'current-description-input'}
                                                               placeholder={'Description actuelle du lobby\n' + this.state.currentDescription}
                                                               className={'col-lg-6 col-md-6 col-sm-6 col-xs-6'}
                                                               textAreaClassName={''}
                                                               rows={5}
                                                               onChange={this.handleDescriptionChange}
                                                               disabled={true}
                                                    />
                                                </div>
                                                <div className={'row container-fluid p-0 ml-3'}>
                                                    <div className={'col-6 pl-0 pr-5'}>
                                                        <h3 className={'d-none d-lg-block d-md-block d-sm-block mr-4'}>Logo
                                                            actuel</h3>
                                                        <img
                                                            id={'lobby-logo-' + this.state.id}
                                                            className={'lobby-logo mt-3 mt-lg-0 mt-md-0 mt-sm-0 mr-4'}
                                                            src={this.state.logoPath}
                                                            alt={'Lobby logo'}
                                                        />
                                                    </div>
                                                    <div className={'col-5 ml-2 mt-0 ml-lg-4 ml-md-4 ml-sm-4 p-0'}>
                                                        <DropBox id={'input-logo'}
                                                                 className={'mt-lg-4 mt-md-4 mt-sm-5'}
                                                                 labelNotDragged={'Glisse un logo par ici !'}
                                                                 labelDragged={'Logo déposé !'}
                                                                 accept={'image/*'}
                                                                 backgroundClassName={'mt-lg-4 mt-md-4 mt-sm-4 ml-4 ml-lg-5 ml-md-5 ml-sm-4'}
                                                                 handleFileDrop={this.handleLogoDrop}
                                                                 handleFileChange={this.handleLogoChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={'row pr-4 pl-4'}>
                                                    <SubmitButton
                                                        text={'Mettre à jour le lobby'}
                                                        onClick={this.updateLobbby}
                                                        className={'mt-5 col-12'}
                                                        disconnectButton={'plus'}
                                                    />
                                                </div>
                                            </div>
                                        );
                                        break;

                                    case 'course-sheets':
                                        tab = (
                                            <div className={'container-fluid col-12 col-lg-8 pr-4 pr-sm-0'}>
                                                <h2>Fiches de cours présentes dans le lobby</h2>
                                                <div className={'row mt-5 pl-0'}>
                                                    <div
                                                        className={'col-lg-4 col-md-4 col-sm-4 col-xs-12 pl-0 pr-lg-5 pr-md-0 pr-sm-0 pr-xs-0 pl-4 pl-lg-0 pl-md-0 pl-sm-0'}>
                                                        <Input id={'title-input'} inputType={'text'}
                                                               placeholder={'Titre'}
                                                               className={'no-mb'}
                                                               checked={false}
                                                               formGroupClassName={'mb-0 mb-lg-2 mb-md-1 mb-sm-4 pb-2 pb-lg-1 pb-md-0 pr-0 pl-0 pl-lg-4 pl-md-4 pl-sm-4 col-12'}
                                                               onChange={this.handleCourseSheetTitleChange}/>
                                                        <DropBox id={'course-sheet-input'}
                                                                 className={'text-sm-left col-6 offset-3 offset-lg-0 offset-md-0 offset-sm-0 col-lg-12 col-md-12 col-sm-12 mt-3 mt-lg-0 mt-md-0 mt-sm-0 pr-0 pl-0 pl-lg-4 pl-md-4 pl-sm-4'}
                                                                 backgroundClassName={'mt-1'}
                                                                 labelNotDragged={'Glisse une fiche par ici !'}
                                                                 labelDragged={'Fiche déposée !'}
                                                                 accept={'.docx,.pdf,.html,.htm,.odp,txt,md'}
                                                                 handleFileDrop={this.handleCourseSheetDocumentDrop}
                                                                 handleFileChange={this.handleCourseSheetDocumentChange}/>
                                                    </div>
                                                    <div
                                                        className={'col-12 col-lg-8 col-md-8 col-sm-8 mt-4 mt-lg-0 mt-md-0 mt-sm-0 pt-2 pt-lg-0 pt-md-0 pt-sm-0 pr-0 pr-lg-4 pr-md-4 pr-sm-4 pl-4 pl-lg-0 pl-md-5 pl-sm-5'}>
                                                        <div
                                                            className={'row container-fluid course-sheet-textarea-container pr-0 pl-4 pl-lg-0 pl-md-0 pl-sm-0'}>
                                                            <InputArea id={'description-input'}
                                                                       placeholder={'Description de la fiche\nFais-en un bref résumé permettant de savoir à quoi s\'attendre en la lisant'}
                                                                       className={'col-12 pl-0 course-sheet-textarea'}
                                                                       textAreaClassName={'course-sheet-textarea'}
                                                                       rows={6}
                                                                       onChange={this.handleCourseSheetDescriptionChange}
                                                                       disabled={false}
                                                            />
                                                        </div>
                                                        <div
                                                            className={'row container-fluid mb-4 pr-0 pl-4 pl-lg-0 pl-md-0 pl-sm-0'}>
                                                            <div
                                                                className={'col-12 ml-0 pt-1 pr-0 pl-0'}>
                                                                <div className={'form-inline'}>
                                                                    <label id="hashtag-label" htmlFor="add-hashtags">
                                                                        <span
                                                                            id="hashtag-placeholder">{this.state.hashtagInputIsNotEmpty ? 'Entre des hashtags pour cette fiche' : ''}</span>
                                                                    </label>
                                                                    {this.state.hashtagsView}
                                                                    <div
                                                                        className={'col-12 pl-0 pr-0'}>
                                                                        <HashtagInput
                                                                            id={'add-hashtags'}
                                                                            className={'form-control w-100 mt-0 rounded hashtag-input col-12'}
                                                                            type={'text'}
                                                                            baseIndent={-3}
                                                                            onUpdate={this.emptyInput}
                                                                            updateHashtagsView={this.updateHashtagsView}
                                                                            updateHashtags={this.updateHashtags}
                                                                            updateText={this.updateText}
                                                                            hashtagClassName={'hashtag-input-box hashtag'}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={'row container-fluid pr-0 pl-4 pl-lg-0 pl-md-0 pl-sm-0'}>
                                                            <SubmitButton
                                                                text={'Une nouvelle fiche ? Ajoute-la !'}
                                                                onClick={this.addCourseSheet}
                                                                className={'col-sm-12 container-fluid add-course-sheet-button mt-5 mr-0 ml-0 pl-0'}
                                                                disconnectButton={'plus'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'row mt-5 pl-0'}>
                                                    {
                                                        0 !== this.state.courseSheets.length ?
                                                            <CourseSheets
                                                                id={this.state.id.toString()}
                                                                courseSheets={this.state.courseSheets}
                                                                className={'col-lg-12 col-sm-12 mt-lg-3 pl-4'}
                                                                activeRemoveButton={true}
                                                                removableHashtags={true}
                                                                delete={this.removeCourseSheetFromLobby}
                                                            />
                                                            :
                                                            <div className={'row container-fluid mt-5'}>
                                                                <div className={'col-12 text-left'}>
                                                                    <p>Il n'y a pas de fiches de cours pour
                                                                        l'instant</p>
                                                                </div>
                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                        );
                                        break;

                                    case 'rights':
                                        tab = (
                                            <div className={'container-fluid  col-lg-8 col-md-12 col-sm-12 col-xs-12'}>
                                                <h2>Utilisateurs autorisés à consulter le lobby</h2>
                                                <div className={'row'}>
                                                    <Users
                                                        id={this.state.id.toString()}
                                                        users={this.state.users}
                                                        className={'col-lg-12 col-sm-12 mt-lg-3 mt-md-0 mt-sm-0 mt-xs-0'}
                                                        toggleWriteRights={this.toggleWriteRights}
                                                        delete={this.removeUserFromLobby}
                                                    />
                                                </div>
                                                <div
                                                    className={'col-12 col-lg-10 col-md-10 offset-lg-1 offset-md-1 mt-5'}>
                                                    <div className={'row'}>
                                                        <div className={'col-12 pl-0 add-usr-button'}>
                                                            <Input
                                                                id={'friend-input'}
                                                                inputType={'email'}
                                                                placeholder={'Un ami veut voir ton lobby ? Alors saisis son adresse email ici'}
                                                                checked={false}
                                                                className={'add-usr-input'}
                                                                onChange={this.handleUserEmailChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={'row'}>
                                                        <div className={'col-12 pl-0 '}>
                                                            <SubmitButton
                                                                text={'Ca y est ? Alors c\'est parti, ajoute-le !'}
                                                                onClick={this.addUser}
                                                                className={'mt-0 col-12 add-usr-button'}
                                                                disconnectButton={'plus'}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'row col-12 pt-5 pr-0'}>
                                                    <div className={'col-1 pt-2 pl-0 pr-0 checkbox-container'}>
                                                        <Input
                                                            id={'visibility-input'}
                                                            inputType={'checkbox'}
                                                            checked={'true' === this.state.private ? true : false}
                                                            placeholder={''}
                                                            className={'user-rights-checkbox'}
                                                            onChange={this.toggleVisibility}
                                                        />
                                                    </div>
                                                    <h4
                                                        className={'col-11 pt-0 pt-lg-0 pt-md-0 pt-sm-0 pr-0 pl-2 pl-lg-0 pl-md-0 pl-sm-0 text-left lobby-write-right-label'}
                                                    >
                                                        Lobby privé (seules les personnes autorisées pourront le
                                                        consulter
                                                    </h4>
                                                </div>
                                            </div>
                                        );
                                        break;

                                    case 'messages':
                                        tab = (
                                            <div className={'container-fluid col-12 col-lg-8 pr-0'}>
                                                <h2>Messages postés dans le lobby</h2>
                                                <div className={'row mt-5 pl-2'}>
                                                    {
                                                        0 !== this.state.messages.length
                                                            ? <Messages
                                                                id={this.state.id.toString()}
                                                                messages={this.state.messages}
                                                                className={'col-lg-12 col-sm-12 mt-lg-3 pl-4'}
                                                                activeRemoveButton={true}
                                                                delete={this.removeMessageFromLobby}
                                                            />
                                                            : <div className={'row container-fluid mt-5'}>
                                                                <div className={'col-12 text-left'}>
                                                                    <p>Il n'y a pas de fiches de cours pour l'instant</p>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        );
                                        break;

                                    default:
                                        tab = <h2>Informations visibles par les visiteurs</h2>
                                        break;
                                }
                                return (
                                    <section className={'content row container-fluid pl-0 pr-0'}>
                                        <div className={'admin-header'}>
                                            <h1 className={'lobby-title'}>{this.state.currentLabel}</h1>
                                            <nav>
                                                <ul className="nav nav-tabs custom-tab-nav">
                                                    <li className="nav-item" onClick={this.navigate}>
                                                        <a className="nav-link custom-tab-active custom-tab"
                                                           href={'presentation'}>Description</a>
                                                    </li>
                                                    <li className="nav-item" onClick={this.navigate}>
                                                        <a className="nav-link custom-tab"
                                                           href={'course-sheets'}>Fiches</a>
                                                    </li>
                                                    <li className="nav-item" onClick={this.navigate}>
                                                        <a className="nav-link custom-tab"
                                                           href={'rights'}>Droits</a>
                                                    </li>
                                                    <li className="nav-item" onClick={this.navigate}>
                                                        <a className="nav-link custom-tab"
                                                           href={'messages'}>Messages</a>
                                                    </li>
                                                </ul>
                                            </nav>
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

export default Admin;
