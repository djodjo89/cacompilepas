import React from 'react';
import LargeDivider from './LargeDivider';

class Footer extends React.Component {
	render() {
		return (
			<footer className="container-fluid">
				<div className="row">
					<div className="col-lg-12 mt-lg-5 mb-lg-5">
						<div className="col-lg-2"></div>
						<LargeDivider/>
					</div>
				</div>
				<div className="row text-center ml-lg-5">
						<p className="col-lg-3 offset-lg-2">Documentation</p>
						<p className="col-lg-3">Copyrights</p>
						<p className="col-lg-3" >Contact</p>
				</div>
			</footer>
		)
	}
}

export default Footer;
