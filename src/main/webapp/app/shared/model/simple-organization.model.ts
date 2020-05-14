import { Moment } from 'moment';

export interface ISimpleOrganization {
  id?: number;
  name?: string;
  description?: any;
  email?: string;
  url?: string;
  updatedAt?: Moment;
  locations?: any[];
  services?: any[];
  dailyUpdates?: any[];
}
