import React, {ReactNode} from 'react';

class BreadcrumbSeparator extends React.Component<any, any>{
    public render(): ReactNode {
        return (
            <li className={'breadcrumb-separator'} {...this.props}>
                {this.props.children}
            </li>
        );
    }
}

export default BreadcrumbSeparator;
