#!/bin/bash
# Runs once, on the very first start of the PostgreSQL container (empty data volume).
# Creates a separate database and user for Keycloak and for the application,
# so neither service can read or modify the other's data.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER ${KEYCLOAK_DB_USER} WITH PASSWORD '${KEYCLOAK_DB_PASSWORD}';
    CREATE DATABASE keycloak OWNER ${KEYCLOAK_DB_USER};

    CREATE USER ${APP_DB_USER} WITH PASSWORD '${APP_DB_PASSWORD}';
    CREATE DATABASE phonebook OWNER ${APP_DB_USER};
EOSQL
