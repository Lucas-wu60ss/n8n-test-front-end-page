import { AxiosError } from 'axios';

export interface AppErrorResponse {
	code: number;
	message: string;
	data?: unknown;
}

export type AppAxiosError = AxiosError<AppErrorResponse>;

export enum AppErrorCode {
	INVALID_REQUEST_FORMAT = 1001,
	PERMISSION_DENIED = 1002,

	INVALID_USER_LINE_ACCESS_TOKEN = 1102,
}

export namespace AppErrorCode {
	const ErrorMessage: Record<AppErrorCode, string> = {
		[AppErrorCode.INVALID_REQUEST_FORMAT]: '格式錯誤',
		[AppErrorCode.PERMISSION_DENIED]: '無權限操作',
		[AppErrorCode.INVALID_USER_LINE_ACCESS_TOKEN]: '無法驗證 LINE 登入',
	};

	export function valueOf(errorCode: number) {
		return AppErrorCode[errorCode];
	}

	export function code(error: Error | unknown) {
		return (error as AxiosError<AppErrorResponse>).response?.data.code ?? -1;
	}

	export function message(error: Error | unknown) {
		return (
			ErrorMessage[((error as AxiosError<AppErrorResponse>).response?.data.code ?? 0) as AppErrorCode] ??
			(error as AxiosError<AppErrorResponse>).response?.data.message
		);
	}

	export function rawMessage(error: Error | unknown) {
		return (error as AppAxiosError).response?.data.message ?? 'Unknown error';
	}

	export function is(error: Error | unknown, errorCode: AppErrorCode) {
		return (error as AppAxiosError).response?.data.code === errorCode;
	}

	export function data<T>(error: Error | unknown) {
		return (error as AppAxiosError).response?.data.data as T | undefined;
	}

	export function detail(error: Error | unknown) {
		return (error as AppAxiosError).response?.data.code.toString() + ' ' + (error as AppAxiosError).response?.data.message;
	}
}
