import { 
    Controller, 
    Body, Post, 
    UploadedFile, UseInterceptors, ParseFilePipe, 
    FileTypeValidator
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { MultimodalService } from './multimodal.service';

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
    
    constructor(private readonly multimodalService: MultimodalService) {}
    
    @Post('textSearch')
    async textSearch(@Body('query') query) {
        console.log({query});
        
        return this.multimodalService.searchWithText(query)
    }

    @Post('imageSearch')
    @UseInterceptors(FileInterceptor('searchFile'))
    imageSearchWithFile(@UploadedFile(imageValidator) file: Express.Multer.File) {
        console.log(file)

        const b64 = file.buffer.toString('base64');

        return this.multimodalService.searchWithImage(b64)
    }

    @Post('videoSearch')
    @UseInterceptors(FileInterceptor('searchFile'))
    uploadFile(@UploadedFile(videoValidator) file: Express.Multer.File) {
        console.log(file)

        const b64 = file.buffer.toString('base64');

        return this.multimodalService.searchWithVideo(b64)
    }
    
    // Alternative methods when we want to send a base64 string of the file,
    // instead of sending the file

    @Post('imageSearchB64')
    async imageSearch(@Body('b64') b64) {
        console.log({b64});
        
        return this.multimodalService.searchWithImage(b64)
    }
    
    @Post('videoSearchB64')
    async videoSearch(@Body('b64') b64) {
        console.log({b64});
        
        return this.multimodalService.searchWithVideo(b64)
    }
}
