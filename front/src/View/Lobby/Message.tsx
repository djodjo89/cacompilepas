import React, {ReactNode} from 'react';
import {display} from '../../Model/Month';
import userIcon from '../../img/icon-female-user.svg';
import RemoveButton from "../General/RemoveButton";
import Request from "../../API/Request";

interface MessageProps {
    id: string,
    idUser: string,
    content: string,
    send_date: string,
    pseudo: string,
    icon: string,
    activeRemoveButton?: boolean,
    delete?: ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void) | undefined,
}

class Message extends React.Component<MessageProps, {}> {
    public constructor(props: any) {
        super(props);

        this.fillIcon = this.fillIcon.bind(this);
        this.getIcon = this.getIcon.bind(this);
    }

    public componentDidMount(): void {
        this.getIcon();
    }

    public getIcon(): void {
        new Request(
            '/lobby/getIcon/0',
            this.fillIcon,
            'POST',
            {
                idUser: this.props.idUser,
                path: this.props.icon,
            },
            'json',
            'blob',
        );
    }

    public fillIcon(data: Blob): void {
        const img: any = document.getElementById('user-icon-' + this.props.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    render(): ReactNode {
        return (
            <li className={'col-12 ml-lg-0 ml-sm-0'}>
                <div className={'row col-lg-12 col-sm-12 pl-sm-0'}>
                    <div className={'d-none d-lg-block d-md-block d-sm-block col-1 pl-3 mr-5'}>
                        <img
                             id={'user-icon-' + this.props.id}
                             src={this.props.icon}
                             className={'user-icon rounded-circle App-logo'}
                             alt={'User icon'}/>
                    </div>
                    <h4
                        className={(this.props.activeRemoveButton ? 'col-11 ' : 'col-12 ') + ' col-lg-9 col-md-9 col-sm-9 offset-1 mb-sm-0 mt-4 ml-0 ml-lg-4 ml-md-1 ml-sm-4 pt-2 pr-0 pl-0 pl-lg-1'}>
                        {display(this.props.pseudo + ', ', this.props.send_date)}
                    </h4>
                    {this.props.activeRemoveButton
                        ? <RemoveButton
                            id={'message-remove-' + this.props.id}
                            containerClassName={'mt-2'}
                            imgClassName={'mt-4 ml-5 mr-0'}
                            delete={this.props.delete}
                            />
                        : <div></div>}
                </div>
                <div className={'row col-lg-12 col-md-10 col-sm-12 ml-0 ml-lg-5 ml-md-4 ml-sm-5 pl-0 pl-sm-5'}>
                    <div className={'ml-0 ml-lg-2 ml-md-5 ml-sm-3'}>
                        <div className={'ml-0 ml-lg-3 ml-md-2 ml-sm-1 pl-0 pl-lg-1 pl-md-0 pl-sm-1'}>
                            <p className={'message-body col-12 mt-sm-0 ml-0 ml-sm-1 pr-0 pl-0 pl-lg-2 pl-md-2 pl-sm-2'}>{this.props.content}</p>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}

export default Message;