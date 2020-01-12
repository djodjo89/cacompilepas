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
                className={'proposal-section col-lg-8 col-md-8 col-sm-12 mt-5 mt-lg-2 mt-md-2 mt-sm-3 offset-0 offset-md-1 pt-2 pt-sm-1 pr-5 pr-lg-0 pr-md-0 pr-sm-0 pl-0 position-absolute'}
            >
                <div
                    className={'rounded proposal-list w-100 mt-sm-5 ml-lg-5 pt-2 pl-2 pl-lg-0 pb-1'}
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
