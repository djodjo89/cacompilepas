import React, {ReactNode} from "react";
import CourseSheets from "../CourseSheet/CourseSheets";
import Messages from "../Message/Messages";
import WriteMessageZone from "../Message/WriteMessageZone";
import LobbyDivider from "./LobbyDivider";

interface LobbyBodyProps {
    id: string,
    labelLobby: string,
    courseSheets: [],
    onEnter: (event: React.KeyboardEvent<HTMLDivElement>) => void,
    messages: any,
}

class LobbyBody extends React.Component<LobbyBodyProps, any> {
    public render(): ReactNode {
        return (
            <div className={'col-12 pl-0'}>
                <div className={'col-lg-6 col-md-12 col-sm-12 col-xs-12 container-fluid pl-0 pl-lg-4 pl-md-4 pl-sm-4 pr-0'}>
                    {
                        // @ts-ignore
                        this.props.courseSheets['data'] ?
                            <CourseSheets
                                id={this.props.id}
                                courseSheets={this.props.courseSheets}
                                className={'mt-lg-3'}
                                activeRemoveButton={false}
                                removableHashtags={false}
                                delete={undefined}
                            />
                            :
                            <div className={'row mt-5'}>
                                <div className={'col-12 text-left'}>
                                    <p className={'no-course-sheet-message'}>Il n'y a pas de fiches de cours pour l'instant</p>
                                </div>
                            </div>
                    }
                </div>
                <div className={'col-lg-6 col-md-12 col-sm-12 col-xs-12 container-fluid pl-0'}>
                       <div className={'row col-12 mt-lg-0 mt-md-0 mt-sm-5 mt-xs-5 ml-lg-4 ml-md-4 ml-sm-4 pl-0 ml-0'}>
                           <div className={'row container-fluid pr-0'}>

                           <LobbyDivider
                               dividerClassName={'hidden-lg hidden-md pl-0 ml-0 mt-lg-0'}
                               containerClassName={'hidden-lg hidden-md pl-0 mt-lg-0 ml-0'}
                           />
                           </div>
                       </div>
                    {
                        // @ts-ignore
                        this.props.courseSheets['data'] ?
                            <div className={'row'}>

                                <Messages
                                    id={this.props.id}
                                    messages={this.props.messages}
                                    className={'mt-lg-5 mt-md-0 mt-sm-4 mt-xs-4 ml-0 ml-lg-4 ml-md-4 ml-sm-4 pt-lg-2 pt-md-0 pt-sm-2 pt-xs-2 pl-0'}
                                />
                            </div>
                            :
                            <div className={'row mt-5 mb-5 ml-0'}>
                                <div className={'col-12 text-left pl-0 pl-lg-2 pl-md-3 pl-sm-4'}>
                                    <p className={'no-messages-message'}>Il n'y a pas de messages pour l'instant</p>
                                </div>
                            </div>
                    }
                    <div className={'row'}>
                        <WriteMessageZone
                            labelLobby={this.props.labelLobby}
                            onEnter={this.props.onEnter}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default LobbyBody;
