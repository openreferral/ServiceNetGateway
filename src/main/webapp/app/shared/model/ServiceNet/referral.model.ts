import { Moment } from 'moment';

export interface IReferral {
  id?: number;
  shortcode?: string;
  sentAt?: string;
  fulfilledAt?: string;
  fromName?: string;
  fromId?: number;
  toName?: string;
  toId?: number;
  beneficiaryId?: number;
}

export const defaultValue: Readonly<IReferral> = {};
