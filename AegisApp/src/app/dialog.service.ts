import { Injectable } from '@angular/core';
import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './model/domain';
import { IAegisChannel, AegisChannelFactory } from './model/channels';

@Injectable()
export class DialogService {

  private _stubChannel: IAegisChannel;

  constructor() { }

  public getChannel(account: AegisAccount): IAegisChannel{

  	if (this._stubChannel == null)
  		this._stubChannel = AegisChannelFactory.createChannel(account);

  	return this._stubChannel;
  }

}
