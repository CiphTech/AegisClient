import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from '../model/domain';
import { IAegisChannel, AegisChannelFactory } from '../model/channels';

@Injectable()
export class DialogService {

  private readonly _http: HttpClient;
  private _stubChannel: IAegisChannel;

  constructor(http: HttpClient) {
  		this._http = http;
   }

  public getChannel(account: AegisAccount): IAegisChannel{

  	if (this._stubChannel == null)
  		this._stubChannel = AegisChannelFactory.createChannel(account);

  	return this._stubChannel;
  }

  public getVkChannel(account: AegisAccount): IAegisChannel{
  	let channel = AegisChannelFactory.createVkChannel(account, this._http);
  	return channel;
  }

}
