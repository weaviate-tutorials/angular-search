import { Injectable } from '@nestjs/common';
import weaviate, { WeaviateClient } from 'weaviate-client';

export type MediaObject = {
    name: string;
    media: string;
    extension: string;
}

@Injectable()
export class MultimodalService {
    private _client: WeaviateClient = null;

    private async connectToWeaviate(): Promise<WeaviateClient> {        
        const url = process.env.WEAVIATE_URL;
        const adminKey = process.env.WEAVIATE_ADMIN_KEY;
        const googleKey = process.env.GOOGLE_API_KEY;

        console.log('Multimodal Service:: Connecting to Weaviate')
        try {
            const client = await weaviate.connectToWeaviateCloud(url, {
                authCredentials: new weaviate.ApiKey(adminKey),
                headers: {
                    'x-palm-api-key': googleKey
                }
            });
        
            const ready = await client.isReady()
            console.log(`Multimodal Service:: Connect to Weaviate - [IsReady] ${ready}`)

            return client;
        } catch(exception) {
            console.log(`Multimodal Service:: Connect to Weaviate failed: ${exception}`)
        }
    }

    private async getClient(): Promise<WeaviateClient> {
        if(!this._client) {
            this._client = await this.connectToWeaviate();
        }

        return this._client;
    }

    // Multimodal Service Destroy
    private async onModuleDestroy() {
        if(this._client) {
            console.log('Multimodal Service:: Closing the Weaviate Client')
            await this._client.close()
        }
    }

    async searchWithText(query: string) {
        const client = await this.getClient()

        const gallery = client.collections.get<MediaObject>('MyMedia')
        return gallery.query.nearText(query, {
            limit: 5,
            // filters: gallery.filter.byProperty('media').equal('image')
        })
    }

    async searchWithVideoFile(file: any) {
        const client = await this.getClient()

        const gallery = client.collections.get('MyMedia')
        return gallery.query.nearImage(file, {
            limit: 5,
            // filters: gallery.filter.byProperty('media').equal('image')
        })
    }

    async searchWithImage(b64Image: string) {
        const client = await this.getClient()

        const gallery = client.collections.get('MyMedia')
        return gallery.query.nearImage(b64Image, {
            limit: 5,
            // filters: gallery.filter.byProperty('media').equal('image')
        })
    }

    async searchWithVideo(b64Video: string) {
        const client = await this.getClient()

        const gallery = client.collections.get('MyMedia')
        return gallery.query.nearMedia(b64Video, 'video', {
            limit: 5
        })
    }
}
