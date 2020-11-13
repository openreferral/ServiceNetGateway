#!/bin/sh

echo "Replacing env-config.js inside webapp output directory with API key env variable"
RUNTIME_CONF="window._env_ = {
  \"GOOGLE_API_KEY\": \"$GOOGLE_API_KEY\",
  \"RECAPTCHA_SITE_KEY\": \"$RECAPTCHA_SITE_KEY\",
  \"PUBLIC_DSN\": \"$SENTRY_DSN\",
  \"SENTRY_ENVIRONMENT\": \"$SENTRY_ENVIRONMENT\"
}"
echo $RUNTIME_CONF > /app/resources/static/app/env-config.js

echo "The application will start in ${JHIPSTER_SLEEP}s..." && sleep ${JHIPSTER_SLEEP}
exec java ${JAVA_OPTS} -noverify -XX:+AlwaysPreTouch -Djava.security.egd=file:/dev/./urandom -cp /app/resources/:/app/classes/:/app/libs/* "org.benetech.servicenet.ServiceNetGatewayApp"  "$@"
