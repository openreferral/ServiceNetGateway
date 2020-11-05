package org.benetech.servicenet.config.oauth2;

import org.benetech.servicenet.security.oauth2.CookieTokenExtractor;
import org.benetech.servicenet.security.oauth2.OAuth2AuthenticationService;
import org.benetech.servicenet.security.oauth2.OAuth2CookieHelper;
import org.benetech.servicenet.security.oauth2.OAuth2TokenEndpointClient;
import org.benetech.servicenet.web.filter.RefreshTokenFilterConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;
import org.springframework.security.oauth2.provider.token.TokenStore;

/**
 * Configures the RefreshFilter refreshing expired OAuth2 token Cookies.
 */
@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class OAuth2AuthenticationConfiguration extends ResourceServerConfigurerAdapter {
    private final OAuth2Properties oAuth2Properties;
    private final OAuth2TokenEndpointClient tokenEndpointClient;
    private final TokenStore tokenStore;
    private final String activeProfile;

    public OAuth2AuthenticationConfiguration(OAuth2Properties oAuth2Properties, OAuth2TokenEndpointClient tokenEndpointClient, TokenStore tokenStore,
    @Value("${spring.profiles.active:dev}") String activeProfile) {
        this.oAuth2Properties = oAuth2Properties;
        this.tokenEndpointClient = tokenEndpointClient;
        this.tokenStore = tokenStore;
        this.activeProfile = activeProfile;
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers("/auth/login").permitAll()
            .antMatchers("/auth/logout").authenticated()
            .and()
            .apply(refreshTokenSecurityConfigurerAdapter());
    }

    /**
     * A {@code SecurityConfigurerAdapter} to install a servlet filter that refreshes OAuth2 tokens.
     */
    private RefreshTokenFilterConfigurer refreshTokenSecurityConfigurerAdapter() {
        return new RefreshTokenFilterConfigurer(uaaAuthenticationService(), tokenStore);
    }

    @Bean
    public OAuth2CookieHelper cookieHelper() {
        return new OAuth2CookieHelper(oAuth2Properties);
    }

    @Bean
    public OAuth2AuthenticationService uaaAuthenticationService() {
        return new OAuth2AuthenticationService(tokenEndpointClient, cookieHelper(), !activeProfile.contains("dev"));
    }

    /**
     * Configure the ResourceServer security by installing a new {@link TokenExtractor}.
     */
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.tokenExtractor(tokenExtractor());
    }

    /**
     * The new {@link TokenExtractor} can extract tokens from Cookies and Authorization headers.
     *
     * @return the {@link CookieTokenExtractor} bean.
     */
    @Bean
    public TokenExtractor tokenExtractor() {
        return new CookieTokenExtractor();
    }

}
