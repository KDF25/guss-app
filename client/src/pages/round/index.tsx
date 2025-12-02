import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, CardContent } from "@/shared/ui";

import { type RoundStats } from "@/entities/round";
import { useUserStore } from "@/entities/user";

import { fetchRound, tapRound } from "@/features/rounds";

const GooseAscii = () => (
	<div className="font-mono text-xs leading-tight whitespace-pre select-none">
		{`    ░░░░░░░░░░░░░░░
  ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░
░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░
░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
  ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
    ░░░░░░░░░░░░░░░░░░░░░░░░`}
	</div>
);

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const RoundPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [round, setRound] = useState<RoundStats | null>(null);
	const [timeLeft, setTimeLeft] = useState(0);
	const [isPreStart, setIsPreStart] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [myPoints, setMyPoints] = useState(0);
	const [myTaps, setMyTaps] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);
	const navigate = useNavigate();
	const user = useUserStore((s) => s.user);

	useEffect(() => {
		if (!user) {
			navigate("/");
			return;
		}
		if (!id) return;
		fetchRound(Number(id)).then((r) => {
			setRound(r);
			setTotalPoints(r.totalPoints);
			setMyPoints(r.myScore.points);
			setMyTaps(r.myScore.taps);

			const now = Date.now();
			const start = new Date(r.startDate).getTime();
			const end = new Date(r.endDate).getTime();

			if (now < start) {
				// До старта раунда - показываем таймер до начала
				setIsPreStart(true);
				setIsFinished(false);
				setTimeLeft(Math.max(0, Math.floor((start - now) / 1000)));
			} else if (now < end) {
				// Раунд активен
				setIsPreStart(false);
				setIsFinished(false);
				setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
			} else {
				// Раунд завершен
				setIsPreStart(false);
				setIsFinished(true);
				setTimeLeft(0);
			}
		});
	}, [id, user, navigate]);

	useEffect(() => {
		if (!round) return;

		const interval = setInterval(() => {
			const now = Date.now();
			const start = new Date(round.startDate).getTime();
			const end = new Date(round.endDate).getTime();

			if (now < start) {
				// До старта
				const remaining = Math.max(0, Math.floor((start - now) / 1000));
				setTimeLeft(remaining);
				setIsPreStart(true);
				setIsFinished(false);
			} else if (now < end) {
				// Раунд активен
				const remaining = Math.max(0, Math.floor((end - now) / 1000));
				setTimeLeft(remaining);
				setIsPreStart(false);
				setIsFinished(false);
			} else {
				// Раунд завершен
				setTimeLeft(0);
				setIsPreStart(false);
				setIsFinished(true);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [round]);

	if (!round || !user) return null;

	const handleTap = async () => {
		if (isPreStart || isFinished) return; // Блокируем тапы до старта и после окончания

		const res = await tapRound(round.id);
		setMyPoints(res.myScore.points);
		setMyTaps(res.myScore.taps);
		setTotalPoints(res.totalPoints);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
			<div className="max-w-2xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<Button
						onClick={() => navigate("/rounds")}
						variant="ghost"
						size="sm"
						className="flex items-center gap-1 text-slate-300 hover:text-green-400 transition px-0"
					>
						<ChevronLeft className="w-5 h-5" />
						Раунды
					</Button>
					<div className="text-slate-300">{user.username}</div>
				</div>
				<Card className="bg-slate-800 border-2 border-green-500 text-center">
					<CardContent className="space-y-4 text-slate-200">
						<div
							onClick={handleTap}
							className={`flex justify-center mb-2 ${
								isPreStart
									? "cursor-not-allowed opacity-50"
									: "cursor-pointer transform transition hover:scale-105 active:scale-95"
							}`}
						>
							<GooseAscii />
						</div>
						<div className="text-2xl font-bold text-green-400">
							{isPreStart
								? "Раунд скоро начнется!"
								: "Раунд активен!"}
						</div>
						<div className="text-xl">
							{isPreStart
								? "Раунд начнется через: "
								: "До конца осталось: "}
							<span className="font-mono text-yellow-400">
								{formatTime(timeLeft)}
							</span>
						</div>
						{!isPreStart && (
							<>
								<div className="text-3xl font-bold">
									Мои очки -{" "}
									<span className="text-green-400">
										{myPoints}
									</span>
								</div>
								<div className="text-sm text-slate-400">
									Тапов: {myTaps}
								</div>
								<div className="text-sm text-slate-400">
									Всего по раунду: {totalPoints}
								</div>
							</>
						)}
						{isPreStart && (
							<div className="text-sm text-slate-400">
								Тапы будут доступны после старта раунда
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
