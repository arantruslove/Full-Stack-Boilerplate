import { useState } from "react";

import InitiateReset from "../components/InitiateReset";
import { initiatePasswordReset } from "../../../services/accountRequests";

function InitiateResetContainer() {
  const [inputText, setInputText] = useState("");
  const [doesEmailExist, setDoesEmailExist] = useState(false);
  const [isResetInitiated, setIsResetInitiated] = useState(false);

  const handleInputTextChange = (newText) => {
    setInputText(newText);
    setDoesEmailExist(false);
  };

  const handleButtonClick = async () => {
    const response = await initiatePasswordReset({ email: inputText });

    if (response.ok) {
      setIsResetInitiated(true);
    } else if (response.status === 404) {
      setDoesEmailExist(true);
    }
  };
  return (
    <InitiateReset
      inputText={inputText}
      doesEmailExist={doesEmailExist}
      isResetInitiated={isResetInitiated}
      onInputTextChange={handleInputTextChange}
      onButtonClick={handleButtonClick}
    />
  );
}

export default InitiateResetContainer;
