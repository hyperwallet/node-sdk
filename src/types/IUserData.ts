interface IBaseUserData {
  /**
   * A client-defined identifier for the user. This is the unique ID assigned to the user on your system.
   * Max 75 characters. Allows letters, numbers, and + , - . / _ ~ |
   */
  clientUserId: string;

  /**
   * The user's profile type.
   * Possible types are: INDIVIDUAL, BUSINESS
   */
  profileType: 'INDIVIDUAL' | 'BUSINESS';

  /**
   * The contact email address for the user account.
   *
   * This must be unique for your program, so you cannot have two users belonging to the same program with the same email address.
   * Max 200 characters; must be a valid email address.
   */
  email: string;
  /**
   * The user's street address. Max 100 characters. Allows letters, numbers, space and # ' ( ) , - . / : ; °
   */
  addressLine1: string;

  /**
   * The user's address, second line. Max 100 characters. Allows letters, numbers, space and # ' ( ) , - . / : ; °
   */
  addressLine2?: string;

  /**
   * The user's city. Max 50 characters. Allows letters, space and & ' ( ) - .
   */
  city: string;

  /**
   * The user's state, province or region. Max 50 characters. Allows letters, space and & ' ( ) - .
   */
  stateProvince: string;

  /**
   * Two-letter code for the user's country
   */
  country: string;

  /**
   * Two-letter code for the user's birth country
   */
  countryOfBirth?: string;

  /**
   * The user's postal code. Max 16 characters. Allows numbers, letters, space and -
   */
  postalCode: string;

  /**
   * The unique identifier for the program to which the user will belong.
   */
  programToken: string;
}

export interface IIndividualUser extends IBaseUserData {
  /**
   * The user's profile type
   */
  profileType: 'INDIVIDUAL';

  /**
   * The user's first name. Max 50 characters. Allows letters space and ' , - .
   */
  firstName: string;

  /**
   * The user's last name. Max 50 characters. Allows letters space and ' , - .
   */
  lastName: string;

  dateOfBirth: string;
  // @todo: add missing optional types
}

export interface IBusinessUser extends IBaseUserData {
  /**
   * The user's profile type
   */
  profileType: 'BUSINESS';

  /**
   * The business name. Max 100 characters. Allows letters, numbers, space and ! & ' ( ) + , - . / : ;
   */
  businessName: string;

  // @todo: Add missing business fields
}

export type IUserData = IIndividualUser | IBusinessUser;
