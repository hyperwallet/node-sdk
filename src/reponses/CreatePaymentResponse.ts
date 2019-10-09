import { PaymentPurposeCode } from "../types/enums";
import { ResourceLink } from "./ResourceLink";
import { ISODateString } from "../types/ISODateString";

export interface CreatePaymentResponse {
  token: string;
  status: "COMPLETED";
  purpose: PaymentPurposeCode;
  createdOn: string;
  amount: string;
  currency: string;
  clientPaymentId: string;
  expiresOn: ISODateString;
  destinationToken: string;
  programToken: string;
  links: ResourceLink[];
}
