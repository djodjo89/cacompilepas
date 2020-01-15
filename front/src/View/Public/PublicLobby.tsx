import React, {ReactNode} from "react";
import Request from "../../API/Request";
import '../../css/PublicLobbies.css';
import minusIcon from "../../img/minus-icon-red-t.png";

interface PublicLobbyProps {
    id: number,
    label: string,
    description: string,
    logo: string,
    pseudo: string,
    onTheRight: boolean,
    activeRemoveButton: boolean,
    delete: any
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
            <div className={'container-fluid row col-lg-5 mt-lg-0 mt-sm-4 pr-0 mb-5 mr-lg-4 pl-lg-0 pl-md-0 pl-sm-2 pl-xs-2 '
                + (this.props.onTheRight ? 'ml-lg-5 pl-lg-5' : 'offset-lg-1 ml-lg-0')
            }>
                <div className={'d-none d-lg-block d-md-block d-sm-block col-lg-3 col-md-2 col-sm-3 pl-lg-0 pl-md-5 pl-sm-0 pr-lg-0 pr-md-5 pr-sm-0 pr-xs-5 ml-2 ml-lg-0 ml-md-0'}>
                    <img
                        id={'lobby-logo-' + this.props.id}
                        className={'lobby-logo mr-0 mr-lg-0 mr-md-3 ml-3 ml-md-0 ml-sm-0'}
                        src={this.props.logo}
                        alt={'Lobby ' + this.props.label + ' logo'}
                    />
                </div>
                <div className={'container-fluid col-lg-9 col-md-9 col-sm-8 mb-0 ml-md-0 pl-lg-5 pl-md-5 pl-sm-0 pl-xs-0 pr-0'}>

                    <div className={'container-fluid'}>
                        <div className={'row'}>
                            <div className={'col-9 text-left pl-0'}>
                                <h3 className={'m-0'}>{this.props.label}</h3>
                            </div>
                            <div className={'col-1 mt-1'}>
                                {this.props.activeRemoveButton ?
                                    <div className={'col-lg-1 col-md-1 col-sm-1 col-xs-1'}>
                                        <img
                                            id={'course-sheet-remove-' + this.props.id}
                                            src={minusIcon}
                                            alt={'Minus Icon'}
                                            className={'remove-button minus-icon ml-5 mr-0'}
                                            onClick={this.props.delete}
                                        />
                                    </div> :
                                    <div></div>}
                            </div>
                        </div>
                        <div className={'row public-lobby-description align-top mt-2 pr-0 pl-5'}>
                            <p>{this.props.description}</p>
                        </div>
                        <div className={'row mt-3'}>
                            <div className={'col-6 text-left p-0'}>
                                <a
                                    href={'/lobby/' + this.props.id}
                                ><p>Lien vers le lobby</p></a>
                            </div>
                            <div className={'col-6 p-0'}>
                                <p className={' text-right'}>{undefined !== this.props.pseudo ? this.props.pseudo : <a href={'/admin/' + this.props.id}>Admin de {this.props.label.substr(0, 3)}...</a>}</p>
                            </div>
                        </div>

                    </div>
                   </div>
            </div>
        )
    }
}

export default PublicLobby;
