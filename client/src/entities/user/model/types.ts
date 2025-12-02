export type UserRole = "ADMIN" | "NIKITA" | "SURVIVOR";

export interface User {
	id: number;
	username: string;
	role: UserRole;
}
