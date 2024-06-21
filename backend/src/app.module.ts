import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { SetupController } from './setup/setup.controller';

import { AppService } from './app.service';
import { WeaviateSetupService } from './setup/setup.service';
import { WeaviateSearchService } from './search/search.service';
import { MultimodalController } from './multimodal/multimodal.controller';
import { MultimodalService } from './multimodal/multimodal.service';
import { SearchController } from './search/search.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [
    AppController,
    SetupController,
    MultimodalController,
    SearchController
  ],
  providers: [
    AppService,
    WeaviateSetupService,
    WeaviateSearchService,
    MultimodalService,
  ],
})
export class AppModule {}
