const request = require('request-promise-native')
const dotenv = require("dotenv").config()
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const DataFrame = require('dataframe-js').DataFrame;
const { Storage } = require('@google-cloud/storage');

const url = process.env.ELASTIC_URL;
const storage = new Storage();
const bucketName = process.env.BUCKET_NAME;

let badgeQ = "/badges_reco/_search"
let badgeBody = {
    "from": 0,
    "size":3000,
    "_source":["id","tags"],
    "query": {
        "bool": {
            "filter": [
                { "terms" : {"privacy.keyword": ["PUBLIC"] } }
            ]
        }
    }
}

let userQ = "/users_reco/_search"
let userBody = {
    "from": 0, "size": 10000,
    "_source": ["key", "skills"]
}

function getData(url,query,body){
	const options = {
	    method: 'POST',
	    uri: url+query,
	    body: body,
	    json: true
	};
	return request(options);
}

function writeToFile(header, path, record){
	const csvWriter = createCsvWriter({
		header: header,
	    path: path
	});
	return csvWriter.writeRecords(record);
}

async function uploadToGCS(filename , destination){
	// Uploads a local file to the bucket
	await storage.bucket(bucketName).upload(filename, {
  		// Support for HTTP requests made with `Accept-Encoding: gzip`
		gzip: true,
		destination: destination,
		// By setting the option `destination`, you can change the name of the
		// object you are uploading to a bucket.
		metadata: {
			// Enable long-lived HTTP caching headers
			// Use only if the contents of the file will never change
			// (If the contents will change, use cacheControl: 'no-cache')
			cacheControl: 'no-cache',
		},
	});
}

async function getBadge(url,badgeQ,badgeBody){

	const data = await getData(url,badgeQ,badgeBody);
	let maxlen = 0, df = new DataFrame(data.hits.hits);
	const datalen = df.count();
	
	df = df.toDict()._source;
	for (let i = 0; i<datalen ; ++i )
		maxlen = Math.max(maxlen,Object.keys(df[i].tags).length);
	
	let header = ['id'] , record = [];
	for(let i=0 ; i<maxlen ; i++)
		header.push('tags['+i+']')

	for (let i = 0; i<datalen ; ++i ){
		let obj = [df[i].id]
		for (let j in df[i].tags)
			obj.push(df[i].tags[j]);
		record.push(obj)
	}

	await writeToFile(header, './data/badge.csv', record);
	uploadToGCS('./data/badge.csv','/data/badge.csv')
}

async function getUser(url,userQ,userBody){

	const data = await getData(url,userQ,userBody);
	let maxlen = 0 ,df = new DataFrame(data.hits.hits);
	const datalen = df.count();
	
	df = df.toDict()._source;

	for (let i = 0; i<datalen ; ++i )
		if(typeof(df[i].skills) != 'undefined')
			maxlen = Math.max(maxlen,Object.keys(df[i].skills).length);
	
	let header = ['key'] , record = [];
	for(let i=0 ; i<maxlen ; i++){
		header.push('skill['+i+']')
		header.push('count['+i+']')
	}

	for (let i = 0; i<datalen ; ++i ){
		let obj = [df[i].key]
		if(typeof(df[i].skills) != 'undefined'){
			for (let j in df[i].skills){
				obj.push(j);
				obj.push(df[i].skills[j]);	
			}
		}
		record.push(obj)
	}

	await writeToFile(header, './data/user.csv', record);
	uploadToGCS('./data/user.csv', '/data/user.csv');
}

export const extractData = async(req, res, next) => {
    try{
    	await Promise.all([
			getBadge(url,badgeQ,badgeBody),
			getUser(url,userQ,userBody)
		]);
       	
       	next()
    } catch(error){
        console.error(error);
        res.status(500).send()
    }
};


