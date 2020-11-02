package org.benetech.servicenet.security.oauth2;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

/**
 * Holds the access token and refresh token cookies.
 */
class OAuth2Cookies {
    private Cookie accessTokenCookie;
    private Cookie refreshTokenCookie;

    public Cookie getAccessTokenCookie() {
        return accessTokenCookie;
    }

    public Cookie getRefreshTokenCookie() {
        return refreshTokenCookie;
    }

    public void setCookies(Cookie accessTokenCookie, Cookie refreshTokenCookie) {
        this.accessTokenCookie = accessTokenCookie;
        this.refreshTokenCookie = refreshTokenCookie;
    }

    /**
     * Add the access token and refresh token as cookies to the response after successful authentication.
     *
     * @param response the response to add them to.
     */
    void addCookiesTo(HttpServletResponse response) {
        Cookie accessTokenCookie = getAccessTokenCookie();
        accessTokenCookie.setSecure(true);
        response.addCookie(accessTokenCookie);
        Cookie refreshTokenCookie = getRefreshTokenCookie();
        refreshTokenCookie.setSecure(true);
        response.addCookie(refreshTokenCookie);
    }
}
