import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Model from '../model/domain';
import { IAegisChannel, AegisChannelFactory } from '../model/channels';

@Injectable()
export class DialogService {

  private readonly _http: HttpClient;
  private _stubChannel: IAegisChannel;

  constructor(http: HttpClient) {
  		this._http = http;
   }

  public getChannel(account: Model.AegisAccount): IAegisChannel{

    if (account.accType === Model.AccountType.Vk)
      return AegisChannelFactory.createVkChannel(account, this._http);

  	if (this._stubChannel == null)
  		this._stubChannel = AegisChannelFactory.createChannel(account);

  	return this._stubChannel;
  }

}
