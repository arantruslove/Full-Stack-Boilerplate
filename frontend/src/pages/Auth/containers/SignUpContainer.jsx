import { useState } from "react";
import SignUp from "../components/SignUp";

function SignUpContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (newText) => {
    setEmail(newText);
  };

  const handlePasswordChange = (newText) => {
    setPassword(newText);
  };

  const handleConfirmPasswordChange = (newText) => {
    setConfirmPassword(newText);
  };

  return (
    <SignUp
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
    />
  );
}

export default SignUpContainer;
