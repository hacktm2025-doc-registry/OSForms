#!/bin/bash

# === Set Instance Identifier ===
INSTANCE_NAME=$1
HOST_PORT=$2
MONGO_PORT=$3
MONGO_HOST=$4

if [ -z "$INSTANCE_NAME" ]; then
  echo "Usage: $0 <instance_name> [HOST_PORT] [MONGO_PORT] [MONGO_HOST]"
  exit 1
fi

HOST_PORT=${HOST_PORT:-3000}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_HOST=${MONGO_HOST:-localhost}

# === Generate a Temporary .env File for This Instance ===
ENV_FILE=".env.${INSTANCE_NAME}"

cat > $ENV_FILE <<EOF
INSTANCE_NAME=${INSTANCE_NAME}
HOST_PORT=${HOST_PORT}
MONGODB_PORT=${MONGO_PORT}
SERVER_PORT=${HOST_PORT}
MONGODB_HOST=${MONGO_HOST}
MONGODB_USER=root
MONGODB_PASSWORD=example
MAIL_EMAIL=abagail77@ethereal.email
MAIL_PASSWORD=5ZeZUYH8Ku7uUMSkFU
JWT_SECRET=BA_BORFASULE
VITE_SERVER_URL=localhost
VITE_SERVER_PORT=${HOST_PORT}
EOF


# === Create Named Volume (if not exists) ===
docker volume create ${INSTANCE_NAME}_mongo_data

# === Copy .env.1 to Server and Client Directories ===
if [ -f ".env.1" ]; then
  echo "Copying .env.1 to server/.env and client/.env"
  cp .env.${INSTANCE_NAME} server/.env.${INSTANCE_NAME}
  cp .env.${INSTANCE_NAME} client/.env.${INSTANCE_NAME}
else
  echo "Warning: .env.1 file not found, skipping copy to server/client"
fi

# === Launch Docker Compose ===
docker compose --env-file $ENV_FILE --project-name project_${INSTANCE_NAME} -p ${INSTANCE_NAME} up
