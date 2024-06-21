import { Controller, Get } from '@nestjs/common';
import { WeaviateSetupService } from './setup.service';

@Controller('setup')
export class SetupController {

    constructor(private readonly setupService: WeaviateSetupService) {}

    @Get()
    helloSetup() {
        return "use /listCollections or /createWiki"
    }

    @Get('listCollections')
    listCollections() {
        return this.setupService.getCollections()
    }

    @Get('createWiki')
    createWiki() {
        return this.setupService.createWiki()
    }

    @Get('importData')
    importData() {
        return this.setupService.importWikiDataWithVectors()
    }

    @Get('getWikiCount')
    getWikiCount() {
        return this.setupService.getCollectionCount('Wiki')
    }

}
