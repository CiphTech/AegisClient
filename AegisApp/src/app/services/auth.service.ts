import { Injectable } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AccountType } from '../model/domain';
import {IAegisToken, SimpleTextToken} from '../model/tokens';

@Injectable()
export class AuthService {

	private _currentId: number = 0;
	public readonly accounts: AegisAccount[] = new Array();
	
	private getNewId(): number {
		let current = ++this._currentId;

		console.log('New account ID: ' + current);
		return current;
	}

	constructor() { }

  	public createAccount(accName:string): void {

  		console.log('New account ' + accName);

  		let token = new SimpleTextToken('testToken');

		let acc = new AegisAccount(this.getNewId(), AccountType.Test, accName, token);

		this.accounts.push(acc);

	}

	public createVkAcc(accName: string, token: string): void {

		console.log('New VK account ' + accName);
		console.log('Token ' + token);

		let tok = new SimpleTextToken(token);

		let acc = new AegisAccount(this.getNewId(), AccountType.Vk, accName, tok);

		this.accounts.push(acc);
	}

}

