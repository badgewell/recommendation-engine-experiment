#!/usr/bin/env bash

echo "preparing..."
export GCLOUD_PROJECT=careerograph-e9963
export INSTANCE_REGION=us-central1
export INSTANCE_ZONE=us-central1-a
export CLUSTER_NAME=reco-cloudrun
export PROJECT_NUMBER=669874223858
export TOPIC_NAME=reco-gcs-es
export SUBSCRIPTION_NAME=reco-subscriber
export SERVICE_URL=https://reco-gcs-es-tnea43a6tq-uc.a.run.app
export PROJECT_NAME=reco-gcs-es
export INVOKER_NAME=cloud-run-pubsub-invoker


echo "config"
gcloud config set project ${GCLOUD_PROJECT}
gcloud config set compute/zone ${INSTANCE_ZONE}
gcloud config set run/region ${INSTANCE_REGION}
 
echo "create iam binding"
gcloud projects add-iam-policy-binding careerograph-e9963 \
     --member=serviceAccount:service-669874223858@gcp-sa-pubsub.iam.gserviceaccount.com \
     --role=roles/iam.serviceAccountTokenCreator
 
echo "create service account"
gcloud iam service-accounts create cloud-run-pubsub-invoker \
     --display-name "Cloud Run Pub/Sub Invoker"
 
echo "iam roles"
gcloud beta run services add-iam-policy-binding reco-gcs-es \
     --member=serviceAccount:cloud-run-pubsub-invoker@careerograph-e9963.iam.gserviceaccount.com \
     --role=roles/run.invoker

echo "create subscription"
gcloud beta pubsub subscriptions create reco-subscriber \
    --topic reco-gcs-es \
    --push-endpoint=https://reco-gcs-es-tnea43a6tq-uc.a.run.app/ \
    --push-auth-service-account=cloud-run-pubsub-invoker@careerograph-e9963.iam.gserviceaccount.com
