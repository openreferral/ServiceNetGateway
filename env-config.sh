#!/bin/bash

echo "Replacing env-config.js inside webapp output directory with API key env variable"
RUNTIME_CONF="window._env_ = {\n
  'GOOGLE_API_KEY': '$GOOGLE_API_KEY',\n
  'RECAPTCHA_SITE_KEY': '$RECAPTCHA_SITE_KEY',\n
  'PUBLIC_DSN': '$SENTRY_DSN',\n
  'SENTRY_ENVIRONMENT': '$SENTRY_ENVIRONMENT'\n
};"
echo -e $RUNTIME_CONF > src/main/webapp/app/config/env-config.js
