const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const getAuthHeader = (): Record<string, string> => {
	const token = localStorage.getItem("token");
	return token ? { Authorization: `Bearer ${token}` } : {};
};

async function apiGet<T>(path: string): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...getAuthHeader()
	};

	const res = await fetch(`${API_URL}${path}`, { headers });

	if (!res.ok) {
		throw new Error(await res.text());
	}

	return res.json() as Promise<T>;
}

async function apiPost<T, B = unknown>(path: string, body?: B): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...getAuthHeader()
	};

	const res = await fetch(`${API_URL}${path}`, {
		method: "POST",
		headers,
		body: body ? JSON.stringify(body) : undefined
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}

	return res.json() as Promise<T>;
}

export { apiGet, apiPost };
