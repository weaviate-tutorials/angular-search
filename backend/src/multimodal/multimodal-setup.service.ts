import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import weaviate, { Collection, WeaviateClient } from 'weaviate-client';
const { dataType, vectorizer } = weaviate.configure;

import * as fs from 'fs';
import { join } from 'path';

import { readdirSync, readFileSync } from 'fs'

@Injectable()
export class MultimodalSetupService {
    private _client: WeaviateClient = null;

    private async connectToWeaviate(): Promise<WeaviateClient> {        
        const url = process.env.WEAVIATE_URL;
        const adminKey = process.env.WEAVIATE_ADMIN_KEY;
        const googleKey = process.env.GOOGLE_API_KEY;

        console.log('Multimodal Setup Service:: Connecting to Weaviate')
        try {
            const client = await weaviate.connectToWeaviateCloud(url, {
                authCredentials: new weaviate.ApiKey(adminKey),
                headers: {
                    'x-palm-api-key': googleKey
                }
            });
        
            const ready = await client.isReady()
            console.log(`Multimodal Setup Service:: Connect to Weaviate - [IsReady] ${ready}`)

            return client;
        } catch(exception) {
            console.log(`Multimodal Setup Service:: Connect to Weaviate failed: ${exception}`)
        }
    }

    private async getClient(): Promise<WeaviateClient> {
        if(!this._client) {
            this._client = await this.connectToWeaviate();
        }

        return this._client;
    }

    // Multimodal Setup Service Destroy
    private async onModuleDestroy() {
        if(this._client) {
            console.log('Multimodal Setup Service:: Closing the Weaviate Client')
            await this._client.close()
        }
    }


    async createMultimodalCollection(recreate: boolean = false) {
        const client = await this.getClient()

        if(recreate) {
            await client.collections.delete('MyMedia')
        }

        client.collections.create({
            name: 'MyMedia',
            vectorizers: vectorizer.multi2VecPalm({
                imageFields: ['image'],
                videoFields: ['video'],

                projectId: "semi-random-dev",
                location: "us-central1",
                modelId: "multimodalembedding@001",
                dimensions: 1408, // default setting: 1408 available settings: 128, 256, 512, 1408ar
            }),

            properties: [
                { name: "name",  dataType: dataType.TEXT },
                { name: "media",  dataType: dataType.TEXT },
                { name: "image", dataType: dataType.BLOB },
                { name: "video", dataType: dataType.BLOB },
            ]
        })
    }

    private findFiles(sourceFolder) {
        return readdirSync(sourceFolder).map((name) => {
            return {
                name: name,
                // path: `${sourceFolder}${name}`,
                path: join(sourceFolder, name),
            }
        });
    }

    async importImages() {
        // for simplicity, load files from the frontend asset folder
        const imageFiles = this.findFiles('../frontend/public/assets/image')
        console.log(imageFiles)

        const client = await this.getClient()
        const myMedia = client.collections.get('MyMedia')

        let objectsToInsert = []

        for (let imgfile of imageFiles) {
            // construct image objects to insert
            objectsToInsert.push({
                name: imgfile.name,
                image: this.toBase64(imgfile.path),
                media: 'image'
            })

            // insert every time we have 5 objects,
            // images can be big, so we don't want to insert thousands of objects
            if(objectsToInsert.length == 5) {
                await this.insertObjects(objectsToInsert, myMedia)
                objectsToInsert = []
            }
        }

        if(objectsToInsert.length > 0) {
            await this.insertObjects(objectsToInsert, myMedia)
        }

        return { imageFiles }
    }

    async importVideos() {
        // for simplicity, load files from the frontend asset folder
        const videoFiles = this.findFiles('../frontend/public/assets/video')
        console.log(videoFiles)

        const client = this.getClient()
        const myMedia = (await client).collections.get('MyMedia')

        for (let file of videoFiles) {
            // construct image objects to insert
            const itemToInsert = {
                name: file.name,
                video: this.toBase64(file.path),
                media: 'video'
            }

            try {
                // videos take long to vectorize - insert one object at a time
                await myMedia.data.insert(itemToInsert)
            } catch(e) {
                console.log(JSON.stringify(e))
                return e
            }
        }

        return { videoFiles }
    }
    
    private async insertObjects(objectsToInsert: any[], collection: Collection) {
        const response = await collection.data.insertMany(objectsToInsert)

        if(response.hasErrors) {
            throw new HttpException(
                this.prepareErrorSummary(response),
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
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

    toBase64(fileUrl: string) {
        const path = join(process.cwd(), fileUrl)
        console.log(path)

        return readFileSync(path, { encoding: 'base64' })
    }
}
