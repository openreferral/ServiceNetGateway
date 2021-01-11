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
  phones?: any[];
}

export const defaultSimpleOrganization: ISimpleOrganization = {};
