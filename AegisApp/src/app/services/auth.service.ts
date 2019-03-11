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

		const prom = this.getConv(acc);

		prom.then(convList => convList.forEach(conv => acc.addConv(conv))).catch(err => console.log(err));

		this.accounts.push(acc);
	}

	public createConv(account: AegisAccount, title: string, friends: AegisPerson[]): Promise<AegisConversation> {
		return AegisConversationFactory.createConv(account, title, friends, this._http);
	}

	public getConv(account: AegisAccount): Promise<AegisConversation[]>{
		return AegisConversationFactory.getConv(account, this._http);
	}

	public getFriends(account: AegisAccount): Promise<AegisPerson[]> {
		return AegisFriendsProvider.getFriends(account, this._http);
	}

	public getAcc(id: number): AegisAccount {
		const acc = this.accounts.filter(a => a.id === id);

		if (acc.length > 0)
			return acc[0];

		throw new Error(`Cannot find account by id: ${id}`);
	}
}

