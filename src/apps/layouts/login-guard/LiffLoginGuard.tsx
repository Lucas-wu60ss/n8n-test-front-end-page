import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import liff from '@line/liff';

import { ENV } from '@/apps/global/const';
import { UserApi } from '@/apps/api/user';

const isLineLogin = ENV.LINE_LOGIN_ENABLE;
const isMockUserLogin = ENV.APP_API_MOCK_ENABLE;

function LiffLoginGuard() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const initializeLiff = async () => {
		try {
			await liff.init({ liffId: ENV.LINE_LIFF_ID });

			if (!liff.isLoggedIn()) {
				liff.login({ redirectUri: window.location.href });
				return;
			}

			// 檢查 token 是否有效
			await checkToken();
		} catch (error) {
			console.error('LIFF Initialization failed:', error);
		}
	};

	// 檢查 token 是否有效
	const checkToken = async () => {
		const storedToken = localStorage.getItem('api_token');

		if (storedToken) {
			const isValidToken = await getSelf();
			if (!isValidToken) {
				await refreshAccessToken();
			} else {
				// 登入成功
				setIsAuthenticated(true);
			}
		} else {
			await refreshAccessToken();
		}
	};

	// 重新獲取登入 token 和用戶資料
	const refreshAccessToken = async () => {
		await getLoginApiToken();
		await getSelf();
	};

	const getLoginApiToken = async () => {
		let accessToken = 'xxxx';
		let profile = {
			userId: 'Uf03adaff1021cad8056364f770951123',
		};
		if (isLineLogin) {
			accessToken = liff.getAccessToken() ?? '';
			profile = await liff.getProfile();
		}

		const { userId: line_uid } = profile;
		const loginData = {
			line_uid,
			access_token: accessToken,
		};

		const res = await UserApi.login(loginData);

		const api_token = res.data.access_token;
		localStorage.setItem('api_token', api_token);
	};

	const getSelf = async () => {
		try {
			await UserApi.me();
			setIsAuthenticated(true);
			return true;
		} catch (error) {
			console.error('Token validation failed', error);
			setIsAuthenticated(false);
			return false;
		}
	};

	useEffect(() => {
		if (isLineLogin) {
			initializeLiff();
		} else {
			if (isMockUserLogin) {
				setIsAuthenticated(true);
			} else {
				checkToken();
			}
		}
	}, []);

	return isAuthenticated && <Outlet />;
}

export default LiffLoginGuard;
