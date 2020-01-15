import React, {ReactNode} from 'react';
import Request from "../../API/Request";

interface LobbyProposalProps {
    id: string,
    position: string,
    label: string,
    description: string,
    logo: string,
}

class LobbyProposal extends React.Component<LobbyProposalProps, any> {
    public constructor(props: LobbyProposalProps) {
        super(props);

        this.fillLogo = this.fillLogo.bind(this);
        this.getLogo = this.getLogo.bind(this);
    }

    public componentDidMount(): void {
        this.getLogo();
    }

    public getLogo(): void {
        new Request(
            '/lobby/getLogo/0',
            this.fillLogo,
            'POST',
            {
                id_lobby: this.props.id.split(/-/)[2],
                path: this.props.logo,
            },
            'json',
            'blob',
        );
    }

    public fillLogo(data: Blob): void {
        const img: any = document.getElementById('search-lobby-logo-' + this.props.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public render(): ReactNode {
        return (
            <li key={'search-lobby-' + this.props.id} className={'bg-light p-3' + ('first' === this.props.position ? ' rounded-top' : '' ) + ('last' === this.props.position ? ' rounded-bottom' : '')}>
                <a
                    className={'row'}
                    href={'/lobby/' + this.props.id.split(/-/)[2]}
                >
                    <div className={'col-1'}>
                        <img
                            id={'search-lobby-logo-' + this.props.id}
                            src={this.props.logo}
                            className={'proposal-icon rounded-circle'}
                            alt={this.props.label}
                        />
                    </div>
                    <div
                        className={'col-11 pl-4 pl-sm-5 pt-2 pt-sm-2 proposal'}
                    >
                        {this.props.label} {this.props.description.substr(0, 27)}...
                    </div>
                </a>
            </li>
        );
    }
}

export default LobbyProposal;
