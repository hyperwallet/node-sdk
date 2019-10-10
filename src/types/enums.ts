export enum TransferMethod {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_CARD = 'BANK_CARD',
  PAPER_CHECK = 'PAPER_CHECK',
  WIRE_ACCOUNT = 'WIRE_ACCOUNT',
  PAYPAL_ACCOUNT = 'PAYPAL_ACCOUNT'
}

export enum PaymentPurposeCode {
  Bonus = 'GP0001',
  Commission = 'GP0002',
  Expense = 'GP0003',
  NonTaxablePayment = 'GP0004',
  Income = 'GP0005',
  Pension = 'GP0006',
  CharityDonation = 'GP0007',
  OTHER = 'OTHER'
}
