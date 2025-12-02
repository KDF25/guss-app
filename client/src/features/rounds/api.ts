import { apiGet, apiPost } from "@/shared/api";

import { type Round, type RoundStats } from "@/entities/round";

export const fetchRounds = () => apiGet<Round[]>("/rounds");

export const createRound = (startDate: string, endDate: string) =>
	apiPost<Round>("/rounds", { startDate, endDate });

export const fetchRound = (id: number) => apiGet<RoundStats>(`/rounds/${id}`);

export const tapRound = (id: number) =>
	apiPost<{ myScore: { taps: number; points: number }; totalPoints: number }>(
		`/rounds/${id}/tap`
	);
