import {IAegisChannel, AegisReceived} from './channels';
import { AegisConversation, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import {HttpClient} from "@angular/common/http";
import { AegisHttpRequester } from '../utility';

export class AegisVkChannel implements IAegisChannel {

	private readonly _token: IAegisToken;
	private readonly httpRequester: AegisHttpRequester;

	private _ts: number;
	private _pts: number;

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		
		if (this._token == null)
			throw new Error('VK token is not set');

		const url = `https://api.vk.com/method/messages.send?chat_id=${conversation.id}&message=${message.textMessage}&v=5.69&access_token=${this._token.getString()}`;

		return this.internalSend(url);
	}

	public getMessages(): Promise<AegisMessage[]> {

		const url = `https://api.vk.com/method/messages.getLongPollHistory?v=5.69&pts=${this._pts}&ts=${this._ts}&access_token=${this._token.getString()}`;

		const prom = this.httpRequester.Request(url, response => this.parseGetPollHistory(response));

		return prom;
	}

	constructor(http: HttpClient, token: IAegisToken) {
		this.httpRequester = new AegisHttpRequester(http);
		this._token = token;

		this.getPollServer();
	}

	private getPollServer(): void{
		const url = `https://api.vk.com/method/messages.getLongPollServer?v=5.69&need_pts=1&access_token=${this._token.getString()}`;

		const prom = this.httpRequester.Request(url, response => AegisVkChannel.parseGetPollServer(response));

		prom.then(result => {
			console.log(`Poll Server has been received. TS: ${result.ts}; PTS: ${result.pts}`);
			this._pts = result.pts;
			this._ts = result.ts;
		}).catch(err => console.log(err.toString()));
	}

	private internalSend(url: string) : Promise<AegisResult> {
		return this.httpRequester.Request(url, response => AegisVkChannel.parseSendResult(response));
	}

	private static parseSendResult(result: any): AegisResult {

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

	private parseGetPollHistory(result: any): AegisMessage[] {
		console.log('parseGetPollHistory');
		console.log(result);

		if (typeof result.response === 'undefined')
			throw new Error(`There is not response field in result`);

		const response = result.response;

		if (typeof response.messages === 'undefined')
			throw new Error('There is not messages field in result');

		const messages:any = response.messages.items.filter(item => typeof item.action === 'undefined');

		result = [];

		for (const msg of messages) {
			let message = new AegisMessage(msg.title, msg.body, msg.user_id, new Date(msg.date), msg.chat_id);

			result.push(message);
		}

		if (typeof response.new_pts === 'undefined'){
			console.log('There is not field new_pts in result');
		}else{
			this._pts = parseInt(response.new_pts);
		}

		return result;
	}

	private static parseGetPollServer(result: any): {ts: number, pts: number} {

		console.log('parseGetPollServer');
		console.log(result);

		if (typeof result.response === 'undefined'){
			throw new Error(`There is not response field in result`);
		}

		const response = result.response;

		const ptsExists = typeof response.pts !== 'undefined';
		const tsExists = typeof response.ts !== 'undefined';

		if (ptsExists && tsExists){
			const ts = parseInt(response.ts);
			const pts = parseInt(response.pts);

			return {"pts": pts, "ts": ts};
		}

		throw new Error(`There is not at least one field TS or PTS in response`);
	}
}