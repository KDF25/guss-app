import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoginPage } from "@/pages/login";
import { RoundPage } from "@/pages/round";
import { RoundsPage } from "@/pages/rounds";

export const AppRouter = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route path="/rounds" element={<RoundsPage />} />
			<Route path="/rounds/:id" element={<RoundPage />} />
		</Routes>
	</BrowserRouter>
);
