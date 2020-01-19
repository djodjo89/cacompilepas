import React, {ReactNode} from 'react'
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';
import BreadCrumCollapser from './BreadCrumCollapser';

interface BreadcrumbProps {
    itemsBefore: number,
    itemsAfter: number,
    max: number,
    className?: string,
    separator: string,
    children: any,
}

interface BreadcrumbState {
    expanded: boolean,
    children: any[],
}

class Breadcrumb extends React.Component <BreadcrumbProps, BreadcrumbState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            expanded: 1 !== React.Children.toArray(this.props.children).length,
            children: React.Children.toArray(this.props.children),
        }
    }

    public renderChildren(): ReactNode {
        let children: any[] = [];
        console.log('length');
        console.log(this.state.children.length);
        if (1 > this.state.children.length) {
            children = this.state.children.map((child: any, index: number) =>
                <BreadcrumbItem key={`breadcrumb-item-${index}`}>
                    {child}
                </BreadcrumbItem>
            ).reduce((acc: any, child: any, index: number) => {
                acc.push(child, index !== this.state.children.length - 1
                    ? <BreadcrumbSeparator key={'breadcrumb-separator-' + index}>
                        {this.props.separator}
                    </BreadcrumbSeparator>
                    : '');
                return acc;
            }, []);
        } else if (1 === this.state.children.length) {
            // @ts-ignore
            children.push(
                <BreadcrumbItem key={`breadcrumb-item-0`}>
                    {this.props.children[1]}
                </BreadcrumbItem>,
                <BreadcrumbSeparator key={'breadcrumb-separator-' + 0}>
                    {this.props.separator}
                </BreadcrumbSeparator>);
        } else if (0 === this.state.children.length) {
            console.log('eiogfhezougheouzghiuerhgoerhug')
            return <div></div>;
        }


        if (3 >= this.state.children.length && !this.state.expanded || this.state.children.length >= this.props.max) {
            children = [
                ...children.slice(0, this.props.itemsBefore * 2),
                <BreadCrumCollapser
                    title={'Expand'}
                    key={'collapsed-separator'}
                    onClick={() => this.setState({expanded: true})
                    }
                />,
                ...children.slice(children.length - (this.props.itemsAfter * 2) - 1, children.length),
            ]
        }

        return children;
    }

    public render(): ReactNode {
        return (
            <ol className={'pl-1 pl-lg-4 pl-md-4 pl-sm-4 ' + this.props.className}>
                {this.renderChildren()}
            </ol>
        );
    }
}

export default Breadcrumb;