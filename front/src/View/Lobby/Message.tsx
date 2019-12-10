import React, {ReactNode} from "react";
import userIcon from "../../img/icon-female-user.svg";

enum Month {
    Janvier,
    Février,
    Mars,
    Avril,
    Mai,
    Juin,
    Juillet,
    Août,
    Septembre,
    Octobre,
    Novembre,
    Décembre,
}

interface MessageProps {
    content: string,
    send_date: string,
    pseudo: string,
}

class Message extends React.Component<MessageProps, {}> {
    render(): ReactNode {
        return (
            <li className="col-lg-11 ml-lg-0 ml-sm-0 mt-lg-5 mt-sm-3 mb-lg-5 mb-sm-5">
                <div className="row col-lg-12 col-sm-12 pl-sm-0">
                    <img src={userIcon} className="App-logo col-lg-1 col-sm-1 pr-lg-0 pr-sm-0 pl-lg-0 pl-sm-0"
                         alt="logo"/>
                    <h4 className="col-sm-9 offset-sm-1 mb-sm-0 pl-sm-0 mt-sm-4 ml-lg-2 ml-sm-4">{this.props.pseudo}, le {this.props.send_date.split(/-/)[2]} {Month[parseInt(this.props.send_date.split(/-/)[1]) - 1]} {this.props.send_date.split(/-/)[0]}</h4>
                </div>
                <div className="row col-lg-12 col-sm-12 ml-lg-4">
                    <p className="col-lg-12 col-sm-10 offset-lg-0 offset-sm-1 message-body mt-sm-0 pl-sm-2">{this.props.content}</p>
                </div>
            </li>
        )
    }
}

export default Message;