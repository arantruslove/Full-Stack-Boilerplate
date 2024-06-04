import { accessToken } from "../../utils";

import { BACKEND_URL } from "../../config";
import { csrftoken } from "../../utils";

const BASE_URL = `${BACKEND_URL}/accounts`;

/**Fetches the user's email address.*/
export async function getAccountDetails() {
  const url = `${BASE_URL}/account-details/`;

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
