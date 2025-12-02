const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const authHeader = () => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiGet<T>(path: string): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...authHeader(),
		},
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function apiPost<T, B = unknown>(path: string, body?: B): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...authHeader(),
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}


