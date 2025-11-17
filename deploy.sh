#!/bin/bash

# Simple deployment wrapper script
# Usage: ./deploy.sh

cd "$(dirname "$0")"

echo "Starting GCP deployment..."
echo ""

./deployment/deploy-gcp.sh
