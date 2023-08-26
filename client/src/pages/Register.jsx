import { googleOAuthURL } from "../utils/utils";
import React, { useState } from "react";
import { useUserContext } from "../components/context";

const Register = () => {
	const { setUser } = useUserContext();
	const [state, setState] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Construct the payload
		const payload = {
			username: state.username,
			email: state.email,
			password: state.password,
		};

		try {
			// Send a POST request to the registration endpoint
			const res = await fetch("http://localhost:3000/api/users/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
				credentials: "include",
			});

			const data = await res.json();

			// Check for success
			if (res.ok) {
				// Redirect to the login page or handle successful registration
				console.log("Registration successful!", data);
				setUser(data);
				navigate("/home");
			} else {
				setError(data.message || "An error occurred during registration");
			}
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
			<form onSubmit={handleSubmit}>
				<label>Username:</label>
				<input type="text" value={username} onChange={onChange} required />
				<label>Email:</label>
				<input type="email" value={email} onChange={onChange} required />
				<label>Password:</label>
				<input type="password" value={password} onChange={onChange} required />
				<button type="submit">Register</button>
				{error && <div className="error">{error}</div>}
			</form>
			<div>
				<a href={googleOAuthURL}>Login with Google</a>
			</div>
		</>
	);
};

export default Register;
