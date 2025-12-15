export interface UserLoginDTO {
	access_token: string;
	friendship?: boolean;
	friendship_status_changed?: boolean;
}

export interface UserInfoDTO {
	id: number;
	line_uid: string;
	line_name: string;
	line_avatar_url: string;
}
