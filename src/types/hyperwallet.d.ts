import { Response } from "superagent";
import { HwApiError } from "./ApiError";
import { HwUserData } from "./user";
import { HwAddTransferMethodPayload } from "../payloads/AddTransferMethodPayload";

export default class Hyperwallet {
  username: string;

  password: string;

  programToken: string;

  server: string;

  constructor(options: {
    username: string;
    password: string;
    programToken: string;
    server: string;
  });

  /**
   * Create a bank account
   */
  public createBankAccount(
    userToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Create a bank account status transition
   */
  public createBankAccountStatusTransition(
    userToken: string,
    bankAccountToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Create a payment
   */
  public createPayment(
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Create a prepaid card
   */
  public createPrepaidCard(
    userToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Create a prepaid card status transition
   */
  public createPrepaidCardStatusTransition(
    userToken: string,
    prepaidCardToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Create a transfer method
   */
  public createTransferMethod(
    userToken: string,
    jsonCacheToken: string,
    data: HwAddTransferMethodPayload,
    callback: HwApiCallback
  ): void;

  /**
   * Create a user
   */
  public createUser(data: HwUserData, callback: HwApiCallback): void;

  /**
   * Deactivate a bank account
   */
  public deactivateBankAccount(
    userToken: string,
    bankAccountToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Deactivate a prepaid card
   */
  public deactivatePrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Get a bank account
   */
  public getBankAccount(
    userToken: string,
    bankAccountToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Get a payment
   */
  public getPayment(paymentToken: string, callback: HwApiCallback): void;

  /**
   * Get a prepaid card
   */
  public getPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Get a prepaid card status transition
   */
  public getPrepaidCardStatusTransition(
    userToken: string,
    prepaidCardToken: string,
    statusTransitionToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Get a program
   */
  public getProgram(programToken: string, callback: HwApiCallback): void;

  /**
   * Get a program account
   */
  public getProgramAccount(
    programToken: string,
    accountToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Get a transfer method configuration
   */
  public getTransferMethodConfiguration(
    userToken: string,
    country: string,
    currency: string,
    type: string,
    profileType: string,
    callback: HwApiCallback
  ): void;

  /**
   * Load a user
   */
  public getUser(userToken: string, callback: HwApiCallback): void;

  /**
   * Get a single webhook notification
   */
  public getWebhookNotification(
    webhookToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * List balances for a program accounts
   */
  public listBalancesForAccount(
    programToken: string,
    accountToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List balances for a prepaid card
   */
  public listBalancesForPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List balances for a user
   */
  public listBalancesForUser(
    userToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all bank account status transitions
   */
  public listBankAccountStatusTransitions(
    userToken: string,
    bankAccountToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all bank accounts
   */
  public listBankAccounts(
    userToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all bank cards
   *
   * @param {string} userToken - The user token
   * @param {Object} options - The query parameters to send
   * @param {api-callback} callback - The callback for this call
   * @throws Will throw an error if userToken is not provided
   */
  public listBankCards(
    userToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all payments
   */
  public listPayments(
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all prepaid card status transitions
   */
  public listPrepaidCardStatusTransitions(
    userToken: string,
    prepaidCardToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all prepaid cards
   */
  public listPrepaidCards(
    userToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all prepaid card receipts
   */
  public listReceiptsForPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all program account receipts
   */
  public listReceiptsForProgramAccount(
    programToken: string,
    accountToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all user receipts
   */
  public listReceiptsForUser(
    userToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all transfer method configurations
   */
  public listTransferMethodConfigurations(
    userToken: string,
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * List all users
   */
  public listUsers(options: Record<string, any>, callback: HwApiCallback): void;

  /**
   * List webhook notifications
   */
  public listWebhookNotifications(
    options: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Lock a prepaid card
   */
  public lockPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Mark a prepaid card as lost or stolen
   */
  public lostOrStolenPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Suspend a prepaid card
   */
  public suspendPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Unlock a prepaid card
   */
  public unlockPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Unsuspend a prepaid card
   */
  public unsuspendPrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    callback: HwApiCallback
  ): void;

  /**
   * Update a bank account
   */
  public updateBankAccount(
    userToken: string,
    bankAccountToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Update a prepaid card
   */
  public updatePrepaidCard(
    userToken: string,
    prepaidCardToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;

  /**
   * Update a user
   */
  public updateUser(
    userToken: string,
    data: Record<string, any>,
    callback: HwApiCallback
  ): void;
}
