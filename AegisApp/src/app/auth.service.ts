import { Injectable } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount } from './model';

@Injectable()
export class AuthService {

	public accounts: AegisAccount[] = new Array();
	
	constructor() { }

  	createAccount(accName:string) {

		let acc = new AegisAccount(accName);

		this.accounts.push(acc);

	}

}

