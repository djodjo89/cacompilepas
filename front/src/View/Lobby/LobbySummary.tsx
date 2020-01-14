import React, {ReactNode} from "react";
import LobbyDivider from "./LobbyDivider";

class LobbySummary extends React.Component<{ courseSheets: [] }, any> {
    constructor(props: any) {
        super(props);
        this.renderList = this.renderList.bind(this);
    }

    public renderList(): ReactNode {
        let res = [], i = 0;
        for (let courseSheet of this.props.courseSheets) {
            res.push(<li key={i}><p className={'mb-0'}>{courseSheet['title']}</p></li>);
            i++;
        }
        return res;
    }

    public render(): ReactNode {
        return (
            <section className={'col-lg-12 col-sm-12 pl-0 ml-0' + (0 !== this.props.courseSheets.length ? ' mt-sm-2' : '')}>
                {
                    0 !== this.props.courseSheets.length ?
                        <div className={'row container-fluid'}>
                            <div className={'col-12 pl-0 pl-lg-4 pl-md-4 pl-sm-0'}>
                                <h2 className={'text-left mb-0 mt-0 ml-lg-0 ml-md-0 ml-sm-4'}>Sommaire</h2>
                            </div>
                            <div className={'col-12 pl-0 pl-lg-4 pl-md-4 pl-sm-0'}>
                                <ul className={'lobby-summary-list list-unstyled text-left mt-3 ml-1 ml-lg-0 ml-md-0 ml-sm-4'}>
                                    {this.renderList()}
                                </ul>
                            </div>
                            <div className={'col-12 pr-0 mr-0 pl-0 pl-lg-4 pl-md-4 pl-sm-4'}>
                                <LobbyDivider
                                    containerClassName={'pr-0'}
                                    dividerClassName={'pr-0'}
                                />
                            </div>
                        </div>
                        :
                        <div></div>
                }
            </section>
        );
    }
}

export default LobbySummary;
