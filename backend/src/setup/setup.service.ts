import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import weaviate, { WeaviateClient, vectorizer, dataType } from 'weaviate-client'

import * as fs from 'fs';
import { join } from 'path';
import * as readline from 'readline';

@Injectable()
export class WeaviateSetupService {
    private _client: WeaviateClient = null;
    private async connectToWeaviate(): Promise<WeaviateClient> {
        const url = process.env.WEAVIATE_URL;
        const adminKey = process.env.WEAVIATE_ADMIN_KEY;

        console.log('Setup Service:: Connecting to Weaviate')
        try {
            const client = await weaviate.connectToWeaviateCloud(url, {
                authCredentials: new weaviate.ApiKey(adminKey),
            });
        
            const ready = await client.isReady()
            console.log(`Setup Service:: Connect to Weaviate - [IsReady] ${ready}`)

            return client;
        } catch(exception) {
            console.log(`Setup Service:: Connect to Weaviate failed: ${exception}`)
        }
    }

    // Setup Service Init
    // private async onModuleInit(): Promise<void> {
    //     await this.connectToWeaviate()
    // }

    private async getClient(): Promise<WeaviateClient> {
        if(!this._client) {
            this._client = await this.connectToWeaviate();
        }

        return this._client;
    }

    // Setup Service Destroy
    private async onModuleDestroy() {
        if(this._client) {
            console.log('Setup Service:: Closing the Weaviate Client')
            await this._client.close()
        }
    }

    public async getCollections() {
        const client = await this.getClient();
        return client.collections.listAll()
    }

    public async createWiki(recreate: boolean = false) {
        const client = await this.getClient();

        if (recreate)
            await client.collections.delete('Wiki')

        return client.collections.create({
            name: 'Wiki',
            vectorizers: vectorizer.text2VecCohere({
                model: 'embed-multilingual-v3.0',
                sourceProperties: ['title', 'text']
            }),

            // (Optional)
            properties: [
                { name: "text",  dataType: dataType.TEXT },
                { name: "title", dataType: dataType.TEXT },
                { name: "url",   dataType: dataType.TEXT },
                // { name: "lang",    dataType: dataType.TEXT },
                // { name: "lang_id", dataType: dataType.INT },
            ]
        })
    }

    public importWikiData() {
        return this.importData('wiki-25k-vectors.jsonp', 'Wiki')
    }
    
    public importWikiDataWithVectors() {
        return this.importDataWithVectors('wiki-25k-vectors.jsonp', 'Wiki')
        // return this.importDataWithVectors('wiki-10-vectors.jsonp', 'Wiki')
    }

    private async importData(fileName, collectionName) {
        const client = await this.getClient();

        const filePath = join(process.cwd(), `./files/${fileName}`)
        const file = readline.createInterface({ input: fs.createReadStream(filePath), output: process.stdout, terminal: false });

        const wiki = client.collections.get(collectionName)
        let itemsToInsert = []
        let counter = 0;

        for await (const line of file) {
            counter++;
            if(counter % 1000 == 0)
                console.log(`Import: ${counter}`)

            const item = JSON.parse(line)

            // prepare objects to insert
            itemsToInsert.push({
                title: item.title,
                text: item.text,
                url: item.url
            })

            // insert data in batches of 2k objects
            if(itemsToInsert.length == 2000) {
                const response = await wiki.data.insertMany(itemsToInsert)
                itemsToInsert = []

                if(response.hasErrors) {
                    throw new HttpException(
                        this.prepareErrorSummary(response),
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                }
            }
        }

        // insert the remaining objects
        if(itemsToInsert.length > 0) {
            const response = await wiki.data.insertMany(itemsToInsert)

            if(response.hasErrors) {
                throw new HttpException(
                    this.prepareErrorSummary(response),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                )
            }
        }

        return { status: "Import Complete"}
    }

    private async importDataWithVectors(fileName, collectionName) {
        const client = await this.getClient();

        const filePath = join(process.cwd(), `./files/${fileName}`)
        const file = readline.createInterface({ input: fs.createReadStream(filePath), output: process.stdout, terminal: false });

        let itemsToInsert = []
        let counter = 0;
        
        const wiki = client.collections.get(collectionName)
        for await (const line of file) {
            counter++;
            if(counter % 1000 == 0)
                console.log(`Import: ${counter}`)

            const item = JSON.parse(line)

            // prepare objects to insert
            itemsToInsert.push({
                properties: {
                    title: item.title,
                    text: item.text,
                    url: item.url
                },
                vectors: { default: item.vector },
                id: item.uuid
            })

            // insert data in batches of 5k objects
            if(itemsToInsert.length == 5000) {
                const response = await wiki.data.insertMany(itemsToInsert)
                itemsToInsert = []

                if(response.hasErrors) {
                    throw new HttpException(
                        this.prepareErrorSummary(response),
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                }
            }
        }
        console.log(`Import: ${counter}`)

        // insert the remaining objects
        if(itemsToInsert.length > 0) {
            const response = await wiki.data.insertMany(itemsToInsert)

            if(response.hasErrors) {
                throw new HttpException(
                    this.prepareErrorSummary(response),
                    HttpStatus.INTERNAL_SERVER_ERROR,
                )
            }
        }

        return { status: "Import Complete"}
    }

    public async getCollectionCount(collectionName) {
        const client = await this.getClient();

        const wiki = client.collections.get(collectionName)
        return wiki.aggregate.overAll()
    }

    private prepareErrorSummary(response) {
        const errorKeys = Object.keys(response.errors)

        const errorSummary = {
            errorCount: errorKeys.length,
            firstError: response.errors[errorKeys[0]].message,
            // rawErrors: response.errors
        }

        console.log('===== DATA IMPORT FAILED =====')
        console.log(errorSummary)
        console.log('===============================')

        return errorSummary;
    }
}
