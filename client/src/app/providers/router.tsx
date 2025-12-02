import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RoundsPage } from "@/pages/rounds";
import { RoundPage } from "@/pages/round";

export const AppRouter = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route path="/rounds" element={<RoundsPage />} />
			<Route path="/rounds/:id" element={<RoundPage />} />
		</Routes>
	</BrowserRouter>
);


