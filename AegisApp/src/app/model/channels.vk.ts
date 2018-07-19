import {IAegisChannel, AegisReceived} from './channels';
import { AegisConversation, AegisAccount, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import { AegisEvent } from './events';

import { Observable } from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

export class AegisVkChannel implements IAegisChannel {

	private _token: IAegisToken;
	private readonly _http: HttpClient;
	private _result: AegisResult;

	public setCreds(token: IAegisToken): void {

		if (this._token !== undefined)
			throw new Error('Channel token is set already');

		this._token = token;

		console.log('Token was set');
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): AegisResult {
		
		if (this._token === undefined)
			throw new Error('VK token is not set');

		let url = 'https://api.vk.com/method/messages.send?chat_id=' + conversation.id + '&message=' + message.textMessage + '&v=5.69&access_token=' + this._token.getString();

		this.internalSend(url);

		return this._result;
	}

	public onNewMessage: AegisEvent<AegisReceived> = new AegisEvent<AegisReceived>();

	constructor(http: HttpClient) {
		this._http = http;
	}

	private async internalSend(url: string) {
		console.log(url);

		let prom = new Promise((res, rej) => {
					this._http.jsonp(url, 'callback').toPromise()
						.catch((err) => {
							console.log('[VK] ERROR: ' + err);
							this._result = AegisResult.fail(1, err);
							rej(err);
						}).then((response) => {
							console.log('[VK] SUCCESS: ' + response);
							this._result = AegisResult.ok();
							res();
						});
			});

		await prom;
	}
}