import * as React from 'react';
import { ReactElement } from 'react';
import * as moment from 'moment';
import { Link } from 'react-router-dom';

export class FooterComponent extends React.Component {

	constructor(public props: {[key: string]: any}) {
		super(props);
	}

	public render(): ReactElement<HTMLDivElement> {

		return (
			<div
				id="Footer"
				className="footer-component"
				style={this.props.style}
			>
				<div className="lists">
					<div className="site-help">
						<h4>Site Map</h4>
						<Link to={'/'}>Home</Link>
						<Link to={'/about'}>About</Link>
						<Link to={'/contact'}>Contact</Link>
						<Link to={'/music/demo'}>RDev;)'s Player</Link>
					</div>
					<div className="citations">
						<h4>Friends</h4>
						<Link to="//rdev.rocks">R Development</Link>
						<Link to="#">Friend</Link>
						<Link to="#">Friend</Link>
						<Link to="#">Friend</Link>
					</div>
				</div>
				<hr/>
				<div
					className="copy-rights"
				>
					All Rights Reserved 2017 <span className={'copyright'}>©</span> This site was
					updated {moment(Date.now()).format('ll')}
				</div>
				<div
					className="last-update"
				/>
			</div>
		);
	}
}