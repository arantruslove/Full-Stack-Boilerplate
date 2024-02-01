import { BACKEND_URL } from "../../config";

const BASE_URL = BACKEND_URL;

export async function testFetch() {
  const url = `${BASE_URL}accounts/test/`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, options);

  return response.json();
}
