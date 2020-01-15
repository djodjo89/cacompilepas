import React, {ReactNode} from 'react';
import Request from "../../API/Request";
import HashtagInput from "../Hashtags/HashtagInput";
import ProposalList from "./ProposalList";
import '../../css/SearchBar.css';

interface SearchBarState {
    query: string,
    proposals: [],
    inputIsNotEmpty: boolean,
    hashtags: string[],
    hashtagsView: ReactNode,
}

class SearchBar extends React.Component<any, SearchBarState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            query: '',
            proposals: [],
            inputIsNotEmpty: true,
            hashtags: [],
            hashtagsView: <div></div>,
        }
        this.emptyInput = this.emptyInput.bind(this);
        this.updateHashtags = this.updateHashtags.bind(this);
        this.updateHashtagsView = this.updateHashtagsView.bind(this);
        this.refreshProposals = this.refreshProposals.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
    }

    public refreshProposals(data: any): void {
        this.setState({proposals: 'fail' !== data['status'] && [] !== data ? data : []});
    }

    public emptyInput(isEmpty: boolean): void {
        this.setState({inputIsNotEmpty: isEmpty});
    }

    public updateHashtagsView(hashtags: ReactNode): void {
        this.setState({hashtagsView: hashtags});
    }

    public updateHashtags(hashtags: string[]): void {
        this.setState(
            {hashtags: undefined === hashtags ? [] : hashtags},
            this.sendQuery);
    }

    public sendQuery(): void {
        if (this.state.query !== '' || 0 !== this.state.hashtags.length) {
            new Request(
                '/lobby/search/0',
                this.refreshProposals,
                'POST',
                {
                    search: this.state.query.split(/ /),
                    hashtags: this.state.hashtags,
                },
            );
        } else {
            this.refreshProposals([]);
        }

    }

    public updateQuery(text: string): void {
        this.setState(
            {query: text},
            this.sendQuery,
        );
    }

    public render(): ReactNode {
        return (
            <div className={'container-fluid col-lg-9 col-md-8 col-sm-6 col-xs-12 mt-4 mt-lg-4 mt-md-4 mt-sm-3 ml-lg-0 ml-md-0 ml-sm-0 pl-lg-0 pl-md-0 pl-sm-0 pr-lg-0 pr-md-0 pr-sm-0 mt-3'}>
                <form
                    className="form-inline my-lg-0 my-md-0 my-sm-2 my-xs-2 col-lg-8 col-md-8 col-sm-12 col-xs-12 offset-lg-1 offset-md-1 offset-sm-0 offset-xs-0 p-0 pl-lg-5 search-form">
                    <label id="search-label" htmlFor="search">
                        <span className="glyphicon glyphicon-search search-icon"></span>
                        <span
                            id="search-placeholder">{this.state.inputIsNotEmpty ? 'Cherche un lobby ou un utilisateur...' : ''}</span>
                    </label>
                    {this.state.hashtagsView}
                    <HashtagInput
                        id={'search'}
                        className={'form-control mr-sm-2 col-12 w-100 search-input'}
                        type={'search'}
                        baseIndent={14}
                        onUpdate={this.emptyInput}
                        updateHashtagsView={this.updateHashtagsView}
                        updateHashtags={this.updateHashtags}
                        updateText={this.updateQuery}
                        hashtagClassName={''}
                    />
                </form>
                {(() => 0 !== this.state.proposals.length ?
                    <ProposalList proposals={this.state.proposals}/> : <div></div>)()}
            </div>
        );
    }
}

export default SearchBar;
