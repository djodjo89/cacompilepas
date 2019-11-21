import React from 'react';

class Route extends React.Component {
  constructor(props) {
    super(props);
    this.displayIfURLPathMatches = this.displayIfURLPathMatches.bind(this);
  }
  displayIfURLPathMatches() {
    if (this.props.path === '/' + document.URL.split(/\//)[3] || undefined === this.props.path)
      return this.props.children;
  }
  render() {
    return (
      <div>
        { this.displayIfURLPathMatches() }
      </div>
    )
  }
}

export default Route;