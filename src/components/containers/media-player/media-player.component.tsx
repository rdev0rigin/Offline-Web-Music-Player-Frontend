import * as React from 'react';
import { ReactElement } from 'react';
import * as Rx from '@reactivex/rxjs';
import { getSoundsMetaData } from '../../../services/main.service';
import { PlayListControlledComponent } from '../../controlled/playlist/playlist.compnent';
import { AudioVisualizerComponent } from '../../controlled/visualizer/visualizer.component';
import { SoundMeta } from '../../../models/sound.model';
import { MEDIA_PLAYER_INITIAL_STATE, MediaPlayerProps, MediaPlayerState, } from '../../../models/media-player.model';
import { enlargeSVG, ffwdSVG, nextSVG, playSVG, prevSVG, rewindSVG, stopSVG, volumeMaxSVG } from '../../../assets/svgs';
import { formatSeconds } from '../../../utilities/utilities';
import { Observable } from '@reactivex/rxjs';

export class MediaPlayerComponent extends React.Component<MediaPlayerProps, MediaPlayerState> {
	public state: MediaPlayerState;
	private sound: Howl;
	private ctx$: Observable<Uint8Array>;
	private seekTimer: any;

	public constructor(public props) {
		// noinspection TypeScriptValidateTypes
		super(props);
		this.selectionHandler = this.selectionHandler.bind(this);
		this.seekUpdater = this.seekUpdater.bind(this);
		this.onSoundLoad = this.onSoundLoad.bind(this);
		this.state = MEDIA_PLAYER_INITIAL_STATE;
	}

	public componentDidMount(): void {
		getSoundsMetaData((metaDataArray: SoundMeta[]) => {
			if (Array.isArray(metaDataArray) && metaDataArray.length > 0) {
				this.setState({
					playList: metaDataArray,
					dataReady: true
				});
				this.sound = new Howl({
					src: this.trackDataURLBuilder(metaDataArray[0]._id)
				});
			} else {
				this.setState({
					playList: [],
					dataReady: true
				})
			}
		});
	}

	public componentWillUnmount(): void {
		clearInterval(this.seekTimer);
	}

	public render(): ReactElement<HTMLElement> {
		if (this.state.dataReady) {
			return (
				<div
					id='Media-Player'
					className="media-player-container"
					style={{...this.props.style}}
				>
					<AudioVisualizerComponent
						contextStream={this.ctx$}
						streamType={'Uint8Array'}
					/>
					{this.renderControls()}
					<PlayListControlledComponent

						tracks={this.state.playList}
						selectionHandler={this.selectionHandler}
					>
					</PlayListControlledComponent>
				</div>
			);
		} else {
			return null;
		}
	}

	private trackURL(trackId): string {
		return `http://localhost:8080/${trackId}/mp3/${trackId}.mp3`;
	}

	private trackDataURLBuilder(soundId: string): string {
		return `//localhost:8081/${soundId}/mp3/${soundId}.mp3`;
	}

	private onSoundLoad(): void {
		this.seekUpdater()
			.subscribe((res) => {
				console.log('interval!', res);
				this.setState({
					currentSeek:res
				});
			});
		this.ctxUpdater()
			.updater$.distinctUntilChanged()
			.subscribe
			(val => console.log('ctx', val));
	}

	private loadTrack(dataString: string, soundDetails: SoundMeta) {
		if (this.sound) {
			this.sound.unload();
		}
		this.sound = new Howl({
			src: dataString,
			html5: true,

		});
		this.sound.play();
		this.setState({
			dataReady: true,
			currentTrack: soundDetails
		}, this.onSoundLoad);
	}

	private ctxUpdater(): { updater$: Observable<Uint8Array>, stop: () => void } {
		let updateLoop;
		let analyzer = Howler.ctx.createAnalyser();
		analyzer.fftSize = 256;
		analyzer.smoothingTimeConstant = 1;
		analyzer.maxDecibels = 1;
		analyzer.minDecibels = 0;
		let altCount = analyzer.frequencyBinCount;
		let data = new Uint8Array(altCount);
		Howler.masterGain.connect(analyzer);
		analyzer.connect(Howler.ctx.destination);

		return {
			updater$: Observable.create(observer => {
				updateLoop = setInterval(
					() => {
						analyzer.getByteFrequencyData(data);
						observer.next(data);
					},
					100);
			}),
			stop: (): void => {
				clearInterval(updateLoop);
			}
		};
	}

