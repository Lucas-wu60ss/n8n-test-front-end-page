/* eslint-disable no-unused-vars */
import { PropsWithChildren, useEffect, useState } from 'react';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ENV } from '@/apps/global/const';
import { AppAxiosError, AppErrorCode } from '@/apps/global/types';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	withoutAuth?: boolean;
	excludeCode?: number[] | 'all';
}

export const apiClientInstance = axios.create({
	baseURL: ENV.APP_API_URL,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isJsonBlob(data: any) {
	return data instanceof Blob && data.type === 'application/json';
}

export function AxiosIntercetorProvider(props: PropsWithChildren) {
	const { children } = props;
	const [isSet, setIsSet] = useState(false);

	useEffect(() => {
		const reqInterceptor = (config: CustomAxiosRequestConfig) => {
			// 如果不需要 Auth 就直接返回
			if (config.withoutAuth) {
				return config;
			}

			const token = localStorage.getItem('api_token');

			if (token) {
				config.headers = config.headers || {};
				config.headers.set('Authorization', `Bearer ${token}`);
			}

			return config;
		};

		const resInterceptor = (response: AxiosResponse) => {
			if (response.config.responseType === 'blob') {
				return response;
			}

			return response;
		};

		const errInterceptor = async (error: AppAxiosError & { config: CustomAxiosRequestConfig }) => {
			if (error.response && error.config) {
				const excludeErrorCodes = error.config.excludeCode ?? [];
				const data = error.response.data;

				// 如果是 'all' 就直接 reject 不做而外的處理
				if (excludeErrorCodes === 'all') {
					return Promise.reject(error);
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const responseData = isJsonBlob(data) ? JSON.parse(await data.text()) : data || {};
				const errorCode = responseData['code'] as number;
				const errorMessage = responseData['message'] as string;

				// 如果沒有設定 excludeCode 或是 excludeCode 不包含這個錯誤碼，就顯示錯誤訊息
				if (excludeErrorCodes.includes(errorCode) === false) {
					const message = AppErrorCode.message(error);
					console.log(message || errorCode.toString() + ' ' + errorMessage);
				}
			} else {
				console.error(error);
			}
			return Promise.reject(error);
		};

		const resInterceptors = apiClientInstance.interceptors.response.use(resInterceptor, errInterceptor);
		const reqInterceptors = apiClientInstance.interceptors.request.use(reqInterceptor, errInterceptor);

		setIsSet(true);
		return () => {
			apiClientInstance.interceptors.response.eject(resInterceptors);
			apiClientInstance.interceptors.request.eject(reqInterceptors);
		};
	}, []);

	return isSet && children;
}
