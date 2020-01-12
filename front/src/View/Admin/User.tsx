import React, {ChangeEvent, ReactNode} from "react";
import Input from '../General/Input';
import minusIcon from '../../img/minus-icon-red-t.png';
import '../../css/User.css';

interface UserProps {
    id: string,
    pseudo: string,
    writeRight: boolean,
    icon: string,
    toggleWriteRights: (event: React.ChangeEvent<HTMLInputElement>) => void,
    delete: (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void,
}

class User extends React.Component<UserProps, any> {
    public check(event: React.MouseEvent<HTMLHeadingElement>): void {
        let checkBox: any = event.target;
        checkBox.parentElement.firstChild.firstChild.firstChild.click();
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
                            alt={'Minus Icon'}
                            className={'remove-button minus-icon ml-5 mr-0'}
                            onClick={this.props.delete}
                        />
                    </div>
                </div>
                <div className={'row col-12 mt-2 rounded ml-1 ml-md-0 ml-sm-0 pr-0 pl-1 pl-md-0 pl-sm-0'}>
                    <div className={'col-3 col-lg-2 col-md-2 col-sm-2 mr-4 mr-lg-0 mr-md-0 mr-sm-0 ml-1 ml-lg-0 ml-md-0 ml-sm-0 pr-0 pl-2 pl-lg-4 pl-md-3 pl-sm-3 text-left'}>
                        <img
                            src={this.props.icon}
                            alt={'User Icon'}
                            className={'user-icon col-2 pl-0 rounded-circle'}
                        />
                    </div>
                    <div className={'row col-9 col-lg-10 col-md-10 col-sm-10 offset-1 pt-5 pr-0'}>
                        <div className={'col-1 pt-2 pl-0 pr-0'}>
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
                            className={'col-11 pt-1 pr-0 pl-5 pl-lg-0 pl-md-0 pl-sm-0 text-left lobby-write-right-label'}
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
