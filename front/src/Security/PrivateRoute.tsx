import React, {Component, ReactNode} from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import Context from "../Global/Context";

interface PrivateRouteProps {
  path: string,
  component: any,
  rest: [],
}

class PrivateRoute extends React.PureComponent<PrivateRouteProps, {}> {
  private status: string;

  public constructor(props: PrivateRouteProps) {
    super(props);
    this.status = '';
    this.handleStatus = this.handleStatus.bind(this);
  }

  public handleStatus(): ReactNode {
    return <Context.Consumer>
      {({token}) => {
        this.status = '' !== token ? 'connected' : 'not connected';
        return <h1>calu</h1>;
      }}
    </Context.Consumer>
  }

  public render(): ReactNode {
    return <Route
            {...this.props.rest}
            render={props =>
                'connected' === this.status ? (
                  <Component {...props}/>
                ) : (
                    <Redirect to={'/connexion/login'}/>
                )
            }
    />
  }
}

export default PrivateRoute;