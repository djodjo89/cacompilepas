import React, {ReactNode} from 'react';
import Request from "../../API/Request";
import swal from "sweetalert";

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
        this.proposeToWriteMessage = this.proposeToWriteMessage.bind(this);
    }

    public componentDidMount(): void {
        this.getIcon();
    }

    public getIcon(): void {
        new Request(
            '/user/get_icon/' + this.props.id.split(/-/)[2],
            this.fillIcon,
            'POST',
            {
                path: this.props.icon,
            },
            'json',
            'blob',
        );
    }

    public fillIcon(payload: Blob): void {
        const img: any = document.getElementById('search-user-icon-' + this.props.id);
        const blob = new Blob([payload], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public proposeToWriteMessage(event: React.MouseEvent<HTMLLIElement>): void {
        swal({
            title: 'Veux-tu écrire un message à ' + this.props.pseudo + ' ?',
            text: 'Un lobby privé vous permettant de discuter sera créé',
            buttons: ['Tout compte fait, non', 'Oui, c\'est parti !'],
            dangerMode: true,
            // @ts-ignore
        }).then((willToWrite: boolean) => {
            if (willToWrite) {
                // @ts-ignore
                document.location = '/message/conversation/' + this.props.id.split(/-/)[2];
            }
        });
    }

    public render(): ReactNode {
        return (
            <li
                key={'search-user-' + this.props.id}
                className={'bg-light p-3 proposal-link' +
                (() => {
                    if ('first' === this.props.position) {
                        return ' rounded-top';
                    } else if ('last' === this.props.position) {
                        return ' rounded-bottom';
                    } else {
                        return '';
                    }
                })()}
                onClick={this.proposeToWriteMessage}
            >
                <div
                    className={'row'}
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
                </div>
            </li>
        );
    }
}

export default UserProposal;
