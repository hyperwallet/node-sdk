import { PaymentPurposeCode } from '../types/enums';
import { IResourceLink } from './IResourceLink';
import { ISODateString } from '../types/ISODateString';

export interface ICreatePaymentResponse {
  token: string;
  status: 'COMPLETED';
  purpose: PaymentPurposeCode;
  createdOn: string;
  amount: string;
  currency: string;
  clientPaymentId: string;
  expiresOn: ISODateString;
  destinationToken: string;
  programToken: string;
  links: IResourceLink[];
}
