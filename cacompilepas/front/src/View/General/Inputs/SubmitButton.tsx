import React, {ReactNode} from "react";
import plusIcon from '../../../img/plus-icon.png';
import disconnectIcon from '../../../img/logout-icon.png';

interface SubmitButtonProps {
    text: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    className: string,
    disconnectButton?: string,
}

class SubmitButton extends React.Component<SubmitButtonProps, any> {
    public render(): ReactNode {
        return (
            <button
                className={'btn btn-default btn-transparent rounded ' + this.props.className}
                onClick={this.props.onClick}
            >
                {(() => {
                    if (undefined !== this.props.disconnectButton) {
                        return <img
                            className={
                                (() => {
                                    if ('disconnect' === this.props.disconnectButton) {
                                        return 'disconnect-icon';
                                    } else if ('plus' === this.props.disconnectButton) {
                                        return 'plus-icon';
                                    }
                                })()
                            }
                            src={
                                (() => {
                                    if ('disconnect' === this.props.disconnectButton) {
                                        return disconnectIcon;
                                    } else if ('plus' === this.props.disconnectButton) {
                                        return plusIcon;
                                    }
                                })()
                            }
                            alt={'Ajouter'}
                        />;
                    }
                })()}

                    {this.props.text}
            </button>
        )
    }
}

export default SubmitButton;
