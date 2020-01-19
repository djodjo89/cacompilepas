import React, {ReactNode} from 'react';
import {MdMoreHoriz} from 'react-icons/md';

class BreadCrumCollapser extends React.Component<any, any> {
    public render(): ReactNode {
        return (
            <li className={'breadcrumb-collapser'} {...this.props}>
                <MdMoreHoriz/>
            </li>
        );
    }
}

export default BreadCrumCollapser;
