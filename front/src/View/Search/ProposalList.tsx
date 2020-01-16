import React, {ReactNode} from "react";
import UserProposal from "./UserProposal";
import LobbyProposal from "./LobbyProposal";
import '../../css/SearchBar.css';

class ProposalList extends React.Component<{ proposals: [] }, any> {
    public constructor(props: { proposals: [] }) {
        super(props);
        this.renderProposals = this.renderProposals.bind(this);
    }

    public renderProposals(): ReactNode {
        let index: number = 0;
        let length: number = this.props.proposals.length;
        let position: string;
        let res = this.props.proposals.map(proposal => {
            if (0 === index) {
                position = 'first';
            } else if (length === index) {
                position = 'last';
            } else {
                position = '';
            }
            index++;
            let proposalRes = undefined !== proposal['id_user']
                ? <UserProposal
                    id={'search-user-' + proposal['id_user']}
                    key={'search-user-' + proposal['id_user']}
                    position={position}
                    firstName={proposal['first_name']}
                    lastName={proposal['last_name']}
                    pseudo={proposal['pseudo']}
                    icon={proposal['icon']}
                />
                : <LobbyProposal
                    id={'search-lobby-' + proposal['id_lobby']}
                    key={'search-lobby-' + proposal['id_lobby']}
                    position={position}
                    label={proposal['label_lobby']}
                    description={proposal['description']}
                    logo={proposal['logo']}
                />
            return proposalRes;
        });
        return res;
    }

    public render(): ReactNode {
        return (
            <div
                className={'proposal-section col-lg-9 col-md-8 col-sm-12 mt-5 mt-lg-2 mt-md-2 mt-sm-3 offset-0 offset-md-1 pt-2 pt-sm-1 pr-5 pr-lg-5 pr-md-0 pr-sm-0 pl-0 position-absolute'}
            >
                <div
                    className={'rounded proposal-list w-100 mt-sm-5 pt-2 pr-lg-5 pl-0 pb-1'}
                >
                    <ul
                        className={'list-unstyled ml-lg-5 ml-sm-0'}
                    >
                        {this.renderProposals()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ProposalList;
