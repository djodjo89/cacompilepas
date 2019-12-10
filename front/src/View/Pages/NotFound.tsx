import React, {ReactNode} from 'react';

class NotFound extends React.Component {
    private readonly match: string;

    public constructor(props: any) {
        super(props);
        this.match = '/' + window.location.href.split(/\//)[3];
    }

    public render(): ReactNode {
        return (
            <div>
                <h3>
                    La page {this.match} n'existe pas, veuillez réessayer
                </h3>
            </div>
        );
    }
}

export default NotFound;
