import * as React from 'react';
import {dcompBrandSVG} from '../../../assets/svgs';
import history from '../../../routers/router.history';
import { ReactElement } from 'react';

// To suppress TS error for window
declare var window: any;

export class Navbar extends React.Component {
	constructor(public props){
		super(props);
	}

	private shareLinks: () => string[] = (): any[]  => Object.keys(this.props.shareLinksMap)
		.map(key => this.props.shareLinksMap[key]);

	private shareHandler(url: string): void {
		window.open(url);
	}

	private onShareLinkClick(url: string, handler: ((url: string, options?: {}) => void) = this.shareHandler) {
		// update owner stats
		handler(url);
	}

	public render(): ReactElement<HTMLDivElement> {
		return(
			<div
				id="Navbar"
				className={
					this.props.show
						? 'navbar-sticky show'
						: 'navbar-sticky'
				}
				style={this.props.style ? this.props.style : {}}
			>
				<div
					className="nav-list"
				>
					{history.location.pathname === '/'
						? (<div
							className="nav-item nav-button"
							onClick={() => {
								const eleRef = document.getElementById('About');
								const scrollDist =  eleRef.offsetTop - window.innerHeight + window.innerHeight;
								window.scroll({
									top: scrollDist,
									left: 0,
									behavior: 'smooth'
								})
							}}
						>
							About
						</div>
						) : (
							<div
								className="nav-item nav-button"
								onClick={() => {
									history.push('/');
								}}
							>
								Home
							</div>
						)}
					<div
						className="logo center-ele">
						{dcompBrandSVG}
					</div>
					<div
						className="nav-item share"
					>
						Share
						<div
							className="share-drop-down"
						>
							{this.shareLinks()
								.map((shareLink:any) => {
									return(
										<div
											key={shareLink.id.toString()}
											className="share-link"
											onClick={() => this.onShareLinkClick(shareLink.link)}
										>
											{shareLink.icon}
										</div>
									);
								})
							}
						</div>
					</div>


				</div>
			</div>
		);
	}
}
