#!/bin/bash

# Format Converter - GCP Deployment Script
# This script deploys the application to Google Cloud Run

set -e  # Exit on error

echo "🚀 Format Converter - GCP Deployment Script"
echo "==========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-}"
REGION="${GCP_REGION:-us-central1}"
BACKEND_SERVICE_NAME="format-converter-backend"
FRONTEND_SERVICE_NAME="format-converter-frontend"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed${NC}"
    echo "Please install it from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Prompt for project ID if not set
if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}Please enter your GCP Project ID:${NC}"
    read -r PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: GCP Project ID is required${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using GCP Project: $PROJECT_ID${NC}"
echo -e "${GREEN}✓ Using Region: $REGION${NC}"
echo ""

# Set the project
echo "📦 Setting GCP project..."
gcloud config set project "$PROJECT_ID"

# Enable required APIs
echo "🔧 Enabling required GCP APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy backend
echo ""
echo "🏗️  Building and deploying backend..."
cd backend

gcloud builds submit --tag "gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME"

gcloud run deploy "$BACKEND_SERVICE_NAME" \
    --image "gcr.io/$PROJECT_ID/$BACKEND_SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 3001 \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10

# Get backend URL
BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --format 'value(status.url)')

echo -e "${GREEN}✓ Backend deployed at: $BACKEND_URL${NC}"

# Build and deploy frontend
echo ""
echo "🏗️  Building and deploying frontend..."
cd ../frontend

# Create .env file with backend URL
echo "VITE_API_URL=$BACKEND_URL" > .env.production

gcloud builds submit --tag "gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME"

gcloud run deploy "$FRONTEND_SERVICE_NAME" \
    --image "gcr.io/$PROJECT_ID/$FRONTEND_SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --port 80 \
    --memory 256Mi \
    --cpu 1 \
    --max-instances 10

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE_NAME" \
    --platform managed \
    --region "$REGION" \
    --format 'value(status.url)')

cd ..

# Success message
echo ""
echo "==========================================="
echo -e "${GREEN}🎉 Deployment Successful!${NC}"
echo "==========================================="
echo ""
echo -e "📱 Frontend URL: ${GREEN}$FRONTEND_URL${NC}"
echo -e "🔧 Backend URL:  ${GREEN}$BACKEND_URL${NC}"
echo ""
echo -e "You can now access your Format Converter application at:"
echo -e "${GREEN}$FRONTEND_URL${NC}"
echo ""
echo "To view logs:"
echo "  Frontend: gcloud run logs read $FRONTEND_SERVICE_NAME --region $REGION"
echo "  Backend:  gcloud run logs read $BACKEND_SERVICE_NAME --region $REGION"
echo ""
