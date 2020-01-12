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
            <li className={'col-12 ml-lg-0 ml-sm-0'}>
                <div className={'row col-lg-12 col-sm-12 pl-sm-0'}>
                    <div className={'d-none d-lg-block d-md-block d-sm-block col-lg-1 col-md-1 col-sm-1 col-xs-1 pr-lg-0 pr-md-0 pr-sm-0 pr-xs-0 pl-lg-0 pl-md-0 pl-sm-0 pl-xs-0 mr-lg-4'}>
                        <img src={userIcon}
                             className={'App-logo'}
                             alt={'User icon'}/>
                    </div>
                    <h4
                        className={'col-12 col-lg-9 col-md-9 col-sm-9 offset-1 mb-sm-0 mt-4 ml-0 ml-lg-2 ml-md-3 ml-sm-4 pt-2 pr-0 pl-0'}>
                        {this.props.pseudo}, le&nbsp;
                        {this.props.send_date.split(/ /)[0].split(/-/)[2]}&nbsp;
                        {Month[parseInt(this.props.send_date.split(/-/)[1]) - 1]}&nbsp;
                        {this.props.send_date.split(/-/)[0]} à&nbsp;
                        {this.props.send_date.split(/ /)[1].split(/:/)[0]}h
                        {this.props.send_date.split(/ /)[1].split(/:/)[1]}
                    </h4>
                </div>
                <div className={'row col-lg-12 col-md-10 col-sm-12 offset-md-2 ml-lg-4 ml-md-4 ml-sm-4 ml-xs-4'}>
                    <div className={'ml-lg-3 ml-md-5 ml-sm-3 ml-xs-3'}>
                        <div className={'ml-lg-3 ml-md-2 ml-sm-1 ml-xs-1 pl-0 pl-lg-1 pl-md-0 pl-sm-1'}>
                            <p className={'message-body col-12 mt-sm-0 pr-0 pl-0 pl-lg-2 pl-md-0 pl-sm-2'}>{this.props.content}</p>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}

export default Message;