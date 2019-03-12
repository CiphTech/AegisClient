import { Injectable } from '@angular/core';
import { AegisAccount, AccountType } from '../model/domain';
import {SimpleTextToken} from '../model/tokens';
import {HttpClient} from "@angular/common/http";
import {AegisChannelFactory} from '../factories/channel.factory';

@Injectable()
export class AuthService {

	private _currentId: number = 0;
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
		acc.init(ch);

		this.accounts.push(acc);
	}

	public getAcc(id: number): AegisAccount {
		const acc = this.accounts.filter(a => a.id === id);

		if (acc.length > 0)
			return acc[0];

		throw new Error(`Cannot find account by id: ${id}`);
	}
}

