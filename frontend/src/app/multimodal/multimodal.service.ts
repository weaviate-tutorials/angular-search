import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { tap } from 'rxjs';
import { logResults } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class MultimodalService {

  constructor(private http: HttpClient) {}

  async imageSearch(file: File) {
    const b64 = await this.toBase64FromFile(file);
    console.log({ b64 })

    return this.http.post(
      'http://localhost:3000/multimodal/imageSearch',
      { b64 },
    ).pipe(
      tap(logResults)
    )
  }

  async videoSearch(file: File) {
    const b64 = await this.toBase64FromFile(file);
    console.log({ b64 })

    return this.http.post(
      'http://localhost:3000/multimodal/videoSearch',
      { b64 },
    ).pipe(
      tap(logResults)
    )
  }

  textSearch(query: string) {
    return this.http.post(
      'http://localhost:3000/multimodal/textSearch',
      { query }
    ).pipe(
      tap(logResults)
    )
  }

  // ––– HELPER FUNCTIONS –––
  private async toBase64FromFile(file: File) {
    return this.toBase64(file);
  }

  private async toBase64FromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return this.toBase64(blob);
  }

  private async toBase64(blob: File | Blob) {
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    return (reader.result as string).replace(/^data:.+;base64,/, '')
  }
}
