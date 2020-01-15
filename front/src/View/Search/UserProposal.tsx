import React, {ReactNode} from 'react';
import Request from "../../API/Request";

interface UserProposalProps {
    id: string,
    position: string,
    firstName: string,
    lastName: string,
    pseudo: string,
    icon: string,
}

class UserProposal extends React.Component<UserProposalProps, any> {
    public constructor(props: UserProposalProps) {
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
                idUser: this.props.id.split(/-/)[2],
                path: this.props.icon,
            },
            'json',
            'blob',
        );
    }

    public fillIcon(data: Blob): void {
        const img: any = document.getElementById('search-user-icon-' + this.props.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public render(): ReactNode {
        return (
            <li key={'search-user-' + this.props.id} className={'bg-light p-3' +
            (() => {
                if ('first' === this.props.position) {
                    return ' rounded-top';
                } else if ('last' === this.props.position) {
                    return ' rounded-bottom';
                } else {
                    return '';
                }
            })()}>
                <a
                    className={'row'}
                    href={'/message/conversation/' + this.props.id.split(/-/)[2]}
                >
                    <div className={'col-1'}>
                        <img
                            id={'search-user-icon-' + this.props.id}
                            src={this.props.icon}
                            className={'proposal-icon rounded-circle'}
                            alt={this.props.pseudo}
                        />
                    </div>
                    <div
                        className={'col-11 pl-4 pl-sm-5 pt-2 pt-sm-2 proposal'}
                    >
                        {this.props.firstName} {this.props.lastName} alias <u>{this.props.pseudo}</u>
                    </div>
                </a>
            </li>
        );
    }
}

export default UserProposal;
