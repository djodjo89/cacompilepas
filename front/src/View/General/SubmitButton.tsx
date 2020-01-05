import React, {ReactNode} from "react";
import plusIcon from '../../img/plus-icon.png';
import disconnectIcon from '../../img/logout-icon.png';

interface SubmitButtonProps {
    text: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    className: string,
    disconnectButton: boolean,
}

class SubmitButton extends React.Component<SubmitButtonProps, any> {
    public render(): ReactNode {
        return (
            <button
                className={'btn btn-default btn-transparent rounded-1 ' + this.props.className}
                onClick={this.props.onClick}
            >
                <img
                    className={this.props.disconnectButton ? 'disconnect-icon' : 'plus-icon'}
                    src={
                        (() => this.props.disconnectButton ? disconnectIcon : plusIcon)()
                    }
                    alt={'Plus Icon'}
                />
                    {this.props.text}
            </button>
        )
    }
}

export default SubmitButton;
