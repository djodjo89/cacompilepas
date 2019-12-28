import React, {ChangeEvent, ReactNode} from 'react';
import styled from 'styled-components';
import {ReactComponent as DropBoxLogo} from "../../img/usable-image-icon.svg";

const Heading = styled.p<{ active: boolean }>`
  color: #5757e7;
  text-align: center;
`;

class DropBoxBackground extends React.Component<{label: string, className: string}, any> {
    public render(): ReactNode {
        return (
            <div
                style={{
                    backgroundColor: '#ffffff',
                    width: '220px',
                    height: '145px',
                }}
                className={'rounded pt-4 ' + this.props.className}
            >
                {this.props.children}
                <Heading active={false}>
                    {this.props.label}
                </Heading>
            </div>
        );
    }
}

interface DropBoxProps {
    id: string,
    className: string,
    label: string,
    accept: string,
    backgroundClassName: string,
    handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => void,
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

interface DropBoxState {
    draggingState: string,
    dragged: boolean,
    label: string
}

class DropBox extends React.Component<DropBoxProps, DropBoxState> {
    private file: File | null;

    constructor(props: any) {
        super(props);
        this.file = null;
        this.state = {
            draggingState: '',
            dragged: false,
            label: this.props.label,
        }
        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    public handleDragOver(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
    }

    public handleDrop(event: React.DragEvent<HTMLDivElement>): void {
        event.preventDefault();
    }

    public render(): ReactNode {
        return (
            <div
                className={this.props.className}
                onDragOver={this.handleDragOver}
                onDrop={this.props.handleFileDrop}
                style={{
                    opacity: this.state.draggingState === 'dragging' ? 0.5 : 1,
                    transform: this.state.draggingState === 'dragging' ? 'rotate(-2deg) translateY(-10px)' : 'rotate(0)',
                }}
            >
                <label>
                    <DropBoxBackground
                        label={this.state.label}
                        className={this.props.backgroundClassName}
                    >
                        <input
                            type={'file'}
                            id={this.props.id}
                            onChange={this.props.handleFileChange}
                            hidden
                            accept={this.props.accept}/>
                        <div
                            className={'rounded-1'}
                            style={{
                                padding: '10px',
                                margin: '10px',
                                borderRadius: '5px',
                                backgroundColor: '#e6e6e6',
                                width: '40%',
                                height: '50%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        >
                            <DropBoxLogo/>
                        </div>
                    </DropBoxBackground>
                </label>
            </div>
        );
    }
}

export default DropBox;