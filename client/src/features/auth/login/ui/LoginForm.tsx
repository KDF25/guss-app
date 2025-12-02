import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input
} from "@/shared/ui";

import { useUserStore } from "@/entities/user";

import { loginRequest } from "../model/api";

export const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const setUser = useUserStore((s) => s.setUser);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username || !password) {
			setError("Заполните все поля");
			return;
		}
		try {
			const res = await loginRequest(username, password);
			localStorage.setItem("token", res.accessToken);
			setUser(res.user);
			navigate("/rounds");
		} catch (err) {
			setError("Ошибка входа");
			console.error(err);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
			<Card className="bg-slate-800 border-2 border-slate-600 w-full max-w-md shadow-2xl">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl text-green-400">
						ВОЙТИ
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="username"
								className="block text-slate-300 mb-2 text-sm"
							>
								Имя пользователя:
							</label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="bg-slate-900/40 border-slate-600 text-white placeholder:text-slate-400"
								placeholder="Введите имя"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-slate-300 mb-2 text-sm"
							>
								Пароль:
							</label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-slate-900/40 border-slate-600 text-white placeholder:text-slate-400"
								placeholder="Введите пароль"
							/>
						</div>
						{error && (
							<div className="text-red-400 text-sm text-center">
								{error}
							</div>
						)}
						<Button
							type="submit"
							size="lg"
							className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl"
						>
							Войти
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
