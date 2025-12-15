export namespace ENV {
	export const APP_ENV = import.meta.env.VITE_APP_ENV;
	export const APP_VERSION = import.meta.env.VITE_APP_VERSION;
	export const APP_URL = import.meta.env.VITE_APP_URL;
	export const APP_API_URL = import.meta.env.VITE_APP_API_URL;
	export const APP_RESOURCE_URL = import.meta.env.VITE_APP_RESOURCE_URL;
	export const APP_ASSET_URL = import.meta.env.VITE_APP_ASSET_URL;
	export const APP_MOCK_USER_LOGIN = import.meta.env.VITE_APP_MOCK_USER_LOGIN === 'true';
	export const APP_API_MOCK_ENABLE = import.meta.env.VITE_APP_API_MOCK_ENABLED === 'true';

	export const LINE_LOGIN_ENABLE = import.meta.env.VITE_LIFF_LOGIN_ENABLED === 'true';
	export const LINE_LIFF_ID = import.meta.env.VITE_LIFF_ID;
	export const LINE_LIFF_URL = import.meta.env.VITE_LIFF_URL;
	export const LINE_OA_URL = import.meta.env.VITE_LINE_OA_URL;
	export const LINE_OFFICIAL_ACCOUNT_ID = import.meta.env.VITE_OFFICIAL_ACCOUNT_ID;

	export const COUPON_REDEEM_TIMEOUT_MINUTES = import.meta.env.VITE_COUPON_REDEEM_TIMEOUT_MINUTES;
	export const COUPON_REMAIN_HINT_THRESHOLD = Number.parseFloat(import.meta.env.VITE_COUPON_REMAIN_HINT_THRESHOLD);

	export const APP_GA4_ID = import.meta.env.VITE_GA4_ID;

	export const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL;
	export const N8N_IMAGE_DESCRIBE_PATH = import.meta.env.VITE_N8N_IMAGE_DESCRIBE_PATH;
	export const REPO_NAME = import.meta.env.VITE_REPO_NAME;
}
