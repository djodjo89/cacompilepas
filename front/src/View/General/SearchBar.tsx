import React, {ReactNode} from 'react';
import Request from "../../API/Request";
import HashtagInput from "./HashtagInput";

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
        this.setState({proposals: undefined === data['message'] ? data : []});
    }

    public emptyInput(isEmpty: boolean): void {
        this.setState({inputIsNotEmpty: isEmpty});
    }

    public updateHashtagsView(hashtags: ReactNode): void {
        this.setState({hashtagsView: hashtags});
    }

    public updateHashtags(hashtags: string[]): void {
    }

    public render(): ReactNode {
        return (
            <form
                className="form-inline my-lg-0 my-md-0 my-sm-2 my-xs-2 col-lg-8 col-md-8 col-sm-6 col-xs-6 offset-lg-1 offset-md-1 offset-sm-0 offset-xs-0">
                <label id="search-icon" htmlFor="search">
                    <span className="glyphicon glyphicon-search search-icon"></span>
                    <span
                        id="search-placeholder">{this.state.inputIsNotEmpty ? 'Rechercher...' : ''}</span>
                </label>
                {this.state.hashtagsView}
                <HashtagInput
                    id={'search'}
                    className={'form-control col-lg-12 w-75 mr-sm-2'}
                    type={'search'}
                    baseIndent={14}
                    onUpdate={this.emptyInput}
                    updateHashtagsView={this.updateHashtagsView}
                    updateHashtags={this.updateHashtags}
                    hashtagClassName={''}
                />
            </form>
        );
    }
}

export default SearchBar;
