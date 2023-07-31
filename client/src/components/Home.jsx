import { useEffect, useState } from "react";

function Home() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("http://localhost:3000/me", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				console.log(data);
				setUser(data);
			} catch (e) {
				console.error(e);
			}
		}
		if (!user) {
			fetchUser();
		}
	}, []);

	async function logout() {
		try {
			const res = await fetch("http://localhost:3000/logout", {
				method: "GET",
				credentials: "include",
			});
			const data = await res.json();
			console.log(data);
			setUser(null);
		} catch (e) {
			console.error(e);
		}
	}

	function reset() {
		setUser(null);
	}

	return (
		<>
			{user ? (
				<div>
					<h1>Welcome {user.name}</h1>
					<div>
						<button onClick={logout}>logout</button>
					</div>
					<button onClick={reset}>hello</button>
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
