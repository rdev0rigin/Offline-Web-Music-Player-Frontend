import { emailSVG, hangoutsSVG, soundCloudSVG, twitterSVG } from '../assets/svgs';

export interface SocialLinkModel {
	id: string;
	name: string;
	icon: any;
	link: string;
	options?: {};
	handler?: () => {};
}

export const SHARE_LINKS = (): {[key: string]: SocialLinkModel} => {
	return {
		hangouts: {
			id: '123',
			icon: hangoutsSVG,
			name: 'Hangouts',
			link: '//hangouts.google.com',
		},
		soundCloud: {
			id: '134',
			icon: soundCloudSVG,
			name: 'Sound Cloud',
			link: '//soundcloud.com',
		},
		twitter: {
			id: '234',
			icon: twitterSVG,
			name: 'Twitter',
			link: '//twitter.com',
			handler: () => {
				return void 0;
			}
		},
		email: {
			id: '2325',
			icon: emailSVG,
			name: 'Email',
			link: '#',
		}
	};
};
