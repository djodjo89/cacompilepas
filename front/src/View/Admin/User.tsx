import React, {ReactNode} from "react";
import Input from '../General/Inputs/Input';
import minusIcon from '../../img/minus-icon-red-t.png';
import '../../css/User.css';
import Request from "../../API/Request";

interface UserProps {
    id: string,
    pseudo: string,
    writeRight: boolean,
    icon: string,
    toggleWriteRights: (event: React.ChangeEvent<HTMLInputElement>) => void,
    delete: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
}

class User extends React.Component<UserProps, any> {
    public constructor(props: UserProps) {
        super(props);

        this.fillIcon = this.fillIcon.bind(this);
        this.getIcon = this.getIcon.bind(this);
    }

    public componentDidMount(): void {
        this.getIcon();
    }

    public check(event: React.MouseEvent<HTMLHeadingElement>): void {
        let checkBox: any = event.target;
        checkBox.parentElement.firstChild.firstChild.firstChild.click();
    }

    public getIcon(): void {
        new Request(
            '/lobby/getIcon/0',
            this.fillIcon,
            'POST',
            {
                idUser: this.props.id,
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


    public render(): ReactNode {
        return (
            <div id={'user-' + this.props.id} className={'user-card row col-12'}>
                <div className={'row col-12 pl-0 pr-0'}>
                    <h3 className={'col-11 text-left'}>{this.props.pseudo}</h3>
                    <div
                        className={'col-1 pr-0 mt-4 pt-3'}
                    >
                        <img
                            id={'user-remove-' + this.props.id}
                            src={minusIcon}
                            alt={'Retirer l\'utilisateur'}
                            className={'remove-button minus-icon mr-0'}
                            onClick={this.props.delete}
                        />
                    </div>
                </div>
                <div className={'row col-12 mt-2 rounded ml-1 ml-md-0 ml-sm-0 pr-0 pl-1 pl-md-0 pl-sm-0'}>
                    <div className={'row col-2 col-lg-1 col-md-1 col-sm-2 mr-4 mr-lg-0 mr-md-0 mr-sm-0 ml-1 ml-lg-0 ml-md-0 ml-sm-0 pr-0 pl-2 pl-lg-4 pl-md-3 pl-sm-3 text-left'}>
                        <img
                            id={'user-icon-' + this.props.id}
                            src={this.props.icon}
                            alt={this.props.pseudo}
                            className={'user-icon rounded-circle row'}
                        />
                    </div>
                    <div className={'row col-10 offset-1 pt-4 pr-0 pl-0 pl-md-4'}>
                        <div className={'col-1 pt-2 pl-0 pr-0 user-rights-checkbox-container'}>
                            <Input
                                id={'user-right-checkbox-' + this.props.id}
                                inputType={'checkbox'}
                                checked={this.props.writeRight}
                                placeholder={''}
                                className={'user-rights-checkbox'}
                                onChange={this.props.toggleWriteRights}
                            />
                        </div>
                        <h4
                            className={'col-11 pt-1 pt-lg-0 pr-0 pl-4 pl-lg-0 pl-md-0 pl-sm-0 text-left lobby-write-right-label'}
                            onClick={this.check}
                        >
                            Peut modifier le lobby
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;
