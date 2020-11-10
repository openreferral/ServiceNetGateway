package org.benetech.servicenet.security;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RecaptchaVerifier {
    protected Logger log = LoggerFactory.getLogger(this.getClass());
    public static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    protected String secret;

    public RecaptchaVerifier(String secret) {
        if (secret == null || secret.isEmpty()) {
            throw new IllegalArgumentException("Invalid secret");
        }
        this.secret = secret;
    }

    public RecaptchaResponse verifyResponse(String response, String remoteIp) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            URIBuilder uriBuilder = new URIBuilder(VERIFY_URL).addParameter("secret", secret);
            if (response != null) {
                uriBuilder.addParameter("response", response);
            }
            if (remoteIp != null) {
                uriBuilder.addParameter("remoteip", remoteIp);
            }
            HttpGet httpGet = new HttpGet(uriBuilder.build());
            CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
            log.debug("status: {}", httpResponse.getStatusLine());
            HttpEntity entity = httpResponse.getEntity();
            if (entity != null) {
                try {
                    JsonParser parser = new JsonParser();
                    JsonObject json = parser.parse(
                        EntityUtils.toString(entity, "UTF-8"))
                        .getAsJsonObject();
                    boolean success = json.get("success").getAsBoolean();
                    String errorCode = null;
                    if (json.has("error-codes")) {
                        JsonArray errorCodes = json.get("error-codes").getAsJsonArray();
                        errorCode =
                            (errorCodes != null && errorCodes.size() > 0) ? errorCodes
                                .get(0).getAsString() : null;
                    }
                    return new RecaptchaResponse(success, errorCode);
                } catch (Exception ex) {
                    return new RecaptchaResponse(false, ex.getMessage());
                }
            }
        } catch (UnsupportedEncodingException e) {
            //bypass
        } catch (IOException | URISyntaxException e) {
            log.error(e.getMessage(), e);
        }
        //bypass
        return new RecaptchaResponse(false,"not-reachable");
    }
}
