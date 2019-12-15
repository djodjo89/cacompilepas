import React, {ReactNode} from 'react';
import Request from "../../API/Request";
import Message from "./Message";

class Messages extends React.Component<{ id: string }, { messages: [] }> {
    public constructor(props: any) {
        super(props);
        this.state = {
            messages: [],
        }
        this.renderMessage = this.renderMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.fillMessages = this.fillMessages.bind(this);
        this.setState = this.setState.bind(this);
    }

    public componentDidMount(): void {
        new Request('/lobby/messages/' + this.props.id, 'POST', 'json', {token: localStorage.getItem('token')}, this.fillMessages);
    }

    public fillMessages(data: any): void {
        this.setState({messages: data});
    }

    public renderMessage(key: string, content: string, send_date: string, pseudo: string): ReactNode {
        return <Message key={key} content={content} send_date={send_date} pseudo={pseudo}/>;
    }

    public renderMessages(): ({} | null | undefined)[] {
        // @ts-ignore
        if (undefined === this.state.messages['message']) {
            let res = [], i = 0;
            for (let message of this.state.messages) {
                res.push(this.renderMessage(i.toString(), message['content'], message['send_date'], message['pseudo']));
                i++;
            }
            return res;
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className="col-lg-6 col-sm-12 pl-lg-0 pl-sm-0 pr-lg-5 mt-lg-3 mt-sm-4">
                <ul className="messages-list list-unstyled">
                    {this.renderMessages()}
                </ul>
            </div>
        )
    }
}

export default Messages;
