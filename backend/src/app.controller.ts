import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    const setup = {
      baseurl: `http://localhost:3000/setup`,
      createWiki: `http://localhost:3000/setup/createWiki`,
      importData: `http://localhost:3000/setup/importData`,
      getWikiCount: `http://localhost:3000/setup/getWikiCount`,
      listCollections: `http://localhost:3000/setup/listCollections`,
    }

    return { setup }
  }
}
