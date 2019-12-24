import React, {ChangeEvent, ReactNode, Ref} from 'react';
import Request from "../../API/Request";
import Hashtag from "./Hashtag";

interface SearchBarState {
    text: string,
    hashtags: string[],
    widths: number[],
    totalWidth: number,
}

class SearchBar extends React.Component<any, SearchBarState> {
    private input: Ref<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.state = {
            text: '',
            hashtags: [],
            widths: [],
            totalWidth: 0,
        }
        this.input = React.createRef();
        this.init();
    }

    public init(): void {
        this.write = this.write.bind(this);
        this.renderHashtags = this.renderHashtags.bind(this);
        this.addHashtag = this.addHashtag.bind(this);
        this.deleteHashtag = this.deleteHashtag.bind(this);
        this.updateHashtags = this.updateHashtags.bind(this);
        this.updateIndent = this.updateIndent.bind(this);
        this.updateTotalWidth = this.updateTotalWidth.bind(this);
    }

    public write(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({text: event.target.value});
    }

    public componentDidMount(): void {
        this.updateIndent();
    }

    public updateIndent(): void {
        this.forceUpdate(() => {
            let x: number = 0 === this.state.totalWidth ? 14 : 10 + this.state.totalWidth - ((this.state.hashtags.length - 1) * 10);
            // @ts-ignore
            this.input.current.style.textIndent = x + 'px';
            // @ts-ignore
            this.input.current.value = this.state.text;
        });
    }

    public addHashtag(text: string): void {
        if (!this.state.hashtags.includes(text)) {
            this.state.hashtags.push(text);
            this.state.widths.push(0);
            this.setState({text: ''});
            // @ts-ignore
            this.forceUpdate(() => this.input.current.value = '');
            this.updateIndent();
        }
    }

    public deleteHashtag(): void {
        this.state.hashtags.pop();
        this.state.widths.pop();
        this.setState((state, props) => {
            return {totalWidth: 0 === state.widths.length ? 0 : state.widths.map((width: number) => width).reduce((width: number, nextWidth: number) => width + nextWidth)};
        });
        this.updateIndent();
    }

    public async updateHashtags(event: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (13 === event.keyCode) {
            event.preventDefault();
            // @ts-ignore
            this.addHashtag((event as KeyboardEvent).target.value);
        } else if (8 === event.keyCode) {
            // @ts-ignore
            if ('' === this.input.current.value && 0 !== this.state.hashtags.length) {
                event.preventDefault();
                this.deleteHashtag();
            }
        }
    }

    public updateTotalWidth(text: string, hashtagBoxWidth: number): void {
        this.setState((state, props) => {
                state.widths[this.state.hashtags.indexOf(text)] = hashtagBoxWidth;
                return {totalWidth: state.widths.map((width: number) => width).reduce((width: number, nextWidth: number) => width + nextWidth)}
            },
            () => (document.getElementById('search') as HTMLInputElement).value = '');
        this.updateIndent();
    }

    public renderHashtags(): ReactNode {
        const res = this.state.hashtags.map(
            (hashtag: string) => <Hashtag
                key={hashtag}
                text={hashtag}
                updateWidth={this.updateTotalWidth}
                remove={this.deleteHashtag}
            />
        );
        return res;
    }

    public render(): ReactNode {
        return (
            <form
                className="form-inline my-lg-0 my-md-0 my-sm-2 my-xs-2 col-lg-5 col-md-5 col-sm-6 col-xs-6 offset-lg-1 offset-md-1 offset-sm-0 offset-xs-0">
                <label id="search-icon" htmlFor="search">
                    <span className="glyphicon glyphicon-search search-icon"></span>
                    <span
                        id="search-placeholder">{this.state.text === '' && 0 === this.state.hashtags.length ? 'Search...' : ''}</span>
                </label>
                {this.renderHashtags()}
                <input id="search" className="form-control col-lg-12 w-75 mr-sm-2" type="search"
                       aria-label="Search"
                       onChange={event => this.write(event)}
                       value={this.state.text}
                       onKeyDown={this.updateHashtags}
                       ref={this.input}
                />
            </form>
        );
    }
}

export default SearchBar;
