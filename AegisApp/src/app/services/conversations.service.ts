import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProviderService } from './config-provider.service';
import { AegisConversation } from '../model/domain';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  /**
   * getConversations
   */
  public async getConversations(): Promise<AegisConversation[]> {
    
    let dtos = await this.http.get<ConversationDto[]>(`${this.config.getFullAegisUrl()}/conversations`).toPromise();
    return dtos.map(x => new AegisConversation(x.title, x.id));
  }

  /**
   * getConversation
   */
  public async getConversation(id: string): Promise<AegisConversation> {
    let dto = await this.http.get<ConversationDto>(`${this.config.getFullAegisUrl()}/conversations/${id}`).toPromise();
    return new AegisConversation(dto.title, dto.id);
  }

  /**
   * createConversation
   */
  public async createConversation(title: string, participants: string[]): Promise<AegisConversation> {
    
    let dto = await this.http.post<ConversationDto>(`${this.config.getFullAegisUrl()}/conversations/create`, {
      'title': title,
      'participants': participants
    }).toPromise();

    return new AegisConversation(dto.title, dto.id);
  }

  constructor(private readonly http: HttpClient, private readonly config: ConfigProviderService) { }
}

class ConversationDto {
  
  public id: string;
  public title: string;
  public admin: string;
  public participants: string[];
}