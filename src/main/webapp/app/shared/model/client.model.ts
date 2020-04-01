export interface IClient {
  clientId?: any;
  clientSecret?: string;
  tokenValiditySeconds?: number;
}

export const defaultValue: Readonly<IClient> = {
  clientId: '',
  clientSecret: '',
  tokenValiditySeconds: 3600
};
