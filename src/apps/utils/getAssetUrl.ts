import { ENV } from '@/apps/global/const';

export const getAssetUrl = (relativePath: string): string => {
	const baseUrl = ENV.APP_ASSET_URL;
	const version = ENV.APP_VERSION;

	if (!baseUrl) {
		throw new Error('Base URL is not defined in environment variables');
	}

	return `${baseUrl}${relativePath}?ver=${version}`;
};
