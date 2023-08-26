import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCodeFromURL } from "../utils/utils";
import { useUserContext } from "../components/context";
import LogoutBtn from "../components/LogoutBtn";

function Home() {
	const { user } = useUserContext();
	const navigate = useNavigate();

	// useEffect(() => {
	// 	const code = getCodeFromURL();
	// 	if (code) {
	// 		console.log(code);
	// 	}
	// }, []);

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [user]);

	return (
		<>
			{user ? (
				<div>
					<p>Welcome {user.username}</p>
					<p>{user.email}</p>
					<div>
						<LogoutBtn />
					</div>
					{/* <button onClick={reset}>hello</button> */}
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default Home;
