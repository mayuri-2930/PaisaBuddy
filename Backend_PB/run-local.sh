#!/usr/bin/env bash

set -euo pipefail

PORT="${1:-${SERVER_PORT:-8081}}"
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
EXISTING_PID="$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN || true)"

if [[ -n "${EXISTING_PID}" ]]; then
  EXISTING_CMD="$(ps -p "${EXISTING_PID}" -o command= || true)"

  if [[ "${EXISTING_CMD}" == *"${PROJECT_ROOT}/target/classes"* ]] || [[ "${EXISTING_CMD}" == *"com.paisabuddy.backend.PaisabuddyApplication"* ]]; then
    echo "Stopping existing PaisaBuddy backend on port ${PORT} (PID ${EXISTING_PID})..."
    kill "${EXISTING_PID}"

    for _ in {1..10}; do
      if ! kill -0 "${EXISTING_PID}" 2>/dev/null; then
        break
      fi
      sleep 1
    done

    if kill -0 "${EXISTING_PID}" 2>/dev/null; then
      echo "The previous backend process is still running. Stop PID ${EXISTING_PID} manually and try again."
      exit 1
    fi
  else
    echo "Port ${PORT} is already in use by a different process:"
    echo "${EXISTING_CMD}"
    echo "Stop that process first or run with a different port, for example:"
    echo "  SERVER_PORT=8082 ./run-local.sh"
    exit 1
  fi
fi

echo "Starting PaisaBuddy backend on port ${PORT}..."
exec env SERVER_PORT="${PORT}" ./mvnw spring-boot:run
