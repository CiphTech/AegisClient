import { Injectable } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AccountType } from '../model/domain';
import {IAegisToken, SimpleTextToken} from '../model/tokens';
import {HttpClient} from "@angular/common/http";

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

		let acc = new AegisAccount(this.getNewId(), AccountType.Vk, accName, tok);

		this.accounts.push(acc);
	}

	public createConv(account: AegisAccount, title: string): Promise<AegisConversation> {
		switch(account.accType){
			case AccountType.Vk:
				return this.createVkConversation(account, title);

			default:
				throw new Error(`Unexpected type of account: ${AccountType[account.accType]}`);
		}
	}

	private createVkConversation(account: AegisAccount, title: string): Promise<AegisConversation> {
		const url = `https://api.vk.com/method/messages.createChat?title=${title}&v=5.69&access_token=${account.token.getString()}`;

		console.log(url);

		const prom = new Promise<AegisConversation>((resolve, reject) => {

			const observable = this._http.jsonp(url, 'callback');

			const onNext = response => {
				subscription.unsubscribe();

				const result = AuthService.internalParseVkConv(response, title);

				if (result !== undefined)
					resolve(result);
				else
					reject(response);
			}

			const onError = response => {
				subscription.unsubscribe();

				reject(response);
			}

			const onComplete = () => {
				subscription.unsubscribe();

				reject('Completed');
			}

			const subscription = observable.subscribe(onNext, onError, onComplete);
		});

		return prom;
	}

	public getAcc(id: number): AegisAccount {
		for(let acc in this.accounts)
			if (this.accounts[acc].id === id)
				return this.accounts[acc];

		throw new Error(`Cannot find account by id: ${id}`);
	}

	private static internalParseVkConv(response: any, title: string): AegisConversation {
		if (typeof response.response !== 'undefined')
			return new AegisConversation(title, response.response);

		return undefined;
	}
}

