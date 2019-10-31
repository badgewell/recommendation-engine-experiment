const { Client } = require('@elastic/elasticsearch');
import { cleanObjectForElasticSearch } from '../util/cleanObjectForElasticSearch';
import { flatMap } from '../util/flatMap';
export const client = new Client(process.env.ELASTIC_URL);


export const indexBulk = async(index, items) => {

  try {
    let updates = items.map(item => cleanObjectForElasticSearch(item));
    updates = flatMap(doc => [{ index: { _index: index , _id: doc.id } }, doc], updates);

    const { body } = await client.bulk({ refresh: 'true', body: updates });

    if (body.errors) {
      const errorDocuments = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      // for(const item of body.it)
      body.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          errorDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[i * 2 + 1]
          });
        }
      });
      console.error('sync-index-error:' , JSON.stringify(errorDocuments));
      throw new Error('sync was not made successfully');
    }

    const { body: count } = await client.count({ index });
    console.log('number of items in the index', count);

    return body;
  } catch (error) {
    console.error(error);
    throw new Error(error);

  }

};