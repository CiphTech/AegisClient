import { AegisAccount, AccountType } from '../model/domain';
import {IAegisChannel, AegisStubChannel} from '../model/channels';
import {AegisVkChannel} from '../model/channels.vk';
import {HttpClient} from '@angular/common/http';

export class AegisChannelFactory {

	public static createChannel(account: AegisAccount, http: HttpClient): IAegisChannel{
        console.log('Creating new channel for account ' + account.accName);
        
        switch(account.accType){
            case AccountType.Vk:
                return this.createVkChannel(account, http);

            default:
                return new AegisStubChannel();
        }
	}

	private static createVkChannel(account: AegisAccount, http: HttpClient): IAegisChannel{
		let channel = new AegisVkChannel(http);

		channel.setCreds(account.token);

		return channel;
	}
}