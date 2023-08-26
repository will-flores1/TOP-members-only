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

// function getGoogleOAuthURL() {
// 	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth?";

// 	const options = {
// 		redirect_uri: import.meta.env.VITE_REDIRECT_URL,
// 		client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
// 		access_type: "offline",
// 		response_type: "code",
// 		prompt: "consent",
// 		scope: [
// 			"https://www.googleapis.com/auth/userinfo.profile",
// 			"https://www.googleapis.com/auth/userinfo.email",
// 		].join(" "),
// 	};
// 	const handleGoogleSignIn = () => {
// 		fetch("/callback/google")
// 			.then((response) => response.json())
// 			.then((googleUser) => {
// 				localStorage.setItem("user", JSON.stringify(googleUser));
// 				history.push("/");
// 			})
// 			.catch((error) => {
// 				console.error("An error occurred:", error);
// 			});
// 	};

// 	const qs = new URLSearchParams(options);

// 	return `${rootUrl}${qs.toString()}`;
// }

const qs = new URLSearchParams({
	client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	redirect_uri: import.meta.env.VITE_REDIRECT_URL,
	scope: [
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/userinfo.profile",
	].join(" "), // space seperated string
	response_type: "code",
	access_type: "offline",
	prompt: "consent",
});

const googleOAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`;

const getCodeFromURL = (param) => {
	const urlParams = new URLSearchParams(param);

	if (urlParams.has("error")) {
		console.log(`An error occurred: ${urlParams.get("error")}`);
	} else {
		console.log(`The code is: ${urlParams.get("code")}`);
	}
};

export { fetchUser, googleOAuthURL, getCodeFromURL };
