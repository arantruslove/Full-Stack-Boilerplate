import Cookies from "js-cookie";

import { BACKEND_URL } from "./config";
import { csrftoken, toQueryString } from "../utils.js";

const BASE_URL = `${BACKEND_URL}/accounts`;

/**
 * Requires an object input with the following fields:
 * - email
 *
 * @param {object} data
 * @returns Promise
 */
export async function checkEmailTaken(data) {
  const url = `${BASE_URL}/is-email-taken/?${toQueryString(data)}`;

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
  const url = `${BASE_URL}/sign-up/`;

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

/**
 * Verifies a user's email. Requires the following fields:
 * - token
 *
 * @param {object} data
 * @returns Promise
 */
export async function verifyEmail(data) {
  const url = `${BASE_URL}/verify-email/`;

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

/**
 * User login request which obtains a refresh and access token and saves them as http
 * only cookies. Requires the following fields:
 * - email
 * - password
 *
 * @param {object} data
 * @returns Promise
 */
export async function obtainTokenPair(data) {
  const url = `${BASE_URL}/token/`;

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

/**
 * Refreshes the access token by making a POST request to the server.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Response>} - A promise that resolves to the response from the
 *                                server.
 */
export async function refreshAccessToken(data) {
  const url = `${BASE_URL}/token/refresh/`;

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
