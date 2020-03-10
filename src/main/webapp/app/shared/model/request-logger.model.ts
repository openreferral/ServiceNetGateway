export interface IRequestLogger {
  id?: number;
  requestUri?: string;
  remoteAddr?: string;
  requestParameters?: any;
  requestBody?: any;
  responseStatus?: string;
  requestMethod?: any;
  responseBody?: any;
}

export const defaultValue: Readonly<IRequestLogger> = {};
