#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="${ROOT}/.logs"
BACKEND_PORT="${BACKEND_PORT:-8081}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"

mkdir -p "${LOG_DIR}"

wait_for_http() {
  local url="$1"
  local expected_codes="$2"
  local code

  for _ in {1..30}; do
    code="$(curl -s -o /dev/null -w "%{http_code}" "${url}" || true)"
    if [[ " ${expected_codes} " == *" ${code} "* ]]; then
      return 0
    fi
    sleep 1
  done

  return 1
}

echo "Starting backend..."
nohup bash -lc "cd '${ROOT}/Backend_PB' && exec ./run-local.sh '${BACKEND_PORT}'" \
  > "${LOG_DIR}/backend.log" 2>&1 &

echo "Starting frontend..."
nohup bash -lc "cd '${ROOT}/Frontend_PB' && exec env VITE_API_URL='http://${FRONTEND_HOST}:${BACKEND_PORT}/api' ./run-local.sh '${FRONTEND_PORT}'" \
  > "${LOG_DIR}/frontend.log" 2>&1 &

echo "Waiting for backend on http://${FRONTEND_HOST}:${BACKEND_PORT}..."
if ! wait_for_http "http://${FRONTEND_HOST}:${BACKEND_PORT}/api/dashboard" "200 401 403"; then
  echo "Backend did not become ready. Check ${LOG_DIR}/backend.log"
  exit 1
fi

echo "Waiting for frontend on http://${FRONTEND_HOST}:${FRONTEND_PORT}..."
if ! wait_for_http "http://${FRONTEND_HOST}:${FRONTEND_PORT}" "200"; then
  echo "Frontend did not become ready. Check ${LOG_DIR}/frontend.log"
  exit 1
fi

echo "PaisaBuddy is running:"
echo "  Frontend: http://${FRONTEND_HOST}:${FRONTEND_PORT}"
echo "  Backend:  http://${FRONTEND_HOST}:${BACKEND_PORT}/api"
echo "Logs:"
echo "  ${LOG_DIR}/frontend.log"
echo "  ${LOG_DIR}/backend.log"
