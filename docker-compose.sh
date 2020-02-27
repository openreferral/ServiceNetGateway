#!/bin/sh
export HOST_IP=$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')
exec docker-compose $@
