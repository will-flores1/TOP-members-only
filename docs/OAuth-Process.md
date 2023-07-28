- Start: The user initiates the process by clicking "Sign in with Google" on the browser.

- Process: The browser sends a sign-in request to the server.

- Process: The server redirects to Google's OAuth page.

- Decision: The user enters their Google credentials and submits them. If the credentials are correct, the process moves to the next step. If not, it loops back to the user entering their credentials.

- Process: Google returns an authorization code to the server.

- Process: The server exchanges the authorization code for an access token with Google.

- Process: Google returns the access token to the server.

- Process: The server sends the token to the browser for future requests.

- Process: The browser shows the user as logged in.

- End: The process ends.
