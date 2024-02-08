/**
 * Converts a javascript object into query parameters.
 *
 * @param {object} params
 * @returns string
 */
export function toQueryString(params) {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");
}
