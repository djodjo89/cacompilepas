import React, {ReactNode} from 'react';
import Request from "../../API/Request";
import HashtagInput from "./HashtagInput";
import ProposalList from "./ProposalList";

interface SearchBarState {
    query: string,
    proposals: [],
    inputIsNotEmpty: boolean,
    hashtagsView: ReactNode,
}

class SearchBar extends React.Component<any, SearchBarState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            query: '',
            proposals: [],
            inputIsNotEmpty: true,
            hashtagsView: <div></div>,
        }
        this.emptyInput = this.emptyInput.bind(this);
        this.updateHashtagsView = this.updateHashtagsView.bind(this);
        this.refreshProposals = this.refreshProposals.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    public componentDidUpdate(): void {
        new Request(
            '/lobby/search/0',
            this.refreshProposals,
            'POST',
            {search: this.state.query.split(/ /)},
        );
    }

    public refreshProposals(data: any): void {
        this.setState({proposals: undefined === data['message'] ? data.slice(0, 3) : []});
    }

    public emptyInput(isEmpty: boolean): void {
        this.setState({inputIsNotEmpty: isEmpty});
    }

    public updateHashtagsView(hashtags: ReactNode): void {
        this.setState({hashtagsView: hashtags});
    }

    public updateHashtags(hashtags: string[]): void {
    }

    public updateQuery(text: string): void {
        this.setState({query: text});
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid col-lg-9 col-md-6 col-sm-6 col-xs-6 mt-lg-4 mt-md-4 mt-sm-3 mt-xs-3'}>
                <form
                    className="form-inline my-lg-0 my-md-0 my-sm-2 my-xs-2 col-lg-8 col-md-8 col-sm-12 col-xs-12 offset-lg-1 offset-md-1 offset-sm-0 offset-xs-0 p-0">
                    <label id="search-icon" htmlFor="search">
                        <span className="glyphicon glyphicon-search search-icon"></span>
                        <span
                            id="search-placeholder">{this.state.inputIsNotEmpty ? 'Rechercher...' : ''}</span>
                    </label>
                    {this.state.hashtagsView}
                    <HashtagInput
                        id={'search'}
                        className={'form-control mr-sm-2 col-12 w-100'}
                        type={'search'}
                        baseIndent={14}
                        onUpdate={this.emptyInput}
                        updateHashtagsView={this.updateHashtagsView}
                        updateHashtags={this.updateHashtags}
                        updateText={this.updateQuery}
                        hashtagClassName={''}
                    />
                </form>
                {(() => 0 !== this.state.proposals.length && '' !== this.state.query ? <ProposalList proposals={this.state.proposals}/> : <div></div>)()}
            </div>
        );
    }
}

export default SearchBar;
