#!/usr/bin/env bash

echo "preparing..."
export GCLOUD_PROJECT=careerograph-e9963
export INSTANCE_REGION=us-central1
export INSTANCE_ZONE=us-central1-a
export CLUSTER_NAME=reco-cloudrun
export IMAGE_NAME=reco-gcs-es

echo "config"
gcloud config set project ${GCLOUD_PROJECT}
gcloud config set compute/zone ${INSTANCE_ZONE}

echo "enable apis"
gcloud services enable \
    container.googleapis.com \
    containerregistry.googleapis.com \
    cloudbuild.googleapis.com

echo "build"
gcloud builds submit --tag gcr.io/${GCLOUD_PROJECT}/${IMAGE_NAME} ../
