import { 
    Controller, 
    Body, Post, 
    UploadedFile, UseInterceptors, ParseFilePipe, 
    FileTypeValidator
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { MultimodalService } from './multimodal.service';
import { MultimodalSetupService } from './multimodal-setup.service';

const imageValidator = new ParseFilePipe({
    validators: [
        new FileTypeValidator({
            fileType: 'image/jpeg',
        })
    ]
});
const videoValidator = new ParseFilePipe({
    validators: [
        new FileTypeValidator({
            fileType: 'video/mp4',
        })
    ]
})

@Controller('multimodal')
export class MultimodalController {
    
    constructor(
        private readonly searchService: MultimodalService,
        private readonly setupService: MultimodalSetupService,
    ) {}

    @Post('setup/createCollection')
    async createCollection() {
        return this.setupService.createMultimodalCollection(true)
    }

    @Post('setup/importImages')
    async importImages() {
        return this.setupService.importImages()
    }

    @Post('setup/importVideos')
    async importVideos() {
        return this.setupService.importVideos()
    }
    
    @Post('textSearch')
    async textSearch(@Body('query') query) {
        console.log({query});
        
        return this.searchService.searchWithText(query)
    }

    @Post('imageSearch')
    @UseInterceptors(FileInterceptor('searchFile'))
    imageSearchWithFile(@UploadedFile(imageValidator) file: Express.Multer.File) {
        console.log(file)

        const b64 = file.buffer.toString('base64');

        return this.searchService.searchWithImage(b64)
    }

    @Post('videoSearch')
    @UseInterceptors(FileInterceptor('searchFile'))
    uploadFile(@UploadedFile(videoValidator) file: Express.Multer.File) {
        console.log(file)

        const b64 = file.buffer.toString('base64');

        return this.searchService.searchWithVideo(b64)
    }
    
    // Alternative methods when we want to send a base64 string of the file,
    // instead of sending the file

    @Post('imageSearchB64')
    async imageSearch(@Body('b64') b64) {
        console.log({b64});
        
        return this.searchService.searchWithImage(b64)
    }
    
    @Post('videoSearchB64')
    async videoSearch(@Body('b64') b64) {
        console.log({b64});
        
        return this.searchService.searchWithVideo(b64)
    }
}
