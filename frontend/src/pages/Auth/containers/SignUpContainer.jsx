import { useState, useEffect } from "react";
import validator from "validator";

import SignUp from "../components/SignUp";

/**
 * Checks if the inputs fields are valid and allowed to be submitted.
 */
function isValid(email, password, confirmPassword) {
  if (
    validator.isEmail(email) &&
    password.length >= 8 &&
    confirmPassword === password
  ) {
    return true;
  } else return false;
}

function SignUpContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInputsValid, setIsInputsValid] = useState(false);

  useEffect(() => {
    setIsInputsValid(isValid(email, password, confirmPassword));
  }, [email, password, confirmPassword]);

  // Event handles
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
      isSubmittable={isInputsValid}
    />
  );
}

export default SignUpContainer;
