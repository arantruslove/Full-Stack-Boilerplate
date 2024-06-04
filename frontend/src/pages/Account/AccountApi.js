import Cookies from "js-cookie";

import { BACKEND_URL } from "../../config";
import { csrftoken } from "../../utils";

const BASE_URL = `${BACKEND_URL}/accounts`;

/**Fetches the user's email address.*/
export async function getAccountDetails() {
  const url = `${BASE_URL}/account-details/`;
  const accessToken = Cookies.get("at_data");

  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, options);

  return response;
}

/**Removes the refresh and access token so that the user is logged out. */
export async function removeRefreshAccessTokens() {
  const url = `${BASE_URL}/logout/`;
  const accessToken = Cookies.get("at_data");

  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, options);

  return response;
}
