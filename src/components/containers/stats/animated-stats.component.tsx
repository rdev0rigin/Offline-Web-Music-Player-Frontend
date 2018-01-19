import * as React from "react";

/**
 * AnimatedTotalBadge<UX Component> - Renders provided icons and labels with a counter that increments
 * to a provided total.
 */
export class AnimatedTotalBadge extends React.Component {
	public state: {
		count: number;
	};
	private count = 0;
	private countInterval;

	constructor(public props) {
		super(props);
		this.state = {
			count: 0
		}
	}

	public componentDidMount(): void {
		this.setState({count: this.count});
		if (this.props.total) {
			this.counter();
		}
	}

	public componentWillUnmount(): void {
		clearInterval(this.countInterval);
	}


	private counter(): void {
		this.countInterval = setInterval(() => {
			this.count++;
			this.setState({count: this.count});
			if (this.count >= this.props.total) {
				clearInterval(this.countInterval);
			}
		}, 50);
	}

	public render(): React.ReactElement<any> {
		return (
			<div
				className='animated-total-badge'>
				<div className="badge-icon">
					{this.props.icon}
					<div className="label">{this.props.label}</div>
				</div>
				<div className="count">{this.state.count}</div>
			</div>
		);
	}
}