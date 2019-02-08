import { AegisConversation, AegisAccount, AccountType } from '../model/domain';
import {HttpClient} from "@angular/common/http";
import { AegisPerson } from '../model/person';
import { AegisHttpRequester } from '../utility';

export class AegisConversationFactory {

    public static createConv(account: AegisAccount, title: string, friends: AegisPerson[], http: HttpClient): Promise<AegisConversation> {
		switch(account.accType){
			case AccountType.Vk:
				return this.createVkConversation(account, title, friends.map(x => x.id.toString()), http);

			case AccountType.Facebook:
				return this.createFbConversation(title);

			case AccountType.Test:
				return this.createTestConversation(title);

			default:
				throw new Error(`Unexpected type of account: ${AccountType[account.accType]}`);
		}
	}
	
	public static getConv(account: AegisAccount, http: HttpClient): Promise<AegisConversation[]>{
		switch(account.accType){
			case AccountType.Vk:
				return this.getVkConv(account, http);

			case AccountType.Test:
				return this.getTestConv();

			default:
				throw new Error(`Unexpected type of account: ${AccountType[account.accType]}`);
		}
	}
    
    private static createFbConversation(title: string): Promise<AegisConversation> {
        const prom = new Promise<AegisConversation>((resolve, reject) => {
            resolve(new AegisConversation(title));
        });
        return prom;
	}
	
	private static createTestConversation(title: string): Promise<AegisConversation> {
		return new Promise((resolve, reject) => {
			resolve(new AegisConversation(title));
		});
	}

	private static getTestConv(): Promise<AegisConversation[]>{
		return new Promise((resolve, reject) => {
			let conv = new AegisConversation('Init conversation');
			let convList = [conv];
			resolve(convList);
		})
	}

	private static getVkConv(account: AegisAccount, http: HttpClient): Promise<AegisConversation[]> {

		const prefix = '__AEG__';

		const url = `https://api.vk.com/method/messages.searchConversations?q=${prefix}&v=5.69&access_token=${account.token.getString()}`;

		const requester = new AegisHttpRequester(http);

		return requester.Request(url, response => this.internalParseVkConvList(response));
	}

    private static createVkConversation(account: AegisAccount, title: string, ids: string[], http: HttpClient): Promise<AegisConversation> {
		const aggregator = (all, x) => `${all},${x}`;

		const convTitle = `__AEG__${title}`;
		const userIds = ids.length > 0 ? `&user_ids=${ids.reduce(aggregator)}` : '';

		const url = `https://api.vk.com/method/messages.createChat?title=${convTitle}${userIds}&v=5.69&access_token=${account.token.getString()}`;

		console.log(url);

		const requester = new AegisHttpRequester(http);

		const prom = requester.Request(url, (response) => AegisConversationFactory.internalParseCreatedVkConv(response, title));

		return prom;
	}

    private static internalParseCreatedVkConv(response: any, title: string): AegisConversation {
		if (typeof response.response !== 'undefined')
			return new AegisConversation(title, response.response);

		return undefined;
	}

	private static internalParseVkConvList(response: any): AegisConversation[] {

		if (typeof response.response === 'undefined'){
			console.log('Cannot retrieve VK conversations list');
			return [];
		}

		const result = [];

		for (const conv of response.response.items) {
			if (conv.chat_settings.title.substr(0, 7) !== '__AEG__')
				continue;

			result.push(this.internalParseVkConv(conv));
		}

		return result;
	}

	private static internalParseVkConv(item: any): AegisConversation{
		const id = item.peer.local_id;
		const title = item.chat_settings.title.substr(7);

		return new AegisConversation(title, id);
	}
}