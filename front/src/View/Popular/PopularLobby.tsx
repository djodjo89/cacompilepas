import React, {ReactNode} from "react";
import Request from "../../API/Request";

interface PopularLobbyProps {
    id: number,
    label: string,
    description: string,
    logo: string,
    pseudo: string
}
class PopularLobby extends React.Component<PopularLobbyProps, any> {
    public constructor(props: PopularLobbyProps) {
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
        const img: any = document.getElementById('lobby-logo' + this.props.id);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
        console.log(blob);
        console.log(img);
        console.log(data);
    }

    public render(): ReactNode {
        return (
            <div className={'container col-3'}>
                <div className={'col-2 lobby-logo'}>
                    <img
                        id={'lobby-logo' + this.props.id}
                        src={this.props.logo}
                        alt={'Lobby ' + this.props.label + ' logo'}
                        />
                </div>
                <div className={'col-10'}>
                    <div className={'row'}>
                        <h4>{this.props.label}</h4>
                    </div>
                    <div className={'row'}>
                        <p>{this.props.description}</p>
                    </div>
                    <div className={'row'}>
                        <div className={'col-6'}>
                            <a
                                href={'/lobby/' + this.props.id}
                            >Lien vers le lobby</a>
                        </div>
                        <div className={'col-6'}>
                            {this.props.pseudo}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopularLobby;
