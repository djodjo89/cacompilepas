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
            <div id={'user-' + this.props.id} className={'user-card row col-lg-12 col-md-12 col-sm-12 col-xs-12'}>
                <div
                    className={'row col-lg-12 col-md-12 col-sm-12 col-xs-12 pl-lg-0 pl-md-0 pl-sm-0 pl-xs-0 pr-lg-0 pr-md-0 pr-sm-0 pr-xs-0'}
                >
                    <h3 className={'col-lg-11 col-md-11 col-sm-11 col-xs-11 text-lg-left text-md-left text-sm-left text-xs-left'}>{this.props.pseudo}</h3>
                    <div
                        className={'col-lg-1 col-md-1 col-sm-1 col-xs-1 pr-0 mt-lg-5 mt-md-5 mt-sm-5 mt-xs-5'}
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
                <div
                    className={'row col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-lg-2 mt-md-2 mt-sm-2 mt-xs-2 rounded'}
                >
                    <img
                        src={this.props.icon}
                        alt={'User Icon'}
                        className={'user-icon col-2 pl-0 rounded-circle'}
                    />
                    <div className={'row col-10 pt-5'}>
                        <div className={'col-1 pt-2 pl-0 pr-0'}>
                            <Input
                                id={this.props.id}
                                inputType={'checkbox'}
                                checked={this.props.writeRight}
                                placeholder={''}
                                className={'user-rights-checkbox'}
                                onChange={this.props.toggleWriteRights}
                            />
                        </div>
                        <h4
                            className={'col-11 pl-0 pt-1 text-left lobby-write-right-label'}
                            onClick={this.check}
                        >
                            A le droit de modifier le lobby
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;
