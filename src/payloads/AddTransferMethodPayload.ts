import { TransferMethod } from "../types/enums";

export interface AddTransferMethodPayload {
  /**
   * Two-letter code
   */
  transferMethodCountry: string;
  /**
   * Three-letter code
   */
  transferMethodCurrency: string;

  type: TransferMethod;

  cardNumber: string;
  /**
   * Format: YYYY-MM
   */
  dateOfExpiry: string;
  cvv: string;
}
