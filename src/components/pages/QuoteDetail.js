import { useParams, Route, Routes, Link } from "react-router-dom";
import { Fragment, useEffect } from "react";
import Comments from "../comments/Comments";
import HighlightedQuote from '../quotes/HighlightedQuote';
import useHttp from "../../hooks/use-http";
import { getSingleQuote } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
const QuoteDetail = () => {
	const params = useParams();

	const { id }= params;

	const {
		sendRequest,
		status,
		data: loadedQuote,
		error,
	} = useHttp(getSingleQuote, true);

	useEffect(() => {
		sendRequest(id);
	}, [sendRequest, id]);

	if (status === 'pending') {
		return (
			<div className="centered">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return <p className="centered focused">{error}</p>;
	}

	if (!loadedQuote.text) {
		return <p className="centered">No quote found</p>
	}

	return (
		<Fragment>
			<HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
			<Routes>
				<Route
					path="/"
					exact
					element={
						<div className="centered">
							<Link className="btn--flat" to="comments">
								Load Comments
							</Link>
						</div>
					}
				/>
				<Route path="comments" element={<Comments />} />
			</Routes>
		</Fragment>
	);
};
export default QuoteDetail;