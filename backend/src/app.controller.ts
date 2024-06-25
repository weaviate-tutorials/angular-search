import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    const setup = {
      baseurl: 'http://localhost:3000/setup',
      createWiki: 'http://localhost:3000/setup/createWiki',
      importData: 'http://localhost:3000/setup/importData',
      getWikiCount: 'http://localhost:3000/setup/getWikiCount',
      listCollections: 'http://localhost:3000/setup/listCollections',
    }

    const search = {
      baseurl: 'http://localhost:3000/search',
      text: 'http://localhost:3000/search/text?query=dynamics%20of%20plane%20flight',
      hybrid: 'http://localhost:3000/search/hybrid?query=dynamics%20of%20plane%20flight',
      rag: 'http://localhost:3000/search/rag?query=dynamics%20of%20plane%20flight',
      dynamicrag_single: 'http://localhost:3000/search/dynamicrag?query=dynamics%20of%20plane%20flight&single=translate%20{title}%20to%20german',
      dynamicrag_group: 'http://localhost:3000/search/dynamicrag?query=dynamics%20of%20plane%20flight&group=given%20the%20provided%20content,%20explain%20why%20planes%20fly',
    }

    return { setup, search }
  }
}
