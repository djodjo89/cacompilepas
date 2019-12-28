import React, {ReactNode} from 'react';
import Divider from '../General/Divider';
import Messages from './Messages';
import CourseSheets from "./CourseSheets";
import WriteMessageZone from './WriteMessageZone';
import Request from "../../API/Request";
import '../../css/Lobby.css';
import {
    Switch,
    Route,
    BrowserRouter as Router,
} from "react-router-dom";
import {ReactComponent as Loader} from "../../img/loader.svg";

class Lobby extends React.Component<any, { right: string, courseSheets: [] }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            right: '',
            courseSheets: [],
        }
        this.fillCourseSheets = this.fillCourseSheets.bind(this);
        this.setState = this.setState.bind(this);
    }

    public componentDidMount(): void {
        new Request(
            '/lobby/coursesheets/' +
            this.props.location.pathname.split(/\//)[2],
            this.fillCourseSheets
        );
    }

    public fillCourseSheets(data: any): void {
        if (undefined === data['message']) {
            this.setState({courseSheets: data});
            this.setState({right: 'true'});
        } else if (data['message'].includes('right')) {
            this.setState({right: 'false'});
        } else {
            this.setState({right: 'true'});
        }
    }

    public render(): ReactNode {
        return (
            <Router>
                <Switch>
                    <Route exact path={this.props.path}>
                        <h3>Veuillez choisir un lobby</h3>
                    </Route>
                    <Route path={this.props.location.pathname}>
                        {() => {
                            if ('true' === this.state.right) {
                                return (
                                    <section className={"content row container-fluid"}>
                                        <LobbyTop id={this.props.location.pathname.split(/\//)[2]}
                                                  courseSheets={this.state.courseSheets}/>
                                        <LobbyBody id={this.props.location.pathname.split(/\//)[2]}
                                                   courseSheets={this.state.courseSheets}/>
                                    </section>
                                );
                            } else if ('false' === this.state.right) {
                                return <h2>Vous n'avez pas les droits nécessaires pour accéder à ce lobby</h2>
                            } else {
                                return <div className={'mt-5'}><Loader/></div>
                            }
                        }}
                    </Route>
                </Switch>
            </Router>
        );
    }
}

class LobbyTop extends React.Component<{ id: string, courseSheets: [] }, {}> {
    public render(): ReactNode {
        return (
            <div className="row col-lg-12 col-sm-12 mt-lg-5 mt-sm-5 mr-lg-0 mr-sm-0">
                <LobbySummary courseSheets={this.props.courseSheets}/>
                <LobbyDescription id={this.props.id}/>
            </div>
        )
    }
}

class LobbySummary extends React.Component<{ courseSheets: [] }, {}> {
    constructor(props: any) {
        super(props);
        this.renderList = this.renderList.bind(this);
    }

    public renderList(): ReactNode {
        let res = [], i = 0;
        for (let courseSheet of this.props.courseSheets) {
            res.push(<li key={i}>{courseSheet['title']}</li>);
            i++;
        }
        return res;
    }

    public render(): ReactNode {
        return (
            <section className="col-lg-6 col-sm-6 ml-lg-0 ml-sm-0 pl-lg-0 pl-sm-0 top-section">
                <h2 className="text-left mb-0">Sommaire</h2>
                <ul className="ccp-list list-unstyled text-left ml-1 mt-3">
                    {this.renderList()}
                </ul>
                <Divider/>
            </section>
        )
    }
}

class LobbyDescription extends React.Component<{ id: string }, { lobby: any }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            lobby: []
        };
        this.fillDescription = this.fillDescription.bind(this);
        this.setState = this.setState.bind(this);
    }

    public componentDidMount(): void {
        new Request('/lobby/consult/' + this.props.id, this.fillDescription);
    }

    public fillDescription(data: any): void {
        this.setState({lobby: data[0]});
    }

    public render(): ReactNode {
        return (
            <section className="col-lg-6 col-sm-6 pr-sm-0 top-section">
                <h2 className="ml-lg-0 text-left">{this.state.lobby['label_lobby']}</h2>
                <p className="ml-lg-2 ml-sm-1 course-sheet-presentation w-100">{this.state.lobby['description']}</p>
                <Divider/>
            </section>
        )
    }
}

class LobbyBody extends React.Component<{ id: string, courseSheets: [] }, {}> {
    public render(): ReactNode {
        return (
            <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12"}>
                <Messages id={this.props.id}/>
                <CourseSheets
                    id={this.props.id}
                    courseSheets={this.props.courseSheets}
                    className={'col-lg-6 col-sm-12 mt-lg-3'}
                    activeRemoveButton={false}
                    removableHashtags={false}
                    delete={undefined}
                />
                <WriteMessageZone/>
            </div>
        )
    }
}

export default Lobby;
