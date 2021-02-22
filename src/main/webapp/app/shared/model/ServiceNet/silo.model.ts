export interface ISilo {
  id?: number;
  name?: string;
  public?: boolean;
  referralEnabled?: boolean;
  logoBase64?: string;
  label?: string;
}

export const defaultValue: Readonly<ISilo> = {};
