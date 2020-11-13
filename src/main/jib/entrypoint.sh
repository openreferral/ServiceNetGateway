#!/bin/sh

echo "Replacing env-config.js inside webapp output directory with API key env variable"
RUNTIME_CONF="window._env_ = {\n
  'GOOGLE_API_KEY': '$GOOGLE_API_KEY',\n
  'RECAPTCHA_SITE_KEY': '$RECAPTCHA_SITE_KEY',\n
  'PUBLIC_DSN': '$SENTRY_DSN',\n
  'SENTRY_ENVIRONMENT': '$SENTRY_ENVIRONMENT'\n
};"
echo -e $RUNTIME_CONF > /app/resources/static/app/env-config.js

echo "The application will start in ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}
exec java ${JAVA_OPTS} -noverify -XX:+AlwaysPreTouch -Djava.security.egd=file:/dev/./urandom -cp /app/resources/:/app/classes/:/app/libs/* "org.benetech.servicenet.ServiceNetGatewayApp"  "$@"
