export interface IClient {
  clientId?: any;
  clientSecret?: string;
  tokenValiditySeconds?: number;
  systemAccountId?: string;
  siloId?: string;
}

export const defaultValue: Readonly<IClient> = {
  clientId: '',
  clientSecret: '',
  tokenValiditySeconds: 3600,
  systemAccountId: '',
  siloId: ''
};
