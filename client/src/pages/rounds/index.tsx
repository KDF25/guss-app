import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, CardContent, CardFooter } from "@/shared/ui";

import { type Round } from "@/entities/round";
import { useUserStore } from "@/entities/user";

import { createRound, fetchRounds } from "@/features/rounds";

export const RoundsPage: React.FC = () => {
	const [rounds, setRounds] = useState<Round[]>([]);
	const [loading, setLoading] = useState(true);
	const user = useUserStore((s) => s.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/");
			return;
		}
		fetchRounds()
			.then(setRounds)
			.finally(() => setLoading(false));
	}, [user, navigate]);

	const handleCreateRound = async () => {
		if (!user || user.role !== "ADMIN") return;
		const round = await createRound();
		setRounds((prev) => [round, ...prev]);
	};

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-green-400">
						Список РАУНДОВ
					</h1>
					<div className="text-slate-300">{user.username}</div>
				</div>
				{user.role === "ADMIN" && (
					<Button
						onClick={handleCreateRound}
						variant="default"
						size="lg"
						className="mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
					>
						Создать раунд
					</Button>
				)}
				{loading ? (
					<div className="text-slate-300">Загрузка...</div>
				) : (
					<div className="space-y-4">
						{rounds.map((r) => (
							<Card
								key={r.id}
								onClick={() => navigate(`/rounds/${r.id}`)}
								className="bg-slate-800 border-2 border-slate-600 hover:bg-slate-750 transition cursor-pointer px-6"
							>
								<CardContent className="text-slate-300 space-y-1 p-0 pt-1">
									<div>Round ID: {r.id}</div>
									<div>
										Start:{" "}
										{new Date(r.startDate).toLocaleString()}
									</div>
									<div>
										End:{" "}
										{new Date(r.endDate).toLocaleString()}
									</div>
								</CardContent>
								<CardFooter className="border-t border-slate-600 pt-4 px-0">
									<div className="text-green-400 font-semibold">
										Статус: {r.status}
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
