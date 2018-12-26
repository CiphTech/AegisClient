import {IAegisChannel, AegisReceived} from './channels';
import { AegisConversation, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import { AegisEvent } from './events';
import {HttpClient} from "@angular/common/http";
import { AegisHttpRequester } from '../utility';

export class AegisVkChannel implements IAegisChannel {

	private _token: IAegisToken;
	private readonly httpRequester: AegisHttpRequester;

	public setCreds(token: IAegisToken): void {

		if (this._token != null)
			throw new Error('Channel token is set already');

		this._token = token;

		console.log('Token was set');
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		
		if (this._token == null)
			throw new Error('VK token is not set');

		const url = `https://api.vk.com/method/messages.send?chat_id=${conversation.id}&message=${message.textMessage}&v=5.69&access_token=${this._token.getString()}`;

		return this.internalSend(url);
	}

	public onNewMessage: AegisEvent<AegisReceived> = new AegisEvent<AegisReceived>();

	constructor(http: HttpClient) {
		this.httpRequester = new AegisHttpRequester(http);
	}

	private internalSend(url: string) : Promise<AegisResult> {
		return this.httpRequester.Request(url, response => AegisVkChannel.parseResult(response));
	}

	private getMessages() {
		
	}

	private static parseResult(result: any): AegisResult {

		let responseExists = typeof result.response !== 'undefined';
		let errorExists = typeof result.error !== 'undefined';

		if (responseExists && !errorExists)
			return AegisResult.ok();

		if (errorExists){
			let errorCode = result.error.error_code;
			let errorMsg = result.error.error_msg;

			return AegisResult.fail(errorCode, errorMsg);
		}

		return AegisResult.fail(1, 'Unknown error in VK channel');
	}
}