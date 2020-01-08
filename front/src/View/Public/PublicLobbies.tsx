import React, {ReactNode} from "react";
import Request from "../../API/Request";
import PublicLobby from "./PublicLobby";

interface PublicLobbiesState {
    lobbies: any[],
}

class PublicLobbies extends React.Component<any, PublicLobbiesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            lobbies: [],
        }
        this.fillLobbies = this.fillLobbies.bind(this);
        this.refreshLobbies = this.refreshLobbies.bind(this);
        this.renderLobbies = this.renderLobbies.bind(this);
    }

    public componentDidMount(): void {
        this.refreshLobbies();
    }

    public fillLobbies(data: any): void {
        this.setState({lobbies: data});
    }

    public renderLobbies(): ReactNode {
        let res;
        let i: number = 0;
        if (0 !== this.state.lobbies.length && undefined !== this.state.lobbies[0]) {
            res = this.state.lobbies.map(
                lobby => {
                    i++;
                    return (
                    <PublicLobby
                        key={lobby['id_lobby']}
                        id={lobby['id_lobby']}
                        label={lobby['label_lobby']}
                        description={lobby['description']}
                        logo={lobby['logo']}
                        pseudo={lobby['pseudo']}
                        onTheRight={0 === i % 2}
                        activeRemoveButton={false}
                        delete={null}
                    />
                    );
                }
            );
        }
        else {
            res = <h4 className={'text-center col-12 mt-5'}>Il n'y a pas de lobby public pour le moment</h4>;
        }
        return res;
    }

    public refreshLobbies(): void {
        new Request(
            '/lobby/getLobbies/0',
            this.fillLobbies,
        );
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid'}>
                <div className={'row container-fluid pl-0'}>
                    <div className={'row col-12'}>
                        <div className={'col-12 text-left'}>
                            <h1>Lobbies publics</h1>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-12 ml-4'}>
                            <div className={'ml-1'}>
                                <p>Ici tu pourras trouver les lobbies publics</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'row container-fluid pt-lg-5 pt-md-5 pr-0'}>
                    {this.renderLobbies()}
                </div>
            </div>)
    }
}

export default PublicLobbies;
