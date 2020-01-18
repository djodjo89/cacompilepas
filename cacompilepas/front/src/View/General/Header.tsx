import React, {ReactNode} from "react";

interface HeaderProps {
    h1: string,
    p: string,
    containerClassName?: string,
    contentClassName?: string,
}

class Header extends React.Component<HeaderProps, any> {
    public render(): ReactNode {
        return (
            <div className={'row ' + this.props.containerClassName}>
                <div className={'col-12 text-left ' + this.props.contentClassName}>
                    <h1
                        className={'header-title'}
                    >{this.props.h1}</h1>
                </div>
                <div className={'col-12 ' + this.props.contentClassName}>
                    <p>{this.props.p}</p>
                </div>
            </div>
        );
    }
}

export default Header;
