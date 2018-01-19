import * as React from 'react';
import { SoundMeta } from './sound.model';

export interface Track extends SoundMeta {
	clickHandler: (e: MouseEvent | any, track: SoundMeta) => void;
}
