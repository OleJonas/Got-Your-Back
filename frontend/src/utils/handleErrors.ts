/**
 * @module handleErrors
 * @category Utils
 */
export default function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
