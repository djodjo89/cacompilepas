import React, {ReactNode} from 'react';
import Request from '../../API/Request';
import {Document, Page, pdfjs} from 'react-pdf';

interface CourseSheetPageProps {
    location: any,
}

interface CourseSheetPageState {
    file: File | null,
    numPages: number,
}

class CourseSheetPage extends React.Component<CourseSheetPageProps, CourseSheetPageState> {

    public constructor(props: CourseSheetPageProps) {
        super(props);
        this.state = {
            file: null,
            numPages: 0,
        }
        this.getFile = this.getFile.bind(this);
        this.openFile = this.openFile.bind(this);
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    }

    public componentDidMount(): void {
        this.getFile();
    }

    public getFile(): void {
        new Request(
            '/course_sheet/course_sheet/' + this.props.location.pathname.split(/\//)[2],
            this.openFile,
            'POST',
            {
                path: this.props.location.pathname.split(/\//)[4]
            },
            'json',
            'blob',
        );
    }

    public openFile(payload: any): void {
        this.setState(
            {file: payload},
            () => pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
        );
    }

    public onDocumentLoadSuccess(document: any): void {
        this.setState({numPages: document._pdfInfo.numPages});
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid'}>
                <div className={'row container-fluid'}>
                    <div className={'col-12'}>
                        <h1>{this.props.location.pathname.split(/\//)[3]}</h1>
                    </div>
                </div>
                <div className={'row container-fluid mt-5'}>
                    <div className={'col-12 pl-0 pl-sm-5'}>
                        <Document
                            file={this.state.file}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            noData={<h4>Chargement...</h4>}
                        >
                            {
                                Array.from(
                                    new Array(this.state.numPages),
                                    (el, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                        />
                                    ),
                                )
                            }
                        </Document>
                    </div>
                </div>

            </div>
        );
    }
}

export default CourseSheetPage;
