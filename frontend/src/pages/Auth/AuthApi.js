import { BACKEND_URL } from "../../config";
import { toQueryString, csrftoken } from "../../utils";

const BASE_URL = `${BACKEND_URL}accounts/`;

/**
 * Requires an object input with the following fields:
 * - email
 *
 * @param {object} data
 * @returns Promise
 */
export async function checkEmailTaken(data) {
  const url = `${BASE_URL}is-email-taken/?${toQueryString(data)}`;

  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };

  const response = await fetch(url, options);

  return response;
}

/**
 * Signs up a user with the following fields:
 * - email
 * - password
 *
 * @param {object} data
 * @returns Promise
 */
export async function signUpUser(data) {
  const url = `${BASE_URL}sign-up/`;

  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, options);

  return response;
}
