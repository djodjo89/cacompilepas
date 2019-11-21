import React from 'react';

class Action extends React.Component {
    constructor(props) {
        super(props);
        this.displayIfActionMatches = this.displayIfActionMatches.bind(this);
    }
    displayIfActionMatches() {
        if (this.props.action === document.URL.split(/\//)[4])
            return this.props.children;            
    }
    render() {
        return(
            <div>
                { this.displayIfActionMatches() }
            </div>
        )
    }
}

export default Action;