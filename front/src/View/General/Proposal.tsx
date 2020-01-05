import React, {ReactNode} from "react";

class Proposal extends React.Component<{ id: number, content: string }, any> {
    public render(): ReactNode {
        return (
            <a
                href={'/lobby/' + this.props.id}
            >
                <div
                    className={'pl-sm-1 pt-sm-2 proposal'}
                >
                    {this.props.content}
                </div>
            </a>
        );
    }
}

export default Proposal;
