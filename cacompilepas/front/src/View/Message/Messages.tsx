import React, {ReactNode} from 'react';
import Message from "./Message";

interface MessagesProps {
    id: string,
    messages: any,
    className?: string,
    activeRemoveButton?: boolean,
    delete?: ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void) | undefined,
}

class Messages extends React.Component<MessagesProps, any> {
    public constructor(props: MessagesProps) {
        super(props);
        this.state = {
            messages: [],
        }
        this.renderMessage = this.renderMessage.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.setState = this.setState.bind(this);
    }

    public renderMessage(id: string, idUser: string, content: string, sendDate: string, pseudo: string, icon: string): ReactNode {
        return <Message
            id={id}
            key={id}
            idUser={idUser}
            content={content}
            sendDate={sendDate}
            pseudo={pseudo}
            icon={icon}
            activeRemoveButton={this.props.activeRemoveButton}
            delete={this.props.delete}
        />;
    }

    public renderMessages(): ({} | null | undefined)[] {
        // @ts-ignore
        if (this.props.messages['success']) {
            return this.props.messages['data'].map(
                (message: any) => this.renderMessage(message['id_message'], message['id_user'], message['content'], message['send_date'], message['pseudo'], message['icon'])
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
