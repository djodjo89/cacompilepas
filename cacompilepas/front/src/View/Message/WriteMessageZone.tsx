import React, {ReactNode} from "react";
import '../../css/Message.css';
import Input from "../General/Inputs/Input";
import SubmitButton from "../General/Inputs/SubmitButton";

interface WriteMessageZoneProps {
    labelLobby: string,
    update: (content: string) => void,
    send: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

class WriteMessageZone extends React.Component<WriteMessageZoneProps, any> {

    public constructor(props: WriteMessageZoneProps) {
        super(props);

        this.updateContent = this.updateContent.bind(this);
        this.adjustHeight = this.adjustHeight.bind(this);
    }

    public updateContent(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.props.update(event.target.value);
    }

    public adjustHeight(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
        let e: any = event.target;
        if (undefined !== e.style) {
            e.style.height = '1px';
            e.style.height = (e.scrollHeight) + 'px';
            window.scroll(e.getBoundingClientRect().x, e.getBoundingClientRect().bottom);
        }
    }

    public render(): ReactNode {
        return (
            <div className={'col-lg-12 mt-3 ml-lg-0 ml-lg-2 ml-sm-3 pl-lg-4 text-left'}>
                <div className={'form-group'}>
                    <textarea
                        id={'message-input'}
                        placeholder={'Ecrire un message sur #' + this.props.labelLobby}
                        className={'form-control mt-0 rounded text-left mb-4'}
                        onChange={this.updateContent}
                        rows={1}
                        onKeyUp={this.adjustHeight}
                    >
                    </textarea>
                    <SubmitButton
                        text={'Envoyer'}
                        onClick={this.props.send}
                        className={'p-3'}
                    />
                </div>
            </div>
        )
    }
}

export default WriteMessageZone;
