#!/usr/bin/env bash

echo "preparing..."
export GCLOUD_PROJECT=careerograph-e9963
export INSTANCE_REGION=us-central1
export INSTANCE_ZONE=us-central1-a
export CLUSTER_NAME=reco-cloudrun
export PROJECT_NAME=reco-gcs-es
export IMAGE_NAME=reco-gcs-es

echo "config"
gcloud config set project ${GCLOUD_PROJECT}
gcloud config set compute/zone ${INSTANCE_ZONE}
gcloud config set run/region ${INSTANCE_REGION}

echo "enable apis"
gcloud services enable cloudresourcemanager.googleapis.com

echo "deploy"
gcloud beta run deploy ${PROJECT_NAME} \
    --image gcr.io/${GCLOUD_PROJECT}/${IMAGE_NAME} \
    --region ${INSTANCE_REGION} \
    --platform managed
