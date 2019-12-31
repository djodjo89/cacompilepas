import React, {ReactNode} from 'react';
import HashtagInput from "./HashtagInput";

interface SearchBarState {
    inputIsNotEmpty: boolean,
    hashtagsView: ReactNode,
}

class SearchBar extends React.Component<any, SearchBarState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            inputIsNotEmpty: true,
            hashtagsView: <div></div>,
        }
        this.emptyInput = this.emptyInput.bind(this);
        this.updateHashtagsView = this.updateHashtagsView.bind(this);
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
                className="form-inline my-lg-0 my-md-0 my-sm-2 my-xs-2 col-lg-5 col-md-5 col-sm-5 col-xs-6 offset-lg-1 offset-md-1 offset-sm-0 offset-xs-0">
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
