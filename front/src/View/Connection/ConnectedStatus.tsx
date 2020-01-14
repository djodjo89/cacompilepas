import React, {ReactNode} from "react";
import SubmitButton from "../General/SubmitButton";

interface ConnectedStatusProps {
    connectedDivClassName: string
    connectedButtonClassName: string,
    notConnectedClassName: string,
    displayMessageClassName: string,
    display: string
    status: boolean,
    disconnect: any,
}

class ConnectedStatus extends React.Component<ConnectedStatusProps, any> {
    public render(): ReactNode {
        if (this.props.status) {
            return (
                <div className={'container-fluid ' + this.props.connectedDivClassName + ' ' + this.props.display}>
                    <div className={'row'}>
                        <SubmitButton
                            text={''}
                            onClick={this.props.disconnect}
                            className={'disconnect-button ' + this.props.connectedButtonClassName + ' container-fluid pb-0 ' + this.props.display}
                            disconnectButton={'disconnect'}
                        />
                    </div>
                    <div className={'row ' + this.props.displayMessageClassName}>
                        Connecté
                    </div>
                </div>
            );
        } else {
            return (<div className={'pt-lg-0 pt-md-0 pt-sm-3'}>
                <a id={'user'} href={'/connexion/login'}
                   className={'connect-button ' + this.props.notConnectedClassName + ' ' + this.props.display}
                >
                            <span
                                className={'glyphicon glyphicon-user mt-sm-1'}
                            >
                            </span>
                </a>
            </div>);
        }
    }
}

export default ConnectedStatus;
