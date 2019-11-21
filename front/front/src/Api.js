import React from 'react';

class Api extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			domain: 'localhost:80',
			route: '' === this.props.route ? '/' : this.props.route,
			data: null
		}
		this.fetch = this.fetch.bind(this);
		this.fetch();
	}
	fetch() {
		fetch(this.state.domain + this.state.route, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({pseudo: 'djodjo', password: 'toto' })
		})
		.then(response => response.json())
		.then(data => this.setState({ data: data }))
		.catch(netWorkError => console.log(netWorkError));
	}
	render() {
		return (
			<div></div>
		)
	}
}

export default Api;