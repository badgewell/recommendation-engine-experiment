
##   General Steps of building and running the pipeline  

- CronJob triggers Cloud Run
- Cloud Run read data from Elastic search and upload to GCS
- Uploading data to GCS then launching the pipeline
- The pipeline read data from GCS then Write after processing to GCS
- Writing to GCS triggers PubSub Notification which start Cloud run 
- Cloud Run Read the processed JSON data from GCS and write to Elastic search

---

# Cron Job

Create a Cron Job and specify the scheduling time using [cron-job](https://cron-job.org), then use this url to trigger CloudRun.
```
URL: https://reco-gcs-es-tnea43a6tq-uc.a.run.app/readData
```

---
# Pipeline

## Initial setup

### Getting the source code
You can clone the repository.
The rest of the instructions assume that you are in that directory.
```bash
git clone 'url'
cd recoSys
```

### Python virtual environment

> NOTE: It is recommended to run on `python2`.
Install a [Python virtual environment](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments).

Run the following to set up and activate a new virtual environment:
```bash
python2.7 -m virtualenv env
source env/bin/activate
```
Once you are done you can deactivate the virtual environment by running `deactivate`.

### Installing requirements
You can use the `requirements.txt` to install the dependencies.
```bash
pip install -U -r requirements.txt
```

### Cloud SDK Setup (Optional)

If you have never created application default credentials (ADC), you can create it by `gcloud` command. Following steps are required to `./run-cloud`
and `./run-local` if you used a cloud storage bucket. 

```bash
gcloud auth application-default login
```

### Preprocessing
> Source code: [`pipeline.py`](pipeline.py)


**Running the pipeline locally**

``` bash
./run-local 
```
> Make sure to update `LOCAL_DIR` to the desired location in the `run-local` file, you can also give it a cloud bucket.

**Running the pipeline (Cloud)**

``` bash
./run-cloud 
```
> Make sure to update the variables in the `run-cloud` file.


**Update the pipeline**

After updating the pipeline and changing the code and testing locally using `run-local`,
you will have to run `run-cloud` to run using Dataflow and deploy the template to GCS.

---

# Node js Service using Cloud Run

1. Data Extraction part where it read raw data from elastic search and upload it GCS
2. Writing processed data (JSON) from GCS to elastic search

---

## Update Node js Service

After updating the node js code you will have to build and deploy it again to Cloud Run
> Assuming you are in the Node js directory
```bash
    cd scripts && ./build.sh && ./deploy.sh
```

## Create a PubSub Topic/Subscribtion

