import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MultimodalService } from './multimodal.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-multimodal',
  standalone: true,
  imports: [    
    FormsModule,
    CommonModule,
  ],
  templateUrl: './multimodal.component.html',
})
export class MultimodalComponent {
  query = 'Birds with colourful feathers'
  result$!: Observable<any>;
  
  constructor(private multimodal: MultimodalService) {}

  textSearch() {
    this.result$ = this.multimodal.textSearch(this.query)
  }

  imageSearch($event: any) {
    const file: File = $event.target.files[0];

    this.result$ = this.multimodal.imageSearch(file);
  }

  videoSearch($event: any) {
    const file: File = $event.target.files[0];

    this.result$ = this.multimodal.videoSearch(file);
  }
}
