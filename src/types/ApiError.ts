export interface ApiError {
  /**
   * The field name (if error is caused by a particular field)
   */
  fieldName?: string;

  /**
   * The error message
   */
  message: string;

  /**
   * The error code
   */
  code?: string;
}
