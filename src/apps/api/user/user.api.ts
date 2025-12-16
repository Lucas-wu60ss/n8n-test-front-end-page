import { apiClientInstance } from '@/apps/api';
import { UserLoginDTO, UserInfoDTO } from './user.dto';

export namespace UserApi {
	export function login(loginData: UserLoginDTO) {
		return apiClientInstance.post<UserLoginDTO>('/login', loginData);
	}

	export function me() {
		return apiClientInstance.get<UserInfoDTO>('/me');
	}

	export function test() {
		return apiClientInstance.post('/test');
	}

	export function uploadImage(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('filename', file.name);

		return apiClientInstance.post('/upload-image-v2', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}
}
