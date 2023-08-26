import { useUserContext } from "./context";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
	const { setUser } = useUserContext();
	const navigate = useNavigate();

	async function logout() {
		try {
			const res = await fetch("http://localhost:3000/api/users/logout", {
				method: "POST",
				credentials: "include",
			});
			if (res.ok) {
				setUser(null);
				navigate("/login");
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<>
			<button onClick={logout}>Log out</button>
		</>
	);
}

export default LogoutBtn;
