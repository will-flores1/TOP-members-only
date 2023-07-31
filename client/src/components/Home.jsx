import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
	const [user, setUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("http://localhost:3000/api/users/getMe", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				if (data) {
					setLoggedIn(true);
					setUser(data);
				}
			} catch (e) {
				console.error(e);
			}
		}
		async function logout() {
			try {
				const res = await fetch("http://localhost:3000/api/users/logout", {
					method: "POST",
					credentials: "include",
				});
				if (res.ok) {
					setLoggedIn(false);
					setUser(null);
					navigate("/");
				}
			} catch (e) {
				console.error(e);
			}
		}

		if (loggedIn) {
			fetchUser();
		}
	}, []);

	return (
		<>
			{user ? (
				<div>
					<h1>Welcome {user.username}</h1>
					<div>
						<button onClick={logout}>logout</button>
					</div>
					{/* <button onClick={reset}>hello</button> */}
				</div>
			) : (
				<div>
					<h1>Loading</h1>
					<div>
						<a href="/login">login</a>
					</div>
					<div>
						<a href="/register">Register</a>
					</div>
				</div>
			)}
		</>
	);
}

export default Home;
