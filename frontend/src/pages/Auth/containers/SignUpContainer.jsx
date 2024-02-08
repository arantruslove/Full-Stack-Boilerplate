import { useState, useEffect } from "react";
import validator from "validator";

import SignUp from "../components/SignUp";
import { checkEmailTaken } from "../AuthApi";

/**
 * Checks if the inputs fields are valid and allowed to be submitted.
 */
function isValid(email, password, confirmPassword, isEmailTaken) {
  if (
    validator.isEmail(email) &&
    password.length >= 8 &&
    confirmPassword === password &&
    !isEmailTaken
  ) {
    return true;
  } else return false;
}

function SignUpContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isInputsValid, setIsInputsValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await checkEmailTaken({ email });
      if (response.ok) {
        const data = await response.json();
        const isTaken = data.response;
        setIsEmailTaken(isTaken);
        setIsInputsValid(isValid(email, password, confirmPassword, isTaken));
      }
    };

    fetchData();
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
      isEmailTaken={isEmailTaken}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      isSubmittable={isInputsValid}
    />
  );
}

export default SignUpContainer;
