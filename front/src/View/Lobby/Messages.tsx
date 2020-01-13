import React, {ReactNode} from 'react';
import Message from "./Message";

interface MessagesProps {
    id: string,
    messages: [],
    className?: string,
}

class Messages extends React.Component<MessagesProps, any> {
    public constructor(props: any) {
        super(props);
        this.state = {
            messages: [],
        }
        this.renderMessage = this.renderMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.setState = this.setState.bind(this);
    }

    public renderMessage(key: string, content: string, send_date: string, pseudo: string): ReactNode {
        return <Message key={key} content={content} send_date={send_date} pseudo={pseudo}/>;
    }

    public renderMessages(): ({} | null | undefined)[] {
        // @ts-ignore
        if (undefined === this.props.messages['message']) {
            return this.props.messages.map(
                (message: any) => this.renderMessage(message['id_message'], message['content'], message['send_date'], message['pseudo'])
            )
                .sort((message1: any, message2: any): number => {
                        if (message1.props.send_date < message2.props.send_date) {
                            return 1;
                        } else if (message1.props.send_date > message2.props.send_date) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                );
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className={'col-12 pr-lg-5 pl-lg-0 pl-sm-0 ' + this.props.className}>
                <ul className={'messages-list list-unstyled'}>
                    {this.renderMessages()}
                </ul>
            </div>
        )
    }
}

export default Messages;
