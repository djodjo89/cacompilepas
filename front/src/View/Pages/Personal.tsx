import React, {ReactNode} from 'react';
import '../../css/Personal.css';
import Request from "../../API/Request";

interface PersonalState {
    personalInformation: any,
    ownedLobbies: [],
}

class Personal extends React.Component<any, PersonalState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            personalInformation: [],
            ownedLobbies: [],
        }
        this.fetchData = this.fetchData.bind(this);
        this.renderPersonalInformation = this.renderPersonalInformation.bind(this);
        this.fillIcon = this.fillIcon.bind(this);
        this.getIcon = this.getIcon.bind(this);
    }

    public componentDidMount(): void {
        new Request(
            '/connection/personal/0',
            this.fetchData,
        );
    }

    public getIcon(): void {
        new Request(
            '/connection/getIcon/' + this.state.personalInformation['id_user'],
            this.fillIcon,
            'POST',
            {
                path: this.state.personalInformation['icon'],
            },
            'json',
            'blob',
        );
    }

    public fillIcon(data: Blob): void {
        const img: any = document.getElementById('personal-icon-' + this.state.personalInformation['id_user']);
        const blob = new Blob([data], {type: 'image/jpg'});
        img.src = URL.createObjectURL(blob);
    }

    public fetchData(data: any) {
        this.setState({
            personalInformation: data[0],
            ownedLobbies: data[1],
        },
            this.getIcon);
    }

    public renderPersonalInformation(): ReactNode {
        return <p>{undefined !== this.state.personalInformation ? this.state.personalInformation['first_name'] : 'rien'}</p>
    }

    public render(): ReactNode {
        return (
            <div>
                Page perso
                {this.renderPersonalInformation()}
                <img
                    id={'personal-icon-' + this.state.personalInformation['id_user']}
                    className={'personal-icon'}
                    alt={'Personal icon'}
                />
            </div>
        );
    }
}

export default Personal;
