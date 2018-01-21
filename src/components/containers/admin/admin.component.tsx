import * as React from 'react';
import { ReactElement } from 'react';
import { getSoundsMetaData } from '../../../services/main.service';
import { pauseSVG, playSVG } from '../../../assets/svgs';
import { Howl } from 'howler';
import { ADMIN_INITIAL_STATE, AdminComponentProps, AdminComponentState } from '../../../models/admin.model';
import { testAndSetAudioProps } from '../../../utilities/utilities';
import { SoundMeta } from '../../../models/sound.model';
import { authorize, removeSound, submitNewSound, updateTrackProp } from '../../../services/admin.services';
import { ResponseTransport } from '../../../services/web-socket.service';

export class AdminComponent extends React.Component<AdminComponentProps, AdminComponentState> {
	private title: string = '';
	private description: any;
	private sound: Howl = new Howl({
		src: '#',
	});

	constructor(public props: any) {
		// noinspection TypeScriptValidateTypes
		super(props);
		this.state = ADMIN_INITIAL_STATE;
		this.soundsMetaCallback = this.soundsMetaCallback.bind(this);
		this.newSoundHandler = this.newSoundHandler.bind(this);
		this.deletionHandler = this.deletionHandler.bind(this);
	}

	public componentDidMount(): void {
		authorize((authorized: ResponseTransport) => {
			if (!authorized.ok) {
				this.props.history.goBack();
			} else {
				getSoundsMetaData(this.soundsMetaCallback);
			}
		});
	}

	public render(): ReactElement<HTMLDivElement> {
		return (
			<div
				className="admin-component"
			>
				{this.renderNewTrackForm()}
				<h2>Current Tracks Uploaded</h2>
				{this.state.dataReady ? this.RenderTrackDetails() : null}
			</div>
		);
	}

	private soundsMetaCallback(soundsMeta: SoundMeta[]): void {
		console.log('sounds', soundsMeta);
		if (Array.isArray(soundsMeta) && soundsMeta.length > 0) {
			this.setState({
				tracks: soundsMeta,
				dataReady: true
			});
		} else {
			this.setState({
				tracks: [],
				dataReady: true
			});
		}
	}

	private deletionHandler(response: any): void {
		console.log('deletion response', response);
		const nextTracks = this.state.tracks.filter(track => track._id !== response.sound_id);
		console.log('next tracks', nextTracks);
		this.setState({
			tracks: nextTracks
		}, () => {
			console.log('set state called!');
		});

	}

	private newSoundHandler(response: SoundMeta): void {
		this.setState({
			tracks: [...this.state.tracks, response]
		});
	}

	private async onSubmit(e: React.SyntheticEvent<MouseEvent>): Promise<void> {
		const fileInputEle: HTMLInputElement = document.getElementById('New-Sound') as HTMLInputElement;
		const soundFile: File = fileInputEle.files[0];
		const soundProps = await testAndSetAudioProps(soundFile)
			.catch(err => console.log('Error: Test and get audio.', err));
		const soundMeta = {
				...soundProps,
				title: this.title,
				description: this.description
		};
		if (soundFile.size < 2 * (1024 * 1000 * 1000)) {
			console.log('submitting, ', soundMeta, soundFile);
			submitNewSound(soundMeta, soundFile, this.newSoundHandler);
		} else {
			alert('File size must be under 2GBs, please.');
		}
	}

	private onPlay(e: React.SyntheticEvent<MouseEvent>, id: string) {
		if (this.state.currentTrack._id !== id) {
			this.sound.unload();
		} else {
			if (this.sound.playing()) {
				this.sound.play();
			} else {
				this.sound.pause();
			}
		}
	}

	private renderNewTrackForm(): ReactElement<HTMLDivElement> {
		return (
			<div
				className="new-track-form"
			>
				<h4>Add A New Track</h4>
				<label>Title</label>
				<input
					className="title-input text-input center-ele"
					onChange={(e) => {
						this.title = e.target.value;
					}}
				/>
				<label>Description</label>
				<div
					contentEditable={true}
					className="description-input text-input"
					id="Description-Input"
					onBlur={(e: any) => {
						this.description = e.target.outerText;
					}}
				/>
				<div
					className="file-submit"
				>
					<div
						className="new-file"
					>
						<label>Sound File</label>
						<input
							type="file"
							id="New-Sound"
						/>
					</div>
					<div>
						<div
							onClick={(e: any) => {
								this.onSubmit(e);
							}}
						>
							Submit
						</div>
					</div>
				</div>
			</div>
		);
	}

	private RenderTrackDetails(): ReactElement<HTMLDivElement> {
		return (
			<div className="track-details-container">
				{this.state.tracks.map(sound => {
					return <div
						key={sound._id.toString()}
						className="track-details"
					>
						<div
							className="delete-button"
							onClick={(e) => {
								console.log('delete track', sound._id);
								removeSound(sound._id, this.deletionHandler);
							}}
						>
							X
						</div>
						<div
							className="track-play"
							onClick={(e: any) => {
								this.onPlay(e, sound._id);
							}}
						>
							{(
								this.state.currentTrack._id === sound._id)
							&& (this.sound.playing())
								? pauseSVG
								: playSVG
							}
						</div>
						<div
							className="track-form"
						>
							<label>Title:</label>
							<div
								className="track-title"
								contentEditable={true}
								suppressContentEditableWarning={true}
								onBlur={(e: any) => {
									updateTrackProp({
										...sound,
										title: e.target.value
									} as SoundMeta);
								}}
							>
								{sound.title}
							</div>
							<label>Description:</label>
							<div
								className="track-description"
								contentEditable={true}
								suppressContentEditableWarning={true}
								onBlur={(e: any) => {
									updateTrackProp({
										...sound,
										description: e.target.value,
									} as SoundMeta);
								}}
							>
								{sound.description}
							</div>
						</div>
					</div>;
				})}
			</div>
		);
	}
}
