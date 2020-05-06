#!/bin/sh
# A utility that sets the POSTGRES_HOST environment variable to the host ip available from inside the containers
# This allows to use a postgres instance installed on the host system
# If you want to use Postgres inside Docker, empty these exports
export POSTGRES_HOST=$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
export POSTGRES_PORT=5432
export POSTGRES_USERNAME=postgres
export POSTGRES_PASSWORD=password
# Remember to create 'uuid-ossp' extension aswell as 'auth' and 'gateway' schemas in this database
export POSTGRES_DB=ServiceNet

# defaults to MongoDB inside Docker
# export MONGODB_HOST=
# export MONGODB_PORT=
# export MONGODB_DB=

export JHIPSTER_OAUTH2_CLIENT_SECRET=changeme
export SPRING_OAUTH2_CLIENT_SECRET=changeme
# export GOOGLE_API_KEY=
# export EDEN_API_KEY=
# export UWBA_API_KEY=
# export SENDGRID_API_KEY=
# export FEEDBACK_RECEIVER_ADDRESS=
# export SN_VERSION_TAG=

exec docker-compose $@
