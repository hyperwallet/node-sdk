import { IResourceLink } from './IResourceLink';

export interface ICreateUserResponse {
  token: string;
  status:
    | 'CREATED'
    | 'ACTIVATED'
    | 'LOCKED'
    | 'FROZEN'
    | 'PRE_ACTIVATED'
    | 'DE_ACTIVATED';
  verificationStatus:
    | 'NOT_REQUIRED'
    | 'REQUIRED'
    | 'FAILED'
    | 'UNDER_REVIEW'
    | 'VERIFIED';
  createdOn: string;
  clientUserId: string;
  gender?: 'MALE' | 'FEMALE';
  governmentId: string;
  governmentIdType?: 'PASSPORT' | 'NATIONAL_ID_CARD';
  profileType: 'INDIVIDUAL' | 'BUSINESS';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  addressLine1: string;
  city: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  language: string;
  timeZone: string;
  programToken: string;
  links: IResourceLink[];
}
