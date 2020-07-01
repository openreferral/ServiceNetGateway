export interface IUser {
  id?: any;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  organizationName?: string;
  organizationUrl?: string;
  phoneNumber?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: any[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  password?: string;
  systemAccountName?: string;
  systemAccountId?: number;
  shelters?: any[];
  siloId?: string;
}

export const defaultValue: Readonly<IUser> = {
  id: '',
  login: '',
  firstName: '',
  lastName: '',
  email: '',
  organizationName: '',
  organizationUrl: '',
  phoneNumber: '',
  activated: false,
  langKey: 'en',
  authorities: [],
  createdBy: '',
  createdDate: null,
  lastModifiedBy: '',
  lastModifiedDate: null,
  password: '',
  systemAccountName: '',
  systemAccountId: null,
  siloId: '',
  shelters: []
};
