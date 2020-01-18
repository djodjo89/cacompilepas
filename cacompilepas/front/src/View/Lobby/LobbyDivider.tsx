import React, {ReactNode} from "react";
import Divider from "../General/Divider";

class LobbyDivider extends React.Component<{ containerClassName?: string, dividerClassName?: string}, any> {
    public render(): ReactNode {
        return (
            <div
                className={'row container-fluid ' + this.props.containerClassName}
            >
                <Divider
                    className={'col-lg-6 col-md-10 col-sm-12 col-xs-12 mt-5 mb-5 ' + this.props.dividerClassName}
                />
            </div>
        );
    }
}

export default LobbyDivider;
