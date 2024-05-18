import { useState } from "react";

import Login from "../components/Login";
import { obtainTokenPair } from "../AuthApi";

function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Event handles
  const handleEmailChange = (newText) => {
    setEmail(newText);
  };

  const handlePasswordChange = (newText) => {
    setPassword(newText);
  };

  const handleLogin = async () => {
    const data = { email: email, password: password };
    const response = await obtainTokenPair(data);

    if (response.ok) {
      // User login succeeded

      const data = await response.json();
      console.log(data);
    } else if (response.status === 401) {
      // User provided incorrect credentials

      console.log("Invalid login details.");
    } else {
      // Another error occurred

      console.log("There has been an error processing your request.");
    }
  };

  return (
    <Login
      email={email}
      password={password}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onLogin={handleLogin}
    />
  );
}

export default LoginContainer;
