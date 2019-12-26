import React, {ChangeEvent, ReactNode, Ref} from 'react';
import HashtagInput from "./HashtagInput";

interface SearchBarState {
    inputIsNotEmpty: boolean,
    hashtags: ReactNode,
}

class SearchBar extends React.Component<any, SearchBarState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            inputIsNotEmpty: true,
            hashtags: <div></div>,
        }
        this.emptyInput = this.emptyInput.bind(this);
        this.updateHashtags = this.updateHashtags.bind(this);
    }

    public emptyInput(isEmpty: boolean): void {
        this.setState({inputIsNotEmpty: isEmpty});
    }

    public updateHashtags(hashtags: ReactNode): void {
        this.setState({hashtags: hashtags});
    }

    public render(): ReactNode {
        return (
            <form
                className="form-inline my-lg-0 my-md-0 my-sm-2 my-xs-2 col-lg-5 col-md-5 col-sm-6 col-xs-6 offset-lg-1 offset-md-1 offset-sm-0 offset-xs-0">
                <label id="search-icon" htmlFor="search">
                    <span className="glyphicon glyphicon-search search-icon"></span>
                    <span
                        id="search-placeholder">{this.state.inputIsNotEmpty ? 'Rechercher...' : ''}</span>
                </label>
                {this.state.hashtags}
                <HashtagInput
                    id={'search'}
                    className={'form-control col-lg-12 w-75 mr-sm-2'}
                    type={'search'}
                    baseIndent={14}
                    onUpdate={this.emptyInput}
                    updateHashtags={this.updateHashtags}
                    hashtagClassName={''}
                />
            </form>
        );
    }
}

export default SearchBar;
