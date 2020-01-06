import React, {ReactNode} from 'react';
import SearchBar from './SearchBar';
import SubmitButton from "./SubmitButton";
import '../../css/Nav.css';
import Svg from '../Assets/Svg';
import Request from "../../API/Request";

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
                <div className={'col-lg-2 col-md-2 col-sm-4 col-xs-4 mr-lg-0 mr-sm-0'}>
                    <a href={'/'}
                       className={'col-lg-1 col-sm-2 pl-lg-0 pl-md-0 pl-sm-0 pf-sm-0 mr-lg-5 mr-sm-0 pr-sm-0'}>
                        <Svg/>
                    </a>
                    <a id={'home-link'} href={'/'}
                       className={'mt-1 col-lg-1 col-sm-2 pl-lg-1 pl-sm-2 ml-lg-0 mt-lg-3'}>caCompilePas</a>
                </div>
                <SearchBar/>
                {this.state.tokenExists ?
                    <div className={'container-fluid col-1'}>
                        <div className={'row'}>
                            <SubmitButton
                                text={''}
                                onClick={this.disconnect}
                                className={'col-lg-1 col-md-1 col-sm-1 col-xs-1 container-fluid mt-lg-2 mt-md-2 mt-sm-1 mt-xs-1 disconnect-button pl-0 ml-3'}
                                disconnectButton={true}
                            />
                        </div>
                        <div className={'row'}>
                            Connecté
                        </div>
                    </div>

                    :
                    <a id={'user'} href={'/connexion/login'}
                       className={'col-lg-1 col-sm-1 mt-lg-3 mt-md-3 mt-sm-3 mt-xs-3 pt-lg-2 pr-lg-5 pr-sm-1 pl-lg-3 pl-sm-4 text-left'}>
                    <span
                        className={'glyphicon glyphicon-user mt-sm-1'}></span>
                    </a>
                }

            </nav>
        )
    }
}

export default Nav;
