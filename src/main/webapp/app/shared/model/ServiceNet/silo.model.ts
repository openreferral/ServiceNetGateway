export interface ISilo {
  id?: number;
  name?: string;
  public?: boolean;
  referralEnabled?: boolean;
}

export const defaultValue: Readonly<ISilo> = {};
