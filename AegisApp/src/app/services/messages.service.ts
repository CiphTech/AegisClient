import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigProviderService } from './config-provider.service';
import { AegisMessage } from '../model/domain';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  /**
   * getMessages
   */
  public async getMessages(conversationId: string, counter: number): Promise<AegisMessage[]> {
    let url = `${this.config.getFullAegisUrl()}/messages/${conversationId}`;

    if (counter > 0)
      url += `?counter=${counter}`;

    let dtos = await this.http.get<MessageDto[]>(url).toPromise();
    return dtos.map(x => MessagesService.DtoToAeg(x));
  }

  /**
   * sendMessage
   */
  public async sendMessage(convId: string, title: string, body: string): Promise<AegisMessage> {
    let dto = await this.http.post<MessageDto>(`${this.config.getFullAegisUrl()}/messages/send`, {
      'conversationId': convId,
      'title': title,
      'body': body
    }).toPromise();

    return MessagesService.DtoToAeg(dto);
  }

  constructor(private readonly http: HttpClient, private readonly config: ConfigProviderService) { }

  private static DtoToAeg(dto: MessageDto): AegisMessage {
    return new AegisMessage(dto.title, dto.body, dto.sentBy, new Date(dto.timestamp), dto.conversationId)
  }
}

class MessageDto {
  public id: string;
  public conversationId: string;
  public sentBy: string;
  public counter: number;
  public title: string;
  public body: string;
  public timestamp: number;
}