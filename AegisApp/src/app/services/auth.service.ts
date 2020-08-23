import { Injectable } from '@angular/core';
import { AegisAccount, AccountType } from '../model/domain';
import { PersonsService } from './persons.service';
import { ConversationsService } from './conversations.service';
import { MessagesService } from './messages.service';

@Injectable()
export class AuthService {

	private _currentId: number = 0;
	public readonly accounts: AegisAccount[] = new Array();
	
	constructor(private readonly persons: PersonsService, 
		private readonly conv: ConversationsService, 
		private readonly msg: MessagesService) { }

	public async createAcc(accName: string, type: AccountType, token: string = undefined): Promise<void> {

		let acc = await AegisAccount.Create(this.persons, this.msg, this.conv);

		this.accounts.push(acc);
	}
}