	private seekUpdater(): Observable<number> {
		// noinspection TypeScriptUnresolvedFunction
		return Observable
			.interval(10)
			.map(() => {
				// return Math.trunc(this.sound.seek() as number)
				return this.sound.seek() as number;
			})
			.distinctUntilChanged();
	}

	private async selectionHandler(evt: React.SyntheticEvent<MouseEvent> | any, track: SoundMeta): Promise<void> {
		this.setState({
			dataReady: false
		});
		this.loadTrack(this.trackURL(track._id), track);
	}

	private async controlHandler(type: string): Promise<void> {
		let prevIndex, nextIndex, newSeek;
		prevIndex = (0 === this.state.currentIndex)
			? this.state.playList.length - 1
			: this.state.currentIndex - 1;
		this.setState({
			currentIndex: prevIndex
		});
		nextIndex = (this.state.currentIndex === this.state.playList.length - 1)
			? 0
			: this.state.currentIndex + 1;
		this.setState({
			currentIndex: nextIndex
		});

		if (this.sound.state() === 'loaded') {
			let dataResponse;

			switch (type) {
				case'prev':
					this.sound.unload();
					this.sound = new Howl({
						src: this.trackDataURLBuilder(prevIndex),
						html5: true
					});
					break;

				case'back':
					newSeek = Math.trunc(this.sound.seek() as number - 10);
					this.sound.seek(Math.trunc(newSeek > this.sound.duration() ? this.sound.pause() : newSeek));
					break;

				case'play-pause':
					this.sound.playing() ? this.sound.pause() : this.sound.play();
					break;

				case'forward':
					console.log(this.sound.seek());
					newSeek = this.sound.seek() as number + 10;
					this.sound.seek(Math.trunc(newSeek > this.sound.duration() ? this.sound.pause() : newSeek));
					break;

				case'next':
					this.sound.unload();
					this.sound = new Howl({
						src: this.trackDataURLBuilder(this.state.playList[nextIndex]._id)
					});
					break;

				default:
					console.log('error: unknown control type', type);
			}
		}
	}

	private renderDisplay(): ReactElement<HTMLDivElement> {
		return (
			<div
				className="media-player-d"
			>
				{this.state.currentTrack.title || 'no title . . .'}
				{this.state.currentTrack.description || 'no description . . . '}
			</div>
		);
	}

	private renderControls(): ReactElement<HTMLDivElement> {
		return (
			<div
				className="controls-container"
			>
				<div
					className="mid-panel"
				>
					<div
						className="volume"
					>
						{volumeMaxSVG}
						<input
							id="Volume-Range"
							type="range"
							step={0.001}
							min={0}
							max={1}
							onChange={(e) =>
								this.sound.volume(e.target.valueAsNumber)}
						/>
					</div>
					<div
						className="full"
					>
						{enlargeSVG}
					</div>
					{this.renderDisplay()}
				</div>
				<div
					className="bottom-panel"
				>
					<span
						className="offset-0"
					/>
					<div
						className="prev"
						onClick={(evt) => {
							this.controlHandler('prev');
						}}
					>
						{prevSVG}
					</div>
					<div
						className="back"
						onClick={(evt) => {
							this.controlHandler('back');
						}}
					>
						{rewindSVG}
					</div>
					<div
						className="play-pause"
						onClick={() => {
							this.controlHandler('play-pause');
						}}
					>
						{this.sound && this.sound.playing() ? stopSVG : playSVG}
					</div>
					<div
						className="forward"
						onClick={(evt) => {
							this.controlHandler('forward');
						}}
					>
						{ffwdSVG}
					</div>
					<div
						className="next"
						onClick={(evt) => {
							this.controlHandler('next');
						}}
					>
						{nextSVG}
					</div>
				</div>
				<div
					className="top-panel"
				>
					{this.renderDurationRange()}
				</div>
			</div>
		);
	}

	private renderDurationRange(): ReactElement<HTMLElement> {
		return (
			<div
				className="duration-range"
			>
				<input
					type="range"
					value={this.state.currentSeek}
					min={0}
					max={!!this.sound ? this.sound.duration() : 0}
					step={0.1}
					onChange={(e) => {
						this.sound.seek(parseInt(e.target.value, 8));
					}}
				/>
				<div className="time">
					<div
						className="current"
					>
						{formatSeconds(this.state.currentSeek)}
					</div>
					<div
						className="duration"
					>
						{formatSeconds(!!this.sound ? this.sound.duration() : 0)}
					</div>
				</div>
			</div>
		);
	}
}
