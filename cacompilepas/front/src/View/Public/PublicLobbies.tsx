import React, {ReactNode} from "react";
import Request from "../../API/Request";
import PublicLobby from "./PublicLobby";
import Header from "../General/Header";

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

    public fillLobbies(payload: any): void {
        console.log(payload);
        this.setState({lobbies: payload['data']});
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
            '/lobby/get_lobbies',
            this.fillLobbies,
        );
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid p-0 p-lg-4 p-md-4 p-sm-4 ml-sm-2'}>
                <Header
                    h1={'Lobbies publics'}
                    p={'Ici tu pourras trouver les lobbies publics'}
                />
                <div className={'row container-fluid mt-3 mt-lg-0 mt-md-0 mt-sm-0 pt-lg-5 pt-md-0 pr-0 pl-0'}>
                    {this.renderLobbies()}
                </div>
            </div>)
    }
}

export default PublicLobbies;
