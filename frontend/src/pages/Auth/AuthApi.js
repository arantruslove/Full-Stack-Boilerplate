import { BACKEND_URL } from "../../config";
import { toQueryString } from "../../utils";

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
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, options);

  return response;
}
