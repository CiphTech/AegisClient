import {IAegisChannel, AegisMessageContainer} from './channels';
import { AegisConversation, AegisMessage, AegisResult } from './domain';
import { IAegisToken } from './tokens';
import {HttpClient} from "@angular/common/http";
import { AegisHttpRequester, AegisHttpRequestBuilder } from '../utility';
import { AegisPerson } from './person';

export class AegisVkChannel implements IAegisChannel {
	
	private readonly _token: IAegisToken;
	private readonly httpRequester: AegisHttpRequester;

	private _ts: number;
	private _pts: number;

	public getFriends(): Promise<AegisPerson[]> {
		const builder = AegisHttpRequestBuilder.createForVk(this._token, 'friends.get');
        builder.add('fields', ['city', 'domain']);

        const url = builder.build();

        console.log(url);

        const prom = this.httpRequester.Request(url, response => AegisVkChannel.parseFriendList(response));

		return prom;
	}

	public getPerson(id: string): Promise<AegisPerson> {
		throw new Error("Method not implemented.");
	}

	public getConversations(): Promise<AegisConversation[]> {
		const prefix = '__AEG__';

		const builder = AegisHttpRequestBuilder.createForVk(this._token, 'messages.searchConversations');
		builder.add('q', prefix);

		const url = builder.build();

		return this.httpRequester.Request(url, response => AegisVkChannel.internalParseVkConvList(response));
	}

	public createConversation(title: string, friends: AegisPerson[]): Promise<AegisConversation> {

		const ids = friends.map(x => x.id.toString());

		const convTitle = `__AEG__${title}`;

		const builder = AegisHttpRequestBuilder.createForVk(this._token, 'messages.createChat');
		builder.add('title', convTitle);

		if (ids.length > 0)
			builder.add('user_ids', ids);

		const url = builder.build();

		console.log(url);

		const prom = this.httpRequester.Request(url, (response) => AegisVkChannel.internalParseCreatedVkConv(response, title));

		return prom;
	}

	public sendMessage(conversation: AegisConversation, message: AegisMessage): Promise<AegisResult> {
		
		if (this._token == null)
			throw new Error('VK token is not set');

		const builder = AegisHttpRequestBuilder.createForVk(this._token, 'messages.send');
		builder.add('chat_id', conversation.id);
		builder.add('message', message.textMessage);

		const url = builder.build();

		return this.httpRequester.Request(url, response => AegisVkChannel.parseSendResult(response));
	}

	public getMessages(counter: number): Promise<AegisMessageContainer> {

		const builder = AegisHttpRequestBuilder.createForVk(this._token, 'messages.getLongPollHistory');
		builder.add('pts', this._pts);
		builder.add('ts', this._ts);

		const url = builder.build();

		const prom = this.httpRequester.Request(url, response => this.parseGetPollHistory(response));

		return prom;
	}

	constructor(http: HttpClient, token: IAegisToken) {
		this.httpRequester = new AegisHttpRequester(http);
		this._token = token;

		this.getPollServer();
	}

	private static parseFriendList(response: any): AegisPerson[] {
        if (typeof response.response === 'undefined'){
            console.log(`Cannot parse friends list. Response: ${response}`);
            return [];
        }

        let result = [];

        const items = response.response.items;

        for(let rec in items)
            result.push(this.parseFriend(items[rec]));

        return result;
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

	private static internalParseCreatedVkConv(response: any, title: string): AegisConversation {
		if (typeof response.response !== 'undefined')
			return new AegisConversation(title, response.response);

		return undefined;
	}

    private static parseFriend(node: any): AegisPerson {
        return new AegisPerson(node.id, node.first_name, node.last_name);
    }

	private getPollServer(): void{

		const builder = AegisHttpRequestBuilder.createForVk(this._token, 'messages.getLongPollServer');
		builder.add('need_pts', '1');

		const url = builder.build();

		const prom = this.httpRequester.Request(url, response => AegisVkChannel.parseGetPollServer(response));

		prom.then(result => {
			console.log(`Poll Server has been received. TS: ${result.ts}; PTS: ${result.pts}`);
			this._pts = result.pts;
			this._ts = result.ts;
		}).catch(err => console.log(err.toString()));
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

	private parseGetPollHistory(result: any): AegisMessageContainer {
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