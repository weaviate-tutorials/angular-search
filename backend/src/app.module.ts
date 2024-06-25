import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SetupController } from './setup/setup.controller';
import { WeaviateSetupService } from './setup/setup.service';

import { SearchController } from './search/search.controller';
import { WeaviateSearchService } from './search/search.service';

import { MultimodalController } from './multimodal/multimodal.controller';
import { MultimodalService } from './multimodal/multimodal.service';
import { MultimodalSetupService } from './multimodal/multimodal-setup.service';

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
    MultimodalSetupService,
  ],
})
export class AppModule {}
