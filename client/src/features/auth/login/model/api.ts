import { apiPost } from "@/shared/api";

import { type User } from "@/entities/user";

interface LoginResponse {
	accessToken: string;
	user: User;
}

export const loginRequest = (username: string, password: string) =>
	apiPost<LoginResponse>("/login", { username, password });
