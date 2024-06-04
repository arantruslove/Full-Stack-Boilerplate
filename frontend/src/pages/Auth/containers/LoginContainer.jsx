import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtainTokenPair } from "../../../authentication/AuthApi";
import { AuthContext } from "../../../authentication/AuthProvider";
import Login from "../components/Login";

function LoginContainer() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginIncorrect, setIsLoginIncorrect] = useState(false);

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

      setIsLoggedIn(true);
      navigate("/playground");
    } else if (response.status === 401) {
      // User provided incorrect credentials

      console.log("Invalid login details.");
      setIsLoginIncorrect(true);
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
      isLoginIncorrect={isLoginIncorrect}
    />
  );
}

export default LoginContainer;
