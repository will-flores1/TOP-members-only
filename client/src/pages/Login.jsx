import { useState, useEffect } from "react";
// import { getGoogleOAuthURL } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../components/context";

function Login() {
	const { setUser } = useUserContext();
	const [state, setState] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			email: state.email,
			password: state.password,
		};

		try {
			const res = await fetch("http://localhost:3000/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
				credentials: "include", // Include this line
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message); // assuming the server sends an error message
				return;
			}

			setUser(data);
			navigate("/home");
		} catch (err) {
			setError("An error occurred while communicating with the server");
			console.error(err);
		}
	};

	const onChange = (e) => {
		setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	return (
		<>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						autoComplete="on"
						type="email"
						id="email"
						name="email"
						value={state.email}
						onChange={onChange}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						autoComplete="on"
						type="password"
						id="password"
						name="password"
						value={state.password}
						onChange={onChange}
						required
					/>
				</div>
				<button type="submit">Sign in</button>
			</form>
			{/* <div>OR</div>
			<div>
				<a href={googleOAuthURL}>Login with Google</a>
			</div> */}
		</>
	);
}

export default Login;
