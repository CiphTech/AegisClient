import {IAegisChannel, AegisReceived} from './channels';
import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import { AegisEvent } from './events';

import { Observable, Observer } from "rxjs/Rx";
import {HttpClient} from "@angular/common/http";

export class AegisVkChannel implements IAegisChannel {

	private _token: IAegisToken;
	private readonly _http: HttpClient;

	public setCreds(token: IAegisToken): void {

		if (this._token !== undefined)
			throw new Error('Channel token is set already');

		this._token = token;

		console.log('Token was set');
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		
		if (this._token === undefined)
			throw new Error('VK token is not set');

		const url = `https://api.vk.com/method/messages.send?chat_id=${conversation.id}&message=${message.textMessage}&v=5.69&access_token=${this._token.getString()}`;

		return this.internalSend(url);
	}

	public onNewMessage: AegisEvent<AegisReceived> = new AegisEvent<AegisReceived>();

	constructor(http: HttpClient) {
		this._http = http;
	}

	private internalSend(url: string) : Promise<AegisResult> {
		console.log(url);

		const prom = new Promise<AegisResult>((resolve, reject) => 
		{
			const observable = this._http.jsonp(url, 'callback');

			const onNext = response => {
				// console.log('[VK] NEXT'); 
				// console.log(response); 
				subscription.unsubscribe();
				resolve(AegisVkChannel.parseResult(response));
			}

			const onError = response => {
				// console.log('[VK] ERROR');
				// console.log(response);
				subscription.unsubscribe();
				reject(response);
			}

			const onComplete = () => {
				// console.log('[VK] COMPLETE');
				subscription.unsubscribe();
				reject('Completed');
			}

			const subscription = observable.subscribe(onNext, onError, onComplete);
		});

		return prom;
	}

	private static parseResult(result: any): AegisResult {
		if (typeof result.response !== 'undefined')
			return AegisResult.ok();

		if (typeof result.error !== 'undefined'){
			let errorCode = result.error.error_code;
			let errorMsg = result.error.error_msg;

			return AegisResult.fail(errorCode, errorMsg);
		}

		return AegisResult.fail(1, 'Unknown error in VK channel');
	}
}