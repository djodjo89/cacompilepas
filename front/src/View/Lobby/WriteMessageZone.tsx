import React, {ReactNode} from "react";
import '../../css/Message.css';

class WriteMessageZone extends React.Component {
    public render(): ReactNode {
        return (
            <div className={'col-lg-12 mt-lg-5 ml-lg-0 pl-lg-0'}>
                <div className={'write-message-zone rounded text-left pt-lg-3 pl-lg-3 pt-md-3 pl-md-3 pt-sm-3 pl-sm-3 pl-xs-3 pt-xs-3'}>
                    Ecrire un message sur #CoursJAVAAvances
                </div>
            </div>
        )
    }
}

export default WriteMessageZone;
