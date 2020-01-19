import React, {ReactNode} from 'react';
import {pdfjs, Document, Page} from 'react-pdf';
import Request from '../../API/Request';
import Hashtag from '../Hashtag/Hashtag';
import {display} from '../../Model/Month';
import '../../css/CourseSheet.css';
import RemoveButton from "../General/Inputs/RemoveButton";

interface CourseSheetProps {
    id: string,
    idLobby: string,
    title: string,
    pseudo: string,
    publication_date: string,
    link: string,
    description: string,
    activeRemoveButton: boolean,
    removableHashtags: boolean,
    delete: ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void) | undefined,
}

interface CourseSheetState {
    currentHashtagIndex: number,
    hashtags: string[],
    file: File | null,
    previewSrc: string,
}

class CourseSheet extends React.Component<CourseSheetProps, CourseSheetState> {

    public constructor(props: CourseSheetProps) {
        super(props);
        this.state = {
            currentHashtagIndex: -1,
            hashtags: [],
            file: null,
            previewSrc: '',
        }
        this.updateWidth = this.updateWidth.bind(this);
        this.remove = this.remove.bind(this);
        this.fillHashtags = this.fillHashtags.bind(this);
        this.fetchHashtags = this.fetchHashtags.bind(this);
        this.refreshPreview = this.refreshPreview.bind(this);
        this.fillPreview = this.fillPreview.bind(this);
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    }

    public componentDidMount(): void {
        this.refreshPreview();
        this.fetchHashtags();
    }

    public refreshPreview(): void {
        new Request(
            '/course_sheet/course_sheet/' + this.props.id,
            this.fillPreview,
            'POST',
            {
                path: this.props.link,
            },
            'json',
            'blob',
        );
    }

    public fillPreview(payload: any): void {
        this.setState(
            {file: payload},
            () => pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
        );
    }

    public onDocumentLoadSuccess(): void {

    }

    public fillHashtags(payload: any): void {
        this.setState(
            {hashtags: payload.map((hashtag: any) => hashtag[0])},
            () => this.forceUpdate(() => this.render()));
    }

    public fetchHashtags(): void {
        new Request(
            '/course_sheet/get_hashtags/' + this.props.id,
            this.fillHashtags,
        )
    }

    public updateWidth(): void {

    }

    public remove(event: React.MouseEvent<HTMLOrSVGElement>): void {
        let content: string;
        let target: any = event.target;
        if (undefined === target.parentElement.firstElementChild.innerText) {
            content = target.parentElement.parentElement.parentElement.firstElementChild.innerText;
            if ('' === content) {
                content = target.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText;
                if ('' === content) {
                    content = target.parentElement.parentElement.firstElementChild.innerText;
                }
            }
        } else {
            content = target.parentElement.firstElementChild.innerText;
        }
        content = content.substr(1, content.length - 1);
        this.setState(
            {currentHashtagIndex: this.state.hashtags.indexOf(content)},
            () => {
                if (-1 !== this.state.currentHashtagIndex) {
                    new Request(
                        '/course_sheet/remove_hashtags/' + this.props.id,
                        this.fetchHashtags,
                        'POST',
                        {
                            hashtag: content,
                        },
                    )
                }
            });
    }

    public renderHashtags(): ReactNode {
        let res: ReactNode[] = [];

        for (let hashtag of this.state.hashtags) {
            res.push(
                <Hashtag
                    key={hashtag}
                    text={hashtag}
                    updateWidth={this.updateWidth}
                    isRemovable={this.props.removableHashtags}
                    remove={this.remove}
                    className={''}
                />
            )
        }

        return <div style={{
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'center',
        }}>{res}</div>;
    }

    public render(): ReactNode {
        return (
            <div id={'course-sheet-' + this.props.id}
                 className={'course-sheet row mt-5 col-lg-12 col-md-12 col-sm-12 col-xs-12 pr-0'}>
                <div
                    className={'col-lg-2 col-md-2 col-sm-2 d-none d-lg-block d-md-block d-sm-block mt-lg-2 mt-md-2 mt-1 mt-lg-0 mt-md-0 mr-lg-5 pl-0 pr-0'}>
                    <div className={'mt-lg-0 mt-md-1 mt-sm-1'}>
                        <a href={'/coursesheet/' + this.props.idLobby + '/' + this.props.title + '/' + this.props.link}>
                            <Document
                                file={this.state.file}
                                onLoadSuccess={this.onDocumentLoadSuccess}
                                noData={<h4>Récupération de la fiche...</h4>}
                            >
                                <Page height={155} scale={1} pageNumber={1}/>
                            </Document>
                        </a>
                    </div>
                </div>
                <div className={'col-lg-9 col-md-10 col-sm-10 col-xs-12 pr-sm-0 pr-0 pl-0 pl-lg-0 pl-md-0 pl-sm-5'}>
                    <div className={'container-fluid row pl-0 pr-0'}>
                        <h3 className={(this.props.activeRemoveButton ? 'col-11 ' : 'col-12 ') + 'course-sheet-label text-left mt-0 pr-0'}>{display(this.props.title + ', ', this.props.publication_date)}</h3>
                        {this.props.activeRemoveButton
                            ? <RemoveButton
                                id={'course-sheet-remove-' + this.props.id}
                                imgClassName={'ml-5 mr-0'}
                                delete={this.props.delete}
                            />
                            : <div></div>}
                    </div>
                    <div className={'col-12 mb-2 pl-0 text-left float-none'}>
                        {this.renderHashtags()}
                    </div>
                    <div className={'course-sheet-presentation ml-0'}>
                        <p className={'course-sheet-description'}>{this.props.description}</p>
                        <footer className={'container-fluid row'}>
                            <a
                                href={'/course-sheet/' + this.props.id + '/' + this.props.title + '/' + this.props.link}
                                className={'course-sheet-link col-5 text-left mt-2 p-0 d-block'}
                            >
                                Lien vers la fiche
                            </a>
                            <h4 className={'col-7 text-right p-0'}>{this.props.pseudo}</h4>
                        </footer>
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseSheet;
