#!/bin/bash
set -a
source .env
set +a
curl -s "${FOUNDRY_ENDPOINT%/}/openai/v1/models" -H "api-key: ${FOUNDRY_API_KEY}" | python3 -m json.tool

