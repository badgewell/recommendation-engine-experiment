# Recommendation Engine 0.1v
> A content based recommendation engine using only shared skills.
## Overview
- The system fetches the data from elastic search and save it on Cloud Storage.
- A Dataflow job kicks in that result in writing the recommendations again on Cloud Storage.
- A pubsub event triggers that takes the Cloud Storage recommendations and save it into elastic search.

## Pros
- The system is cheap to run.
- The system can auto-scale.
- The system can turn into Streaming mode with almost no code changes.
- Apache Beam can run on top of any Apache Spark enviroment.
- Support Tensorflow.

## Cons
- Still young community.
- Lacks alot of connectors and libaries especially on python. no elastic search connector for example.
