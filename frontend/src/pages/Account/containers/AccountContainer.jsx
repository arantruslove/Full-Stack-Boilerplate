import { useState, useEffect, useContext } from "react";

import {
  deleteUser,
  getAccountDetails,
} from "../../../services/accountRequests";
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

  const handleDeleteButtonClick = async () => {
    // Deletes the user's account and logs them out
    const response = await deleteUser();

    // If successful, log the user out of the page
    if (response.ok) {
      await refreshToken();
    }
  };

  if (isLoading) {
    return null;
  } else {
    return (
      <Account
        email={email}
        onLogoutButtonClick={handleLogOutButtonClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    );
  }
}

export default AccountContainer;
