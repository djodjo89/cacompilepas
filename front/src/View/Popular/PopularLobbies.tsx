import React, {ReactNode} from "react";
import Request from "../../API/Request";
import PopularLobby from "./PopularLobby";

interface PopularLobbiesState {
    lobbies: any[],
}

class PopularLobbies extends React.Component<any, PopularLobbiesState> {
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
        return this.state.lobbies.map(
            lobby =>
                <PopularLobby
                    key={lobby['id_lobby']}
                    id={lobby['id_lobby']}
                    label={lobby['label']}
                    description={lobby['description']}
                    logo={lobby['logo']}
                    pseudo={lobby['pseudo']}
                />
        );
    }

    public refreshLobbies(): void {
        new Request(
            '/lobby/getLobbies/0',
            this.fillLobbies,
        );
    }

    public render(): ReactNode {
        return (
            <div>
                Lobbies populaires
                {this.renderLobbies()}
            </div>)
    }
}

export default PopularLobbies;
