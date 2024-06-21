import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MultimodalService } from './multimodal.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-multimodal',
  standalone: true,
  imports: [    
    FormsModule,
    CommonModule,
    
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatCardModule,
    MatChipsModule,],
  templateUrl: './multimodal.component.html',
  styleUrl: './multimodal.component.scss'
})
export class MultimodalComponent {
  query = 'Birds with colourful feathers'
  result$!: Observable<any>;
  
  constructor(private multimodal: MultimodalService) {}

  textSearch() {
    this.result$ = this.multimodal.textSearch(this.query)
  }

  async imageSearch($event: any) {
    const file: File = $event.target.files[0];

    this.result$ = await this.multimodal.imageSearch(file);
  }

  async videoSearch($event: any) {
    const file: File = $event.target.files[0];

    this.result$ = await this.multimodal.videoSearch(file);
  }
}
