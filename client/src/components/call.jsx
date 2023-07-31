import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function Callback() {
	const history = useHistory();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const user = JSON.parse(urlParams.get("user"));

		localStorage.setItem("user", JSON.stringify(user));
		history.push("/");
	}, [history]);

	return <div>Loading...</div>;
}
