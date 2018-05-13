import { Injectable } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount } from '../model/domain';
import {IAegisToken, SimpleTextToken} from '../model/tokens';

@Injectable()
export class AuthService {

	public accounts: AegisAccount[] = new Array();
	
	constructor() { }

  	createAccount(accName:string) {

  		let token = new SimpleTextToken('testToken');

		let acc = new AegisAccount(accName, token);

		this.accounts.push(acc);

	}

}

