export interface ICaptchaState {
  captcha: string;
  captchaError: string;
}

export interface ICaptchaComponent {
  onCaptchaChange: any;
  onCaptchaErrored: any;
  recaptchaRef: any;
  state: ICaptchaState;
}

export const getCaptcha = (component: ICaptchaComponent, callback: any) => {
  const { captcha } = component.state;
  component.onCaptchaErrored(null);
  if (!captcha) {
    component.recaptchaRef.current
      .executeAsync()
      .then(newCaptcha => {
        component.onCaptchaChange(newCaptcha);
        if (newCaptcha) {
          callback(newCaptcha);
        }
      })
      .catch(component.onCaptchaErrored);
  } else {
    callback(captcha);
  }
};
