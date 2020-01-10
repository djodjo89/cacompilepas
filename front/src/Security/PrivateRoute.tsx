import React, {ReactNode} from 'react';
import {
    Route,
    Redirect,
} from 'react-router-dom';
import {ReactComponent as Loader} from '../img/loader.svg';
import Request from "../API/Request";
import Connection from "../View/Connection/Connection";

interface PrivateRouteProps {
    path: string,
    component: any,
    rest: [],
}

// Redirects to login page if token is not valid or doesn't exist
class PrivateRoute extends React.PureComponent<PrivateRouteProps, { status: string }> {

    public constructor(props: PrivateRouteProps) {
        super(props);
        this.state = {
            // Pending (''), connected ('true'), not connected ('false')
            status: ''
        }
        this.setState = this.setState.bind(this);
        this.updateToken = this.updateToken.bind(this);
        this.checkToken = this.checkToken.bind(this);
    }

    public componentDidMount(): void {
        this.checkToken();
    }

    public updateToken(data: any): void {
        if (data['token_exists']) {
            this.setState({status: 'true'});
        } else {
            this.setState({status: 'false'});
            localStorage.setItem('token', '');
        }
    }

    public checkToken(): void {
        if (undefined !== localStorage.getItem('token') && '' !== localStorage.getItem('token')) {
            // Check if token is valid
            new Request('/connection/verification', this.updateToken);
        } else {
            this.setState({status: 'false'});
        }
    }

    public render(): ReactNode {
        return <Route
            {...this.props.rest}
            render={() => {
                // If there is a token and user is connected, render element
                if (undefined !== localStorage.getItem('token') && '' !== localStorage.getItem('token') && 'true' === this.state.status) {
                    return React.createElement(this.props.component, this.props);
                } else if ('false' === this.state.status) {
                    const referrer = document.documentURI;
                    window.history.pushState("", "", '/connexion/login');
                    return <Connection referrer={referrer}/>
                } else {
                    return <div className={'mt-5'}><Loader/></div>;
                }
            }}
        />
    }
}

export default PrivateRoute;
