/**
 * @module handleErrors
 * @category Utils
 */

/**
 * A function for handling errors while fetching from server.
 * @param {Response} response Response from fetch.
 * @returns {Response | Error} Response if ok and error if not.
 */
export default function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
