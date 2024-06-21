import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { WeaviateSearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: WeaviateSearchService) {}
    
    @Get('text')
    textSearch(@Query('query') query: string) {
        console.log({ query })
        
        return this.searchService.semanticSearch(query)
    }
    
    @Get('hybrid')
    hybridSearch(@Query('query') query: string) {
        console.log({ query })
        
        return this.searchService.hybridSearch(query)
    }
    
    @Get('rag')
    rag(@Query('query') query: string) {
        console.log({ query })
        
        return this.searchService.rag(query)
    }
    
    @Get('dynamicrag')
    dynamicRag(
        @Query('query') query: string,
        @Query('single') singlePrompt: string,
        @Query('group') groupPrompt: string
    ) {
        console.log({ query, singlePrompt, groupPrompt })
        
        if(!singlePrompt && !groupPrompt) {
            throw new BadRequestException(
                'Missing query params',
                { cause: new Error(), description: 'Missing single or group params' }
            )
        }
        
        return this.searchService.ragDynamic(query, singlePrompt, groupPrompt)
    }
}
