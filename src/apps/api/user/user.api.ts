import { apiClientInstance } from '@/apps/api';
import { UserLoginDTO, UserInfoDTO } from './user.dto';

export namespace UserApi {
	export function login(loginData: UserLoginDTO) {
		return apiClientInstance.post<UserLoginDTO>('/login', loginData);
	}

	export function me() {
		return apiClientInstance.get<UserInfoDTO>('/me');
	}
}
