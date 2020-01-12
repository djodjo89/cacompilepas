import React, {ReactNode} from "react";
import Proposal from "./Proposal";
import '../../css/SearchBar.css';

class ProposalList extends React.Component<{ proposals: [] }, any> {
    public constructor(props: any) {
        super(props);
        this.renderProposals = this.renderProposals.bind(this);
    }

    public renderProposals(): ReactNode {
        let res = this.props.proposals.map(proposal => {
            return (
                <li
                    key={proposal['id_lobby']}
                >
                    <Proposal
                        id={proposal['id_lobby']}
                        content={proposal['label_lobby']}
                    />
                </li>
            );
        });
        return res;
    }

    public render(): ReactNode {
        return (
            <div
                className={'proposal-section col-lg-7 col-sm-10 mt-5 mt-sm-2 ml-lg-5 ml-sm-0 pt-2 pt-sm-1 pr-5 pl-0 pl-lg-5 pl-sm-4 position-absolute'}
            >
                <div
                    className={'rounded proposal-list mt-sm-5 ml-lg-5 pt-2 pl-2 pl-lg-2 pb-1'}
                >
                    <ul
                        className={'list-unstyled ml-lg-5 ml-sm-3'}
                    >
                        {this.renderProposals()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default ProposalList;
