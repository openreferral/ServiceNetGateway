import { Moment } from 'moment';

export interface ISimpleOrganization {
  id?: string;
  name?: string;
  description?: any;
  email?: string;
  url?: string;
  updatedAt?: Moment;
  locations?: any[];
  services?: any[];
  dailyUpdates?: any[];
  accountName?: string;
  replacedById?: string;
}

export const defaultSimpleOrganization: ISimpleOrganization = {};
