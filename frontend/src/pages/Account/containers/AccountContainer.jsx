import { useState, useEffect } from "react";

import { getAccountDetails } from "../AccountApi";
import Account from "../components/Account";

/**Account information page container. */
function AccountContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const effectFunction = async () => {
      const response = await getAccountDetails();
      const data = await response.json();
      setEmail(data["email"]);

      setIsLoading(false);
    };

    effectFunction();
  }, []);

  if (isLoading) {
    return null;
  } else {
    return <Account email={email} />;
  }
}

export default AccountContainer;
