import React, {ReactNode} from 'react';
import SearchBar from '../Search/SearchBar';
import '../../css/Nav.css';
import Svg from '../Assets/Svg';
import Request from '../../API/Request';
import ConnectedStatus from '../Connection/ConnectedStatus';
import {BrowserRouter as Router, NavLink} from 'react-router-dom';

interface NavState {
    tokenExists: boolean,
    breadcumbs: any[],
}

class Nav extends React.Component<any, NavState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            tokenExists: false,
            breadcumbs: [],
        }
        this.disconnect = this.disconnect.bind(this);
        this.checkIfAlreadyConnected = this.checkIfAlreadyConnected.bind(this);
        this.updateBreadCumbs = this.updateBreadCumbs.bind(this);
        this.renderBreadCumbs = this.renderBreadCumbs.bind(this);
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

    public checkIfAlreadyConnected(payload: any): void {
        this.setState(
            {tokenExists: payload['success']},
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

    public updateBreadCumbs(): void {

    }

    public renderBreadCumbs(): ReactNode {
        console.log(this.state.breadcumbs);
        let i = 0;
        return this.state.breadcumbs.map((breadcumb: any) => {
            console.log(breadcumb.pathname);
            let res = (
                    <div
                        aria-label={breadcumb.pathname}
                    >
                        <a
                            key={i}
                            href={breadcumb.pathname}
                            onClick={() => window.location = breadcumb.pathname}
                        >
                        </a>
                    </div>
            )
            i++;
            return res;
        });
    }

    public render(): ReactNode {
        return (
            <Router>
                <nav className={'row mt-3'}>
                    <div
                        className={'col-lg-2 col-md-3 col-sm-4 col-xs-12 mt-0 mt-lg-0 mt-md-1 mt-sm-1 mr-0 mr-lg-0 mr-sm-0 ml-3 ml-lg-0 ml-md-0 ml-sm-0 pr-0 pl-4 pl-lg-4 pl-md-4 pl-sm-4 text-left'}>
                        <a href={'/'}
                           className={'row container-fluid col-xs-11 ml-lg-1 ml-md-1 ml-sm-1 ml-xs-0 pr-0 pl-lg-2 pl-md-2 pl-sm-2 pl-0'}>
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
                    <div className={'ml-lg-0 pl-lg-0'}></div>
                    <SearchBar/>
                    <ConnectedStatus
                        connectedDivClassName={''}
                        connectedButtonClassName={'mt-0 ml-3 pt-0 pl-1 disconnect-button'}
                        notConnectedClassName={'mt-lg-3 mt-md-3 mt-sm-1 mr-5 pt-lg-2 pr-lg-5 pr-sm-1 pl-0'}
                        displayMessageClassName={'visible'}
                        display={'d-none d-lg-block d-md-block d-sm-block col-lg-1 col-md-1 col-sm-1'}
                        disconnect={this.disconnect}
                        status={this.state.tokenExists}
                    />
                </nav>
                <div
                    className={'mt-3 mt-lg-0 mt-md-0 mt-sm-0 ml-0 ml-lg-4 ml-md-4 ml-sm-4'}
                >
                    {this.renderBreadCumbs()}
                </div>
            </Router>
        )
    }
}

export default Nav;
