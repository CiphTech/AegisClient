import { Injectable } from '@angular/core';
import { AegisPerson } from '../model/person';
import { HttpClient } from '@angular/common/http';
import { ConfigProviderService } from './config-provider.service';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  /**
   * getPersons
   */
  public async getPersons(): Promise<AegisPerson[]> {
    
    let dtos = await this.http.get<AegisPersonDto[]>(`${this.config.getFullAegisUrl()}/persons`).toPromise();
    return dtos.map(x => new AegisPerson(x.id, x.name, ''));
  }

  /**
   * getPerson
   */
  public async getPerson(id: string): Promise<AegisPerson> {
    
    let dto = await this.http.get<AegisPersonDto>(`${this.config.getFullAegisUrl()}/persons/${id}`).toPromise();
    return new AegisPerson(dto.id, dto.name, '');
  }

  constructor(private readonly http: HttpClient, private readonly config: ConfigProviderService) { }
}

class AegisPersonDto {

  public id: string;
  public name: string;

}
