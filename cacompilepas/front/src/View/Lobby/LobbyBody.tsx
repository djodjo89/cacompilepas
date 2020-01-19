import React, {ChangeEvent, ReactNode} from "react";
import CourseSheets from "../CourseSheet/CourseSheets";
import Messages from "../Message/Messages";
import WriteMessageZone from "../Message/WriteMessageZone";
import LobbyDivider from "./LobbyDivider";
import SubmitButton from "../General/Inputs/SubmitButton";
import Input from "../General/Inputs/Input";
import DropBox from "../General/Inputs/DropBox";
import InputArea from "../General/Inputs/InputArea";
import HashtagInput from "../Hashtag/HashtagInput";
import Request from "../../API/Request";
import swal from "sweetalert";

interface LobbyBodyProps {
    id: string,
    labelLobby: string,
    courseSheets: [],
    messages: any,
    sendMessage: (event: React.MouseEvent<HTMLButtonElement>) => void,
    updateMessage: (content: string) => void,
}

interface LobbyBodyState {
    newCourseSheetTitle: string,
    newCourseSheetDescription: string,
    newCourseSheetDocument: File | null,
    hashtagInputIsNotEmpty: boolean,
    hashtagsView: ReactNode,
    hashtags: string[],
    courseSheets: [],
}

class LobbyBody extends React.Component<LobbyBodyProps, LobbyBodyState> {

    public constructor(props: LobbyBodyProps) {
        super(props);

        this.state = {
            newCourseSheetTitle: '',
            newCourseSheetDescription: '',
            newCourseSheetDocument: null,
            hashtagInputIsNotEmpty: false,
            hashtagsView: <div></div>,
            hashtags: [],
            courseSheets: [],
        }

        this.handleCourseSheetDescriptionChange = this.handleCourseSheetDescriptionChange.bind(this);
        this.handleCourseSheetTitleChange = this.handleCourseSheetTitleChange.bind(this);
        this.handleCourseSheetDocumentDrop = this.handleCourseSheetDocumentDrop.bind(this);
        this.handleCourseSheetDocumentChange = this.handleCourseSheetDocumentChange.bind(this);
        this.emptyInput = this.emptyInput.bind(this);
        this.updateHashtagsView = this.updateHashtagsView.bind(this);
        this.updateHashtags = this.updateHashtags.bind(this);
        this.updateText = this.updateText.bind(this);
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.refreshCourseSheets = this.refreshCourseSheets.bind(this);
        this.addCourseSheet = this.addCourseSheet.bind(this);
    }


    public handleCourseSheetTitleChange(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({newCourseSheetTitle: event.target.value});
    }

    public handleCourseSheetDescriptionChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({newCourseSheetDescription: event.target.value});
    }

    public handleCourseSheetDocumentDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
        this.setState({newCourseSheetDocument: event.dataTransfer.files[0]});
    }

    public handleCourseSheetDocumentChange(event: ChangeEvent<HTMLInputElement>): void {
        // @ts-ignore
        this.setState({newCourseSheetDocument: event.target.files[0]});
    }

    public emptyInput(isEmpty: boolean): void {
        this.setState({hashtagInputIsNotEmpty: isEmpty});
    }

    public updateHashtagsView(hashtagsView: ReactNode): void {
        this.setState({hashtagsView: hashtagsView});
    }

    public updateHashtags(hashtags: string[]): void {
        this.setState({hashtags: hashtags});
    }

    public updateText(): void {

    }

    public fillCourseSheets(payload: any): void {
        this.setState({courseSheets: payload['success'] ? payload : []},
            () => this.forceUpdate(() => this.render())
        );
    }

    public refreshCourseSheets(): void {
        new Request(
            '/course_sheet/course_sheets',
            this.fillCourseSheets,
            'POST',
            {
                'lobby_id': this.props.id,
            }
        );
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
            formData.append('lobby_id', '' + this.props.id);
            new Request(
                '/course_sheet/add_course_sheet',
                this.refreshCourseSheets,
                'POST',
                formData,
                this.state.newCourseSheetDocument.type,
            );
            swal({
                title: 'Ca y est !',
                text: 'La fiche a bien été ajoutée !',
                buttons: [false],
                icon: 'success',
                timer: 3000,
            });
        } else {
            swal({
                title: 'Mince !',
                text: 'Il y a eu un problème, la fiche n\'a pas pu être ajoutée, ' +
                    'vérifie que tu as bien renseigné tous les champs.',
                icon: 'warning',
            });
        }
    }

    public render(): ReactNode {
        return (
            <div className={'col-12 pl-0'}>
                <div className={'row pl-4 pl-md-1 pl-sm-1'}>
                    <div className={'col-lg-6 col-md-12 col-sm-12 col-xs-12 container-fluid pl-0 pl-lg-4 pl-md-4 pl-sm-4 pr-0'}>
                        {
                            // @ts-ignore
                            this.props.courseSheets['success'] ?
                                <CourseSheets
                                    id={this.props.id}
                                    courseSheets={this.props.courseSheets}
                                    className={'mt-lg-3'}
                                    activeRemoveButton={false}
                                    removableHashtags={false}
                                    delete={undefined}
                                />
                                :
                                <div className={'row mt-5'}>
                                    <div className={'col-12 text-left'}>
                                        <p className={'no-course-sheet-message'}>Il n'y a pas de fiches de cours pour l'instant</p>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className={'col-lg-6 col-md-12 col-sm-12 col-xs-12 container-fluid pl-0'}>
                        <div className={'row col-12 mt-lg-0 mt-md-0 mt-sm-5 mt-xs-5 ml-lg-4 ml-md-4 ml-sm-4 pl-0 ml-0'}>
                            <div className={'row container-fluid pr-0'}>

                                <LobbyDivider
                                    dividerClassName={'hidden-lg hidden-md pl-0 ml-0 mt-lg-0'}
                                    containerClassName={'hidden-lg hidden-md pl-0 mt-lg-0 ml-0'}
                                />
                            </div>
                        </div>
                        {
                            // @ts-ignore
                            this.props.messages['success'] ?
                                <div className={'row'}>
                                    <Messages
                                        id={this.props.id}
                                        messages={this.props.messages}
                                        className={'mt-lg-5 mt-md-0 mt-sm-4 mt-xs-4 ml-0 ml-lg-4 ml-md-4 ml-sm-4 pt-lg-2 pt-md-0 pt-sm-2 pt-xs-2 pl-0'}
                                    />
                                </div>
                                :
                                <div className={'row mt-5 mb-5 ml-0'}>
                                    <div className={'col-12 text-left pl-0 pl-lg-2 pl-md-4 pl-sm-4'}>
                                        <p className={'no-messages-message'}>Il n'y a pas de messages pour l'instant</p>
                                    </div>
                                </div>
                        }
                        <div className={'row'}>
                            <WriteMessageZone
                                labelLobby={this.props.labelLobby}
                                send={this.props.sendMessage}
                                update={this.props.updateMessage}
                            />
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12 row mt-5'}>
                        <div
                            className={'col-lg-4 col-md-4 col-sm-4 col-xs-12 pl-0 pr-lg-5 pr-md-0 pr-sm-0 pr-xs-0 pl-4 pl-lg-0 pl-md-0 pl-sm-0'}>
                            <Input id={'title-input'} inputType={'text'}
                                   placeholder={'Titre'}
                                   className={'no-mb'}
                                   checked={false}
                                   formGroupClassName={'mb-0 mb-lg-2 mb-md-1 mb-sm-0 pb-2 pb-lg-1 pb-md-0 pr-0 pl-0 pl-lg-4 pl-md-4 pl-sm-4 col-12'}
                                   onChange={this.handleCourseSheetTitleChange}/>
                            <DropBox id={'course-sheet-input'}
                                     className={'text-sm-left col-6 offset-3 offset-lg-0 offset-md-0 offset-sm-0 col-lg-12 col-md-12 col-sm-12 mt-3 mt-lg-0 mt-md-0 mt-sm-0 pt-3 pr-0 pl-0 pl-lg-4 pl-md-4 pl-sm-4'}
                                     labelClassName={'lobby-file-upload'}
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
                </div>
            </div>
        )
    }
}

export default LobbyBody;
