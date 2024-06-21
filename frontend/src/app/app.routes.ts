import { Routes } from '@angular/router';
import { RagComponent } from './rag/rag.component';
import { SearchComponent } from './search/search.component';
import { MultimodalComponent } from './multimodal/multimodal.component';

export const routes: Routes = [
    {path: '', component: SearchComponent},
    {path: 'rag', component: RagComponent},
    {path: 'multimodal', component: MultimodalComponent},
];
