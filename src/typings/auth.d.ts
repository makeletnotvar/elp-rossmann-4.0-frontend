type UserType =
  null
  | 'NONE'             // undefined, errors, etc
  | 'DEMO'             // demo account
  | 'SHARED_USER'      // single shared views, devices etc.
  | 'USER'             // default client account
  | 'ADMIN'            // client admin to special use cases
  | 'SUPER_ADMIN'      // it's our admin account
  | 'DEV';             // developer account

type AccountType =
  null
  | 'FREE'
  | 'FULL'
  | 'ENTERPRISE';


interface UserAuth {
  uuid: string;
  username: string;
  userType: UserType;         // @deprecated
  type?: UserType;
  accountType: AccountType;
  passwordExpired?: boolean;
  isEnergyPermitted?: boolean;
}