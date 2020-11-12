package org.benetech.servicenet.security;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.Arrays;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter for capturing Captcha fields.
 * It's purpose is to store these values internally
 */
public class CaptchaCaptureFilter extends OncePerRequestFilter {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private String captcha;
    private String remoteAddr;
    private String[] urls;

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
        FilterChain chain) throws IOException, ServletException {
        CachedHttpServletRequest cachedRequest = new CachedHttpServletRequest(request);

        // Assign values only when user has submitted a Captcha value.
        // Without this condition the values will be reset due to redirection
        // and CaptchaVerifierFilter will enter an infinite loop
        if (Arrays.stream(urls).anyMatch(
            url -> new AntPathRequestMatcher(url, "POST").matches(cachedRequest))) {
            logger.debug("Captcha capture filter");
            if (cachedRequest.getRemoteAddr() != null) {
                remoteAddr = cachedRequest.getRemoteAddr();
            } else {
                remoteAddr = cachedRequest.getHeader("X-Forwarded-For");
            }
            logger.debug("remoteAddr: " + remoteAddr);
            captcha = cachedRequest.getParameter("captcha");
            if (captcha == null) {
                StringBuilder sb = new StringBuilder();
                BufferedReader reader = cachedRequest.getReader();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
                JsonParser parser = new JsonParser();
                JsonObject json = parser.parse(sb.toString()).getAsJsonObject();
                captcha = json.get("captcha").getAsString();
            }

            logger.debug("captcha: " + captcha);
        }

        // Proceed with the remaining filters
        chain.doFilter(cachedRequest, response);
    }

    public String getCaptcha() {
        return captcha;
    }

    public void setCaptcha(String captcha) {
        this.captcha = captcha;
    }

    public String getRemoteAddr() {
        return remoteAddr;
    }

    public void setRemoteAddr(String remoteAddr) {
        this.remoteAddr = remoteAddr;
    }

    public void setUrls(String[] urls) {
        this.urls = urls;
    }
}
