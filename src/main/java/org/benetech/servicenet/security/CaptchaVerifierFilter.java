package org.benetech.servicenet.security;

import java.io.IOException;
import java.util.Arrays;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter for verifying if the submitted Captcha fields
 * are valid.
 */
public class CaptchaVerifierFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private String failureUrl;
    private String[] urls;
    private CaptchaCaptureFilter captchaCaptureFilter;
    private String privateKey;

    // Delegating to authentication failure handlerorg.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler@15d4273
    private final SimpleUrlAuthenticationFailureHandler failureHandler = new SimpleUrlAuthenticationFailureHandler();

    @Override
    public void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
        FilterChain chain) throws IOException, ServletException {

        // Assign values only when user has submitted a Captcha value
        if (privateKey != null && Arrays.stream(urls).anyMatch(
            url -> new AntPathRequestMatcher(url, "POST").matches(req))) {

            logger.debug("Captcha verifier filter");
            logger.debug("captcha: " + captchaCaptureFilter.getCaptcha());
            logger.debug("remoteAddr: " + captchaCaptureFilter.getRemoteAddr());
            failureHandler.setDefaultFailureUrl(failureUrl);
            if (captchaCaptureFilter.getCaptcha() == null) {
                resetCaptchaFields();
                throw new BadCredentialsException("Captcha invalid!");
            }

            RecaptchaVerifier reCaptcha = new RecaptchaVerifier(privateKey);

            // Send HTTP request to validate user's Captcha
            RecaptchaResponse reCaptchaResponse = reCaptcha.verifyResponse(
                captchaCaptureFilter.getCaptcha(), captchaCaptureFilter.getRemoteAddr());

            // Check if valid
            if (!reCaptchaResponse.isSuccess()) {
                logger.debug("Captcha is invalid!");

                resetCaptchaFields();
                throw new BadCredentialsException("Captcha invalid!");
            } else {
                logger.debug("Captcha is valid!");
            }
        }
        // Reset Captcha fields after processing
        // If this method is skipped, everytime we access a page
        // CaptchaVerifierFilter will infinitely send a request to the Google Captcha service!
        resetCaptchaFields();

        // Proceed with the remaining filters
        chain.doFilter(req, res);
    }

    /**
     * Reset Captcha fields
     */
    public void resetCaptchaFields() {
        captchaCaptureFilter.setRemoteAddr(null);
        captchaCaptureFilter.setCaptcha(null);
    }

    public String getFailureUrl() {
        return failureUrl;
    }

    public void setFailureUrl(String failureUrl) {
        this.failureUrl = failureUrl;
    }

    public void setUrls(String[] urls) {
        this.urls = urls;
    }

    public CaptchaCaptureFilter getCaptchaCaptureFilter() {
        return captchaCaptureFilter;
    }

    public void setCaptchaCaptureFilter(CaptchaCaptureFilter captchaCaptureFilter) {
        this.captchaCaptureFilter = captchaCaptureFilter;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }
}
