import React, {ReactNode} from 'react';
import SearchBar from './SearchBar';
import '../../css/Nav.css';
import Svg from '../Assets/Svg';
import Connection from '../Connection/Connection';
import Request from "../../API/Request";

interface ConnectionStates {
    // Pending (''), connected ('true') or not connected ('false')
    status: string,
    token: string,
    tokenExists: boolean,
}


class Nav extends React.Component<{}, ConnectionStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            status: '',
            token: '',
            tokenExists: false,
        }

        this.setState = this.setState.bind(this);
        this.checkIfAlreadyConnected = this.checkIfAlreadyConnected.bind(this);
    }

    public checkIfAlreadyConnected(data: any): void {
        this.setState({tokenExists: data['token_exists']});
        if (false === this.state.tokenExists) {
            localStorage.setItem('token', '');
        }
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

    public render(): ReactNode {
        if (this.state)
        return (
            <nav className="row mt-3">
                <div className="col-lg-2 col-sm-4 mr-lg-0 mr-sm-0">
                    <a href='/' className='col-lg-1 col-sm-2 pl-lg-0 pl-md-0 pl-sm-0 pf-sm-0 mr-lg-5 mr-sm-0 pr-sm-0'>
                        <Svg/>
                    </a>
                    <a id="home-link" href='/'
                       className="mt-1 col-lg-1 col-sm-2 pl-lg-1 pl-sm-2 ml-lg-0 mt-lg-3">caCompilePas</a>
                </div>

                <SearchBar/>
                <a id="user" href="/connexion/login"
                   className="col-lg-1 col-sm-2 mt-lg-1 mt-md-1 mt-sm-3 pr-lg-5 pr-sm-1 pl-lg-0 pl-sm-0">
                    <span
                        className={"glyphicon glyphicon-user"}></span>
                    <div className={"row"}>
                        {(() => {

                            if (this.state.status === 'connected') {
                                    return <div>
                                        Connecté !!
                                    </div>;
                            }
                        })()}
                    </div>
                </a>
                if
            </nav>

        )
    }

}


export default Nav;
