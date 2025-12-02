export type RoundStatus = "PLANNED" | "COOLDOWN" | "ACTIVE" | "FINISHED";

export interface Round {
	id: number;
	startDate: string;
	endDate: string;
	status: RoundStatus;
}

export interface RoundStats extends Round {
	totalPoints: number;
}
