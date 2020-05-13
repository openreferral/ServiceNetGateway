import { Moment } from 'moment';

export interface IDailyUpdate {
  id?: number;
  update?: any;
  expiry?: Moment;
  createdAt?: Moment;
  organizationName?: string;
  organizationId?: number;
}

export const defaultValue: Readonly<IDailyUpdate> = {};
