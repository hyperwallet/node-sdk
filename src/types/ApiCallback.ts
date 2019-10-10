import { IApiError } from './ApiError';

/**
 * The callback interface for api calls
 *
 * @param errors In case of an error an array with error objects otherwise undefined
 * @param data The rest response body
 * @param res The raw superagent response object
 */
export type ApiCallback = (
  errors?: IApiError[],
  data?: Record<string, any>,
  res?: any
) => void;
