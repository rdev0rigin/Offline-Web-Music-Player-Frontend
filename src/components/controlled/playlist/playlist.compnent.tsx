
import * as React  from 'react';
import { downloadSVG, heartSVG, musicSVG, shareSVG } from '../../../assets/svgs';
import { SoundMeta } from '../../../models/sound.model';
import { Track } from '../../../models/track.model';
import { AnimatedTotalBadge } from '../../containers/stats/animated-stats.component';
import { ReactElement } from 'react';

export const PlayListControlledComponent = (props: {
	tracks: SoundMeta[];
	selectionHandler?: (evt: React.SyntheticEvent<MouseEvent> | any, sourceRef: SoundMeta) => void;
	style?: {[prop: string]: string};
	children?: any;
}): ReactElement<HTMLDivElement> => {
	function onSelect(e, details): void {
		props.selectionHandler(e, details);
	}

	return (
		<div
			className="playlist-container"
			style={props.style || {}}
		>
			<div
				className="tracks-container"
			>
				{props.tracks.map((track: SoundMeta) => {
					return (
						<TrackComponent
							key={track._id.toString()}
							{...track}
							clickHandler={(e) => onSelect(e, track)}
						/>
					);
				})}
			</div>
		</div>
	);
};

/**
 * TrackComponent - Displays a single item for a media playlist, renders stats and descriptions
 * when provided.
 *
 * @param props: Track
 * @returns {any}
 * @constructor
 */
export const TrackComponent = (props: Track): ReactElement<HTMLDivElement> => {
	return (
		<div
			key={props._id.toString()}
			className="track-container"
			onClick={(e: React.SyntheticEvent<any>) => {
				props.clickHandler(e, props as SoundMeta);
			}}
		>
			<div
				className="details"
			>
				<div>
					{props.title}
				</div>

				<div>
					{props.duration}
				</div>
				<div>
					{props.publishedOn}
				</div>
			</div>
			<div
				className="stats"
			>
				<AnimatedTotalBadge
					total={74}
					icon={musicSVG}
					label="Plays"
				/>
				<AnimatedTotalBadge
					total={23}
					icon={heartSVG}
					label="Likes"
				/>
				<AnimatedTotalBadge
					total={20}
					icon={downloadSVG}
					label="Downloads"
				/>
				<AnimatedTotalBadge
					total={40}
					icon={shareSVG}
					label="Shares"
				/>
			</div>
		</div>
	);
};
