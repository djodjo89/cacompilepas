import React, {ChangeEvent, ReactNode} from 'react';
import styled from 'styled-components';
import '../../../css/DropBox.css';
import {ReactComponent as DropBoxLogo} from '../../../img/usable-image-icon.svg';
import pdfIcon from '../../../img/pdf.svg';
import {pdfjs, Document, Page} from 'react-pdf';

const Heading = styled.p<{ active: boolean }>`
  color: #5757e7;
  text-align: center;
`;

interface DropBoxBackgroundProps {
    label: string,
    className: string,
    dragged: boolean,
}
// 192.168.43.91

class DropBoxBackground extends React.Component<DropBoxBackgroundProps, any> {
    public render(): ReactNode {
        return (
            <div
                style={{
                    backgroundColor: this.props.dragged ? 'transparent' : '#ffffff'
                }}
                className={(this.props.dragged ? ' mt-0 mt-lg-2 ' : 'pt-4 pb-4 ') + 'rounded pb-lg-2 pb-md-2 pb-sm-2 file-upload-content ' + this.props.className}
            >
                {this.props.children}
                <div className={'d-none d-lg-block d-md-block d-sm-block'}>
                    <Heading active={false}>
                        {this.props.label}
                    </Heading>
                </div>
            </div>
        );
    }
}

interface DropBoxProps {
    id: string,
    className: string,
    labelNotDragged: string,
    labelDragged: string,
    accept: string,
    backgroundClassName: string,
    labelClassName?: string,
    handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => void,
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

interface DropBoxState {
    draggingState: string,
    dragged: boolean,
    label: string,
    src: string,
    file: File | null,
}

class DropBox extends React.Component<DropBoxProps, DropBoxState> {
    constructor(props: DropBoxProps) {
        super(props);
        this.state = {
            draggingState: '',
            dragged: false,
            label: this.props.labelNotDragged,
            src: '',
            file: null,
        }
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleDragEnter = this.handleDragEnter.bind(this);
        this.handleDragExit = this.handleDragExit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.updateFilePreview = this.updateFilePreview.bind(this);
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
        this.renderLogo = this.renderLogo.bind(this);
    }

    public handleMouseDown(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({label: this.props.labelNotDragged});
        this.setState({draggingState: 'dragging'});
    }

    public handleMouseOut(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({draggingState: 'not dragging'});
    }

    public handleMouseUp(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({draggingState: 'not dragging'});
    }

    public handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
    }

    public handleFileDrop(event: React.DragEvent<HTMLDivElement>): void {
        this.props.handleFileDrop(event);
        this.setState({dragged: true});
        this.setState({label: this.props.labelDragged});
        this.setState({draggingState: 'not dragging'});
        this.updateFilePreview(event.dataTransfer.files[0]);
    }

    public handleDragEnter(event: React.DragEvent<HTMLDivElement>): void {
        this.setState({label: this.props.labelNotDragged});
        this.setState({draggingState: 'dragging'});
    }

    public handleDragExit(event: React.DragEvent<HTMLDivElement>): void {
        if (this.state.dragged) {
            this.setState({label: this.props.labelDragged});
        } else {
            this.setState({label: this.props.labelNotDragged});
        }
        this.setState({draggingState: 'not dragging'});
    }

    public handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.handleFileChange(event);
        this.setState({dragged: true});
        this.setState({label: this.props.labelDragged});
        this.setState({draggingState: 'not dragging'});
        // @ts-ignore
        this.updateFilePreview(event.target.files[0]);
    }

    public updateFilePreview(file: File): void {
        let reader = new FileReader();
        this.setState({file: file});

        if (file.type === 'application/pdf') {
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        } else {
            reader.addEventListener('load', () => {
                // @ts-ignore
                this.setState({src: reader.result});
            });

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }

    public onDocumentLoadSuccess(): void {
    }

    public renderLogo(): ReactNode {
        if (this.state.dragged && null !== this.state.file) {
            // @ts-ignore
            if (this.state.file.type.includes('image')) {
                return (
                    <img
                        id={'dragged-file'}
                        src={this.state.src}
                        alt={'Fichier déposé'}
                        className={'dragged-file'}
                    />
                );
            } else {
                return (
                    <div className={'pdf-container'}>
                        <Document
                            file={this.state.file}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            noData={<h4>Glisse un fichier</h4>}
                        >
                            <Page height={100} scale={1} pageNumber={1}/>
                        </Document>
                    </div>
                );
            }
        } else {
            if (this.props.accept.includes('pdf')) {
                return (
                    <div
                        className={'pdf-file-icon-container pb-3'}
                        >
                        <img
                            src={pdfIcon}
                            alt={'Icône de PDF'}
                            />
                    </div>
                )
            } else {
                return (
                    <div
                        className={'rounded-1 not-dragged-file'}
                    >
                        <DropBoxLogo/>
                    </div>
                );
            }
        }
    }

    public render(): ReactNode {
        return (
            <div
                className={this.props.className}
                onDragOver={this.handleDragOver}
                onDrop={this.handleFileDrop}
                onDragEnter={this.handleDragEnter}
                onDragExit={this.handleDragExit}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseOut={this.handleMouseOut}
                style={{
                    opacity: this.state.draggingState === 'dragging' ? 0.5 : 1,
                    transform: this.state.draggingState === 'dragging' ? 'rotate(-2deg) translateY(-10px)' : 'rotate(0)',
                }}
            >
                <label className={'file-upload ' + this.props.labelClassName}>
                    <DropBoxBackground
                        label={this.state.label}
                        className={this.props.backgroundClassName}
                        dragged={this.state.dragged}
                    >
                        <input
                            type={'file'}
                            id={this.props.id}
                            onChange={this.handleFileChange}
                            hidden
                            accept={this.props.accept}/>
                        {this.renderLogo()}
                    </DropBoxBackground>
                </label>
            </div>);
    }
}

export default DropBox;