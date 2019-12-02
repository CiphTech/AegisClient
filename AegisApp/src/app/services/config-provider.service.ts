import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigProviderService {

  public getAegisHost(): string {
    return 'localhost';
  }

  public getAegisPort(): number {
    return 5001;
  }

  public getFullAegisUrl(): string {
    return `https://${this.getAegisHost()}:${this.getAegisPort()}`;
  }

  constructor() { }
}
