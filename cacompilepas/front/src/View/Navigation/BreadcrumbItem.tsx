import React, {ReactNode} from 'react';

class BreadcrumbItem extends React.Component<any, any> {
    public render(): ReactNode {
        return (
            <li {...this.props}>
                {this.props.children}
            </li>
        );
    }
}

export default BreadcrumbItem;
