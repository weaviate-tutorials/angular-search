import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MultimodalService } from './multimodal.service';

@Controller('multimodal')
export class MultimodalController {

    constructor(private readonly multimodalService: MultimodalService) {}

    @Post('imageSearch')
    async imageSearch(@Body('b64') b64) {
        console.log({b64});

        return this.multimodalService.searchWithImage(b64)
    }

    @Post('videoSearch')
    async videoSearch(@Body('b64') b64) {
        console.log({b64});

        return this.multimodalService.searchWithVideo(b64)
    }

    @Post('textSearch')
    async textSearch(@Body('query') query) {
        console.log({query});

        return this.multimodalService.searchWithText(query)
    }

    @Get('textSearch')
    async alt_textSearch(@Query('query') query) {
        console.log({query});

        return this.multimodalService.searchWithText(query)
    }
}
