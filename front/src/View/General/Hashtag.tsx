import React, {ReactNode, Ref} from 'react';
import {ReactComponent as Cross} from "../../img/cross.svg";
import '../../css/Hashtag.css';

interface HashtagProps {
    text: string,
    updateWidth: any,
    remove: any,
    className: string,
}

class Hashtag extends React.Component<HashtagProps, { width: number }> {
    private hashtagBox: Ref<HTMLDivElement>;

    public constructor(props: any) {
        super(props);
        this.state = {
            width: 0,
        }
        this.hashtagBox = React.createRef();
    }

    public componentDidMount(): void {
        // @ts-ignore
        let box: any | null = this.hashtagBox.current;
        let marginLeft: string = window.getComputedStyle(box).marginLeft.substr(0, (window.getComputedStyle(box).marginLeft).length - 2);
        let ml: number = +marginLeft;
        let paddingLeft: string = window.getComputedStyle(box).paddingLeft.substr(0, (window.getComputedStyle(box).paddingLeft).length - 2);
        let pl: number = +paddingLeft;
        let paddingRight: string = window.getComputedStyle(box).paddingRight.substr(0, (window.getComputedStyle(box).paddingRight).length - 2);
        let pr: number = +paddingRight;
        let marginRight: string = window.getComputedStyle(box).marginRight.substr(0, (window.getComputedStyle(box).marginRight).length - 2);
        let mr: number = +marginRight;
        this.setState(
            {
                width:
                    ml +
                    pl +
                    box.clientWidth +
                    pr +
                    mr
            },
            () => this.props.updateWidth(this.props.text, this.state.width));
    }

    public render(): ReactNode {
        let div = (
            <div key={this.props.text}
                 className={'rounded p-1 pl-2 pr-2 m-1 hashtagBox ' + this.props.className}
                 ref={this.hashtagBox}
            >
                        <span className={'hashtag'}>
                            {this.props.text}
                        </span>
                <span style={{paddingLeft: '6px', paddingRight: '2px',}} onClick={this.props.remove}><Cross/></span>
            </div>
        );
        return div;
    }
}

export default Hashtag;
