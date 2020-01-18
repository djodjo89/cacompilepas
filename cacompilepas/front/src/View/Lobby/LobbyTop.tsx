import React, {ReactNode} from "react";
import LobbyDescription from "./LobbyDescription";
import LobbySummary from "./LobbySummary";
import LobbyDivider from "./LobbyDivider";

interface LobbyTopProps {
    id: string,
    lobbyInformation: any,
    courseSheets: [],
}

class LobbyTop extends React.Component<LobbyTopProps, any> {

    public render(): ReactNode {
        return (
            <div className={'row container-fluid pr-0'}>
                <LobbyDescription
                    id={this.props.id}
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
