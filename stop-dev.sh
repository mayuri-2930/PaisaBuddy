#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

stop_matching_port() {
  local port="$1"
  local expected_fragment="$2"
  local label="$3"
  local pid
  local cmd

  pid="$(lsof -tiTCP:"${port}" -sTCP:LISTEN || true)"
  if [[ -z "${pid}" ]]; then
    return 0
  fi

  cmd="$(ps -p "${pid}" -o command= || true)"
  if [[ "${cmd}" == *"${expected_fragment}"* ]]; then
    echo "Stopping ${label} on port ${port} (PID ${pid})..."
    kill "${pid}"
  else
    echo "Skipping port ${port}; it is used by a different process."
  fi
}

stop_matching_port "3000" "${ROOT}/Frontend_PB" "frontend"
stop_matching_port "8081" "com.paisabuddy.backend.PaisabuddyApplication" "backend"
