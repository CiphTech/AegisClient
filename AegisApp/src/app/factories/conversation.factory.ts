import { AegisConversation, AegisAccount, AccountType } from '../model/domain';
import {HttpClient} from "@angular/common/http";
import { AegisPerson } from '../model/person';

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

    private static createVkConversation(account: AegisAccount, title: string, ids: string[], http: HttpClient): Promise<AegisConversation> {
		const aggregator = (all, x) => `${all},${x}`;

		const url = `https://api.vk.com/method/messages.createChat?title=${title}&user_ids=${ids.reduce(aggregator)}&v=5.69&access_token=${account.token.getString()}`;

		console.log(url);

		const prom = new Promise<AegisConversation>((resolve, reject) => {

			const observable = http.jsonp(url, 'callback');

			const onNext = response => {
				subscription.unsubscribe();

				const result = AegisConversationFactory.internalParseVkConv(response, title);

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

    private static internalParseVkConv(response: any, title: string): AegisConversation {
		if (typeof response.response !== 'undefined')
			return new AegisConversation(title, response.response);

		return undefined;
	}
}