import { useState, useEffect, useContext } from "react";

import { getAccountDetails } from "../../../services/accountRequests";
import { removeRefreshAccessTokens } from "../../../services/accountRequests";
import { AuthContext } from "../../../authentication/AuthProvider";
import Account from "../components/Account";

/**Account information page container. */
function AccountContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  const { refreshToken } = useContext(AuthContext);

  useEffect(() => {
    const effectFunction = async () => {
      const response = await getAccountDetails();
      const data = await response.json();
      setEmail(data["email"]);

      setIsLoading(false);
    };

    effectFunction();
  }, []);

  const handleLogOutButtonClick = async () => {
    // Logging out the user
    await removeRefreshAccessTokens();
    await refreshToken();
  };

  if (isLoading) {
    return null;
  } else {
    return (
      <Account email={email} onLogoutButtonClick={handleLogOutButtonClick} />
    );
  }
}

export default AccountContainer;
