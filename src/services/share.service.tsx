import {SHARE_LINKS, SocialLinkModel} from '../models/social-link.model';

export const ShareService = () => {
	return {
		getLinksMap: async (): Promise<{[key: string]: SocialLinkModel}> => {
			// xhrAsync()
			return SHARE_LINKS();
		}
	}
};