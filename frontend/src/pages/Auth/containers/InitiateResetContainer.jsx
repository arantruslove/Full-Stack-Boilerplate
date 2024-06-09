import { useState } from "react";

import InitiateReset from "../components/InitiateReset";
import { initiatePasswordReset } from "../../../services/accountRequests";

function InitiateResetContainer() {
  const [inputText, setInputText] = useState("");
  const [isResetInitiated, setIsResetInitiated] = useState(false);

  const handleInputTextChange = (newText) => {
    setInputText(newText);
  };

  const handleButtonClick = async () => {
    const response = await initiatePasswordReset({ email: inputText });

    if (response.ok) {
      setIsResetInitiated(true);
    } else {
      console.log("There was an error");
    }
  };
  return (
    <InitiateReset
      inputText={inputText}
      isResetInitiated={isResetInitiated}
      onInputTextChange={handleInputTextChange}
      onButtonClick={handleButtonClick}
    />
  );
}

export default InitiateResetContainer;
