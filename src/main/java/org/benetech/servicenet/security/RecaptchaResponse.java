package org.benetech.servicenet.security;

public class RecaptchaResponse {

    private final boolean success;
    private final String errorCode;

    protected RecaptchaResponse(boolean success, String errorCode) {
        this.success = success;
        this.errorCode = errorCode;
    }

    /**
     * The reCaptcha error message.
     *
     * not-reachable
     * missing-input-secret
     * invalid-input-secret
     * missing-input-response
     * invalid-input-response
     *
     * @return the error code
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * True if captcha is "success".
     * @return whether the captcha is valid
     */
    public boolean isSuccess() {
        return success;
    }
}
