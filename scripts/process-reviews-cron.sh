#!/bin/bash

# Cron job script to process pending AI reviews
# This script should be run every minute via cron

# Configuration
API_URL="${NEXT_PUBLIC_BASE_URL:-https://ehecommunityweb.de}/api/process-pending-reviews"
LOG_FILE="/var/log/ai-review-processor.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting AI review processing..."

# Call the API endpoint
response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -w "\n%{http_code}" \
    --max-time 120)

# Extract HTTP status code
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

# Check if successful
if [ "$http_code" = "200" ]; then
    log "✅ Successfully processed reviews: $body"
else
    log "❌ Error processing reviews (HTTP $http_code): $body"
fi

log "Completed AI review processing"
