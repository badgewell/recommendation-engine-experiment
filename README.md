# Recommendation Engine 0.1v
> A content based recommendation engine using only shared skills
## Overview
- The system fetches the data from elastic search and save it on Cloud Storage
- A Dataflow job kicks in that result in writing the recommendations again on Cloud Storage
- A pubsub event triggers that takes the Cloud Storage recommendations and save it into elastic search
