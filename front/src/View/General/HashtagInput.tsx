import React, {ChangeEvent, ReactNode, Ref} from "react";
import Hashtag from "./Hashtag";

interface HashtagInputProps {
    id: string,
    className: string,
    type: string,
    baseIndent: number,
    onUpdate: any,
    updateHashtagsView: any,
    updateHashtags: any,
    updateText: any,
    hashtagClassName: string,
}

interface HashTagInputState {
    text: string,
    hashtags: string[],
    widths: number[],
    totalWidth: number,
}

class HashtagInput extends React.Component<HashtagInputProps, HashTagInputState> {
    private input: Ref<HTMLInputElement>;

    public constructor(props: any) {
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
        this.deleteHashtags = this.deleteHashtags.bind(this);
        this.updateHashtags = this.updateHashtags.bind(this);
        this.updateIndent = this.updateIndent.bind(this);
        this.updateTotalWidth = this.updateTotalWidth.bind(this);
        this.deleteHashtagByClick = this.deleteHashtagByClick.bind(this);
        this.updateView = this.updateView.bind(this);
    }

    public write(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({text: event.target.value});
        this.props.updateText(event.target.value);
        // @ts-ignore
        if ('' === this.input.current.value && 0 === this.state.hashtags.length) {
            this.props.onUpdate(true);
        } else {
            this.props.onUpdate(false);
        }
        this.props.updateHashtagsView(this.renderHashtags());
    }

    public componentDidMount(): void {
        this.updateIndent();
    }

    public updateIndent(): void {
        this.forceUpdate(() => {
            let x: number = 0 === this.state.totalWidth ? this.props.baseIndent : this.props.baseIndent - 3 + this.state.totalWidth - ((this.state.hashtags.length - 1) * 10);
            // @ts-ignore
            this.input.current.style.textIndent = x + 'px';
            // @ts-ignore
            this.input.current.value = this.state.text;
        });
    }

    public addHashtag(text: string): void {
        if (!this.state.hashtags.includes(text) && text.includes('#')) {
            let tags: string[] = text.split(/ /);
            tags.map(tag => {
                if ('#' === tag.charAt(0)) {
                    this.state.hashtags.push(text.substr(1, text.length - 1));
                    this.state.widths.push(0);
                    this.setState((state, props) => {
                        return {text: state.text.replace(tag, '')};
                    });
                    this.props.updateText('');
                    this.props.updateHashtags(this.state.hashtags);
                    // @ts-ignore
                    this.forceUpdate(() => this.input.current.value.replace(tag, ''));
                    this.updateView();
                }
            });
        }
    }

    public updateView(): void {
        this.setState((state, props) => {
            return {totalWidth: 0 === state.widths.length ? 0 : state.widths.map((width: number) => width).reduce((width: number, nextWidth: number) => width + nextWidth)};
        });
        this.updateIndent();
        this.props.updateHashtagsView(this.renderHashtags());
    }

    public deleteHashtagByClick(event: React.MouseEvent<HTMLOrSVGElement>): void {
        let content: string;
        let target: any = event.target;
        if (undefined === target.parentElement.firstElementChild.innerText) {
            content = target.parentElement.parentElement.parentElement.firstElementChild.innerText;
            if ('' === content) {
                content = target.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText;
                if ('' === content) {
                    content = target.parentElement.parentElement.firstElementChild.innerText;
                }
            }
        } else {
            content = target.parentElement.firstElementChild.innerText;
        }
        content = content.substr(1, content.length - 1);
        this.deleteHashtags(content);
    }

    public deleteHashtagOnKeyPressed(text: string): void {
        this.deleteHashtags(text);
    }

    public deleteHashtags(text: string): void {
        let index: number = this.state.hashtags.indexOf(text);
        this.state.hashtags.splice(index, 1);
        this.state.widths.splice(index, 1);
        this.props.updateText('');
        this.props.updateHashtags(this.state.hashtags);
        this.updateView();
        if ('' === this.state.text && 0 === this.state.hashtags.length) {
            this.props.onUpdate(true);
        }
    }

    public async updateHashtags(event: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (13 === event.keyCode) {
            event.preventDefault();
            // @ts-ignore
            this.addHashtag((event as KeyboardEvent).target.value);
        } else if (8 === event.keyCode) {
            // @ts-ignore
            if (('' === this.input.current.value && 0 !== this.state.hashtags.length) || 0 === this.input.current.selectionStart) {
                event.preventDefault();
                this.deleteHashtags(this.state.hashtags[this.state.hashtags.length - 1]);
            }
        }
        this.updateView();
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
        return this.state.hashtags.map(
            (hashtag: string) => {
                return <Hashtag
                    key={hashtag}
                    text={hashtag}
                    updateWidth={this.updateTotalWidth}
                    isRemovable={true}
                    remove={this.deleteHashtagByClick}
                    className={this.props.hashtagClassName}
                />
            }
        );
    }

    public render(): ReactNode {
        return (
            <input id={this.props.id}
                   className={this.props.className}
                   type={this.props.type}
                   onChange={event => this.write(event)}
                   value={this.state.text}
                   onKeyDown={this.updateHashtags}
                   ref={this.input}
            />
        );
    }
}

export default HashtagInput;
