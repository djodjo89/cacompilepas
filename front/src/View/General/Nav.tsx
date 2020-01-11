import React, {ReactNode} from 'react';
import SearchBar from './SearchBar';
import SubmitButton from "./SubmitButton";
import '../../css/Nav.css';
import Svg from '../Assets/Svg';
import Request from "../../API/Request";
import ConnectedStatus from "../Connection/ConnectedStatus";

class Nav extends React.Component<any, { tokenExists: boolean }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            tokenExists: false,
        }
        this.disconnect = this.disconnect.bind(this);
        this.checkIfAlreadyConnected = this.checkIfAlreadyConnected.bind(this);

    }

    // Check if token is still valid
    public componentDidMount(): void {
        if (undefined !== localStorage.getItem('token') && '' !== localStorage.getItem('token')) {
            new Request(
                '/connection/verification',
                this.checkIfAlreadyConnected,
            );
        }
    }

    public checkIfAlreadyConnected(data: any): void {
        this.setState(
            {tokenExists: data['token_exists']},
            () => {
                if (false === this.state.tokenExists) {
                    localStorage.setItem('token', '');
                }
            }
        );
    }

    public disconnect(): void {
        localStorage.setItem('token', '');
        // @ts-ignore
        document.location = '/';
    }

    public render(): ReactNode {
        return (
            <nav className={'row mt-3'}>
                <div className={'col-lg-2 col-md-3 col-sm-4 col-xs-12 mt-0 mt-lg-0 mt-md-1 mt-sm-1 mr-0 mr-lg-0 mr-sm-0 ml-3 ml-lg-0 ml-md-0 ml-sm-0 pr-0 pl-4 pl-lg-4 pl-md-4 pl-sm-4 text-left'}>
                    <a href={'/'} className={'row container-fluid col-xs-11 ml-lg-1 ml-md-1 ml-sm-1 ml-xs-0 pr-0 pl-lg-2 pl-md-2 pl-sm-2 pl-0'}>
                        <Svg
                            className={'col-lg-3 col-md-3 col-sm-3 col-xs-1 mr-3 mr-lg-0 mr-md-0 mr-sm-0 pl-0'}
                        />
                        <div
                            className={'col-lg-9 col-md-9 col-sm-9 col-xs-9 mt-3 pl-0'}
                        >
                            <div
                                className={'mt-1'}
                            >
                                <p>
                                    caCompilePas
                                </p>
                            </div>
                        </div>
                    </a>
                    <ConnectedStatus
                        connectedDivClassName={'col-xs-1 mb-2'}
                        connectedButtonClassName={'row mt-0 mt-1 pl-5 disconnect-button'}
                        notConnectedClassName={'row mt-3 ml-5 pl-4'}
                        displayMessageClassName={'hidden'}
                        display={'d-lg-none d-md-none d-sm-none'}
                        disconnect={this.disconnect}
                        status={this.state.tokenExists}
                    />
                </div>
                <div className={'ml-lg-3 pl-lg-1'}></div>
                <SearchBar/>
                <ConnectedStatus
                    connectedDivClassName={''}
                    connectedButtonClassName={'mt-0 ml-4 pt-0 pl-0 disconnect-button'}
                    notConnectedClassName={'mt-lg-3 mt-md-3 mt-sm-1 mr-5 pt-lg-2 pr-lg-5 pr-sm-1 pl-0'}
                    displayMessageClassName={'visible'}
                    display={'d-none d-lg-block d-md-block d-sm-block col-lg-1 col-md-1 col-sm-1'}
                    disconnect={this.disconnect}
                    status={this.state.tokenExists}
                />
            </nav>
        )
    }
}

export default Nav;
