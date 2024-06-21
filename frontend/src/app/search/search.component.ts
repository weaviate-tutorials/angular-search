import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { Observable, tap } from 'rxjs';
import { logResults } from '../utils';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  query = 'Dynamics of plane flight'
  prompt = 'Explain in steps how planes fly? Return the response in Markdown.'

  result$!: Observable<any>;

  constructor(private http: HttpClient) {}

  public async search() {
    const params = {
      query: this.query
    }
    this.result$ = this.http.get<any>('http://localhost:3000/search/text', {params})
      .pipe(
        tap(logResults)
      )
  }

  public async hybrid() {
    const params = {
      query: this.query
    }

    this.result$ = this.http.get<any>('http://localhost:3000/search/hybrid', {params})
      .pipe(
        tap(logResults)
      )
  }

  public async rag() {
    const params = {
      query: this.query,
      single: 'translate {title} to French',
      group: this.prompt,
    }

    this.result$ = this.http.get<any>('http://localhost:3000/search/dynamicrag', {params})
      .pipe(
        tap(logResults)
      );
  }
}
