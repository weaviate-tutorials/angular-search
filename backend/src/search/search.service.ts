import { Injectable } from '@nestjs/common';
import weaviate, { WeaviateClient, WeaviateReturn } from 'weaviate-client';

@Injectable()
export class WeaviateSearchService {
    private _client: WeaviateClient = null;

    private async connectToWeaviate(): Promise<WeaviateClient> {
        const url = process.env.WEAVIATE_HOST_URL;
        const queryKey = process.env.WEAVIATE_QUERY_KEY;
        const cohereKey = process.env.COHERE_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;

        console.log('Query Service:: Connecting to Weaviate')
        try {
            const client = await weaviate.connectToWeaviateCloud(url, {
                authCredentials: new weaviate.ApiKey(queryKey),
                headers: {
                    "x-cohere-api-key": cohereKey,
                    "x-openai-api-key": openaiKey
                }
            });
        
            const ready = await client.isReady()
            console.log(`Query Service:: Connect to Weaviate - [IsReady] ${ready}`)

            return client;
        } catch(exception) {
            console.log(`Query Service:: Connect to Weaviate failed: ${exception}`)
        }
    }

    private async getClient(): Promise<WeaviateClient> {
        if(!this._client) {
            this._client = await this.connectToWeaviate();
        }

        return this._client;
    }

    private async onModuleDestroy() {
        if(this._client) {
            console.log('Query Service:: Closing the Weaviate Client')
            await this._client.close()
        }
    }

    async semanticSearch(query) {
        const client = await this.getClient();
        const wiki = client.collections.get('Wikipedia')

        // return wiki.query.nearText(query, { limit: 5 })
        return wiki.query.nearText(query, { limit: 5, returnMetadata: [ 'distance' ] })
    }

    async hybridSearch(query) {
        const client = await this.getClient();
        const wiki = client.collections.get('Wikipedia')

        return wiki.query.hybrid(query, {
            alpha: 0.7,
            limit: 5,
            returnMetadata: [ 'score' ],
        })
    }

    async rag(query) {
        const client = await this.getClient();
        const wiki = client.collections.get('Wikipedia')

        const prompts = {
            singlePrompt: 'translate {title} to German',
            groupedTask: 'summarise in bullet points what these wikipedia articles have in common and how they differ from each other'
        };

        return wiki.generate.nearText(
            query,
            prompts,
            { limit: 5 }
        )
    }

    async ragDynamic(query, singlePrompt, groupedTask) {
        const client = await this.getClient();
        const wiki = client.collections.get('Wikipedia')

        let prompts = {};
        if(singlePrompt)
            prompts['singlePrompt'] = singlePrompt;
        if(groupedTask)
            prompts['groupedTask'] = groupedTask;

        console.log({query, singlePrompt, groupedTask})

        return wiki.generate.nearText(
            query,
            prompts,
            { limit: 5 }
        )
    }
}
