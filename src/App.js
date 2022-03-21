import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AllQuotes from "./components/pages/AllQuotes";

import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";

//모든사용자가 들어간다면 lazy 역효과 가능
const NewQuote = React.lazy(() => import("./components/pages/NewQuote"));
const QuoteDetail = React.lazy(() => import("./components/pages/QuoteDetail"));
const E404 = React.lazy(() => import("./components/pages/E404"));

function App() {
	return (
		<div>
			<Layout />
			<Suspense
				fallback={
					<div className="centered">
						<LoadingSpinner />
					</div>
				}
			>
				<Routes>
					<Route path="/" exact element={<Navigate replace to="/quotes" />} />
					<Route path="/quotes" element={<AllQuotes />} />
					<Route path="/quotes/:id/*" element={<QuoteDetail />} />
					<Route path="/new-quote" element={<NewQuote />} />
					<Route path="*" element={<E404 />} />
				</Routes>
			</Suspense>
		</div>
	);
}

export default App;
