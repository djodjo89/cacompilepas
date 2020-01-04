import React, {ReactNode} from "react";
import Request from "../../API/Request";
import '../../css/PublicLobbies.css';

interface PublicLobbyProps {
    id: number,
    label: string,
    description: string,
    logo: string,
    pseudo: string,
}


class PublicLobby extends React.Component<PublicLobbyProps, any> {
    public constructor(props: PublicLobbyProps) {
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
                idLobby: this.props.id,
                path: this.props.logo,
            },
            'json',
            'blob',
        );
    }

    public fillLogo(data: Blob): void {
        const img: any = document.getElementById('lobby-logo-' + this.props.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid row col-lg-5 mt-lg-0 mt-sm-4 pr-0 mb-lg-5 mr-4 pl-lg-0 pl-md-0 pl-sm-2 pl-xs-2 '
                + (0 === this.props.id % 2 ? ' offset-lg-1 ml-lg-5' : 'mr-lg-5')
            }>
                <div className={'col-lg-3 col-md-3 col-sm-2 pt-lg-5 pt-md-5 pt-sm-5 pl-0 pr-lg-5 pr-md-5 pr-sm-4 pr-xs-5'}>
                    <img
                        id={'lobby-logo-' + this.props.id}
                        className={'lobby-logo'}
                        src={this.props.logo}
                        alt={'Lobby ' + this.props.label + ' logo'}
                        />
                </div>
                <div className={'col-lg-9 col-md-9 col-sm-10 mb-0 p-lg-0'}>
                    <div className={'row'}>
                        <h3 className={'m-0'}>{this.props.label}</h3>
                    </div>
                    <div className={'row lobby-description mt-0 align-top d-inline-block mt-2 col-12 pl-0 pr-0'}>
                        <p>{this.props.description}</p>
                    </div>
                    <div className={'row mt-lg-3 mt-md-3 mt-sm-3 mt-xs-3'}>
                        <div className={'col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left p-0'}>
                            <a
                                href={'/lobby/' + this.props.id}
                            ><p>Lien vers le lobby</p></a>
                        </div>
                        <div className={'col-lg-4 col-md-4 col-sm-4 col-xs-4 p-0'}>
                            <p className={' text-right'}>{this.props.pseudo}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PublicLobby;
