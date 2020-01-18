import React, {ReactNode} from 'react';

class NotFound extends React.Component<any, {match: string}> {

    public constructor(props: any) {
        super(props);
        this.state = {
            match: '/' + window.location.href.split(/\//)[3],
        }
    }

    public render(): ReactNode {
        return (
            <div>
                <h3>
                    La page {this.state.match} n'existe pas, veuillez réessayer
                </h3>
            </div>
        );
    }
}

export default NotFound;
