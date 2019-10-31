const { GoogleAuth } = require('google-auth-library');
//import * as request from 'request-promise-native';
import { indexBulk } from '../config/elasticSearch';

async function getDataGCS(url) {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/devstorage.read_only'
  });
  const client = await auth.getClient();
  const res = await client.request({ url });
  return res.data;
}

export const readGCS = async(req, res, next) => {
    try{
        if (!req.body) {
            const msg = "no Pub/Sub message received";
            console.error(`error: ${msg}`);
            res.status(400).send(`Bad Request: ${msg}`);
            return
        }
        if (req.body.message.attributes.eventType !== "OBJECT_FINALIZE"){
            const msg = "Delete message received";
            console.error(`error: ${msg}`);
            res.status(200).send(`Bad Request: ${msg}`);
            return   
        }

        const data = req.body.message.data;
        const obj = JSON.parse(Buffer.from(data, 'base64')
            .toString()
            .trim())

        if (!obj.name.includes('output/dotProductWithout{}')) {
            const msg = "invalid Pub/Sub message format";
            console.error(`error: ${msg}`);
            res.status(200).send(`Bad Request: ${msg}`);
            return
        }
        const dataUrl = obj.mediaLink;
        req.body = await getDataGCS(dataUrl);
        
        next();
    } catch(error){
        console.error(error);
        res.status(500).send()
    }
};


export const writeES = async(req, res) => {
    try{
        if (!req.body) {
            const msg = "no Data received from GCS";
            console.error(`error: ${msg}`);
            res.status(400).send(`Bad Request: ${msg}`);
            return
        }
        // replace single quote with double, add curly brackets
        // remove last , 

        let data = "{"+req.body
        data = data.replace(/'/g, '"');
        data = data.slice(0,-2)+'}'
        data = JSON.parse(data)

        // write JSON data to ES in bulks
        const response = await indexBulk(process.env.ELASTIC_INDEX, data);
    
        return res.json(response);
    } catch(error){
        console.error(error);
        res.status(500).send()
    }
}
