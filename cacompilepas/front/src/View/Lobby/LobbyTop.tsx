import React, {ReactNode} from "react";
import LobbyDescription from "./LobbyDescription";
import LobbySummary from "./LobbySummary";
import LobbyDivider from "./LobbyDivider";
import adminIcon from "../../img/admin.png";
import Request from "../../API/Request";

interface LobbyTopProps {
    id: string,
    lobbyInformation: any,
    courseSheets: [],
    isAdmin: boolean,
}

class LobbyTop extends React.Component<LobbyTopProps, any> {

    public render(): ReactNode {
        return (
            <div className={'row container-fluid pr-0 mt-5 mt-lg-5 mt-md-5 mt-sm-5'}>
                <LobbyDescription
                    id={this.props.id}
                    isAdmin={this.props.isAdmin}
                />
                <div className={'col-12 pl-0 pl-lg-4 pl-md-4 pl-sm-4'}>
                    <div className={'row container-fluid pr-0'}>
                        <LobbyDivider/>
                    </div>
                </div>
                <LobbySummary courseSheets={this.props.courseSheets}/>
            </div>
        )
    }
}

export default LobbyTop;
