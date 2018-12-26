import { Injectable } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AccountType } from '../model/domain';
import {IAegisToken, SimpleTextToken} from '../model/tokens';
import {HttpClient} from "@angular/common/http";
import { IAegisChannel } from '../model/channels';
import {AegisChannelFactory} from '../factories/channel.factory';
import { AegisConversationFactory } from '../factories/conversation.factory';
import { AegisPerson } from '../model/person';
import { AegisFriendsProvider } from '../factories/friends.provider';

@Injectable()
export class AuthService {

	private _currentId: number = 0;
	private _stubChannel: IAegisChannel;
	public readonly accounts: AegisAccount[] = new Array();
	
	private getNewId(): number {
		let current = ++this._currentId;

		console.log('New account ID: ' + current);
		return current;
	}

	constructor(private _http: HttpClient) { }

	public createAcc(accName: string, type: AccountType, token: string = undefined): void {

		const msg = `New account ${accName} (type ${AccountType[type]})`;
		console.log(msg);

		if (token !== undefined)
			console.log(`Token '${token}'`);

		let tok = new SimpleTextToken(token !== undefined ? token : 'testToken');

		let acc = new AegisAccount(this.getNewId(), type, accName, tok);

		const ch = AegisChannelFactory.createChannel(acc, this._http);
		acc.setChannel(ch);

		this.accounts.push(acc);

		let promise = this.getFriends(acc);

		promise.then(result => console.log(`Friends: ${result}`)).catch(result => console.log(`Rejected: ${result}`));
	}

	public createConv(account: AegisAccount, title: string): Promise<AegisConversation> {
		return AegisConversationFactory.createConv(account, title, this._http);
	}

	public getFriends(account: AegisAccount): Promise<AegisPerson[]> {
		return AegisFriendsProvider.getFriends(account, this._http);
	}

	public getAcc(id: number): AegisAccount {
		for(let acc in this.accounts)
			if (this.accounts[acc].id === id)
				return this.accounts[acc];

		throw new Error(`Cannot find account by id: ${id}`);
	}
}

