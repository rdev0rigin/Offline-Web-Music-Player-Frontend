import { ReactElement } from 'react';
import  * as React from 'react';
import { Observable } from '@reactivex/rxjs';

/* tslint:disable */
export class AudioVisualizerComponent extends React.Component {
	public state: {
		[name: string ]: any
		// analyzer: any;
		// length: number;
		// barVals: any[];
	} = {
		// analyzer: [],
		// length: 0,
		// barVals: []
	};

	constructor(public props){
		super(props);
	}

	private barUpdater(): void {
		this.props.subscribe(async (data: Uint8Array) => {
			if(data){
				let update = [];
				for(let val in data){
					update = [...update, val];
				}
				this.setState({barVals: update})
			}
		});
	}

	private renderPitchBar(magnitude: number, color: string, key: string): any {
		return(
			<div
				key={key}
				className="visualizer-bar"
				style={{width: '10px', height: magnitude.toString(), background: color.toString() || 'blue'}}
			/>
		);
	}

	public render(): ReactElement<HTMLDivElement> {
		if(this.state.analyzer){
			let counter = 0;
			return (
				<div
					className="visualizer-container"
					style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
				>
					{this.state.barVals.map(val => {
						this.renderPitchBar(val, 'red', (counter++).toString());
					})}
				</div>
			)
		} else {
			return(
				<div className="empty-visualizer" />
			)
		}
	}
}

// for use in a classes
/**
 *
 * @returns {{contextStream: Observable<Uint8Array>}}
 */
export function buildViz$(ctx, source, frameRate: number): {analyzerData$?: Observable<Uint8Array>; error?: string} | any
{
	let loop;
	function setLoop(id, func): any {
		return {[id]: () => {
			setInterval(() => {
				func();
			}, 50)}
		};
	}
	if(ctx){
		const analyser = ctx.createAnalyser();
		const analyzerStream = Observable.create(observer => {
			Howler.masterGain.connect(analyser);
			analyser.connect(ctx.destination);
			analyser.fftSize = 2048;
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			setLoop(loop, () => {
				analyser.getByteFrequencyData(dataArray);
				observer.next(dataArray);
			});

		});
		return {analyzerData$: analyzerStream, onComplete: () => {clearInterval(loop)}};
	} else  {
		return {analyzerData$: Observable.of([]), error: 'no audio context available'};
	}
}