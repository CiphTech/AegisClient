import { HttpClient } from "@angular/common/http";
import { IAegisToken } from './model/tokens';

export class StringHelper{
	static isNullOrEmpty(str: string){
		if (str == null)
			return true;

		return str.length === 0;
	}
}

export class AegisHttpRequester {

	public Request<T>(url: string, successResolver: (response: any) => T): Promise<T> {
		console.log(`Aegis http request: ${url}`);

		const prom = new Promise<T>((resolve, reject) => {
			let observable = this.http.jsonp(url, 'callback');

			const onNext = response => {
				subscription.unsubscribe();
				resolve(successResolver(response));
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

	constructor(private readonly http: HttpClient) {}
}

class AegisHttpRequestParameter {

	constructor(public name: string, public value: any) {
	}

	public build(): string {
		if (this.value instanceof Array)
			return this.buildArray();

		return this.buildPlainText();
	}

	private buildPlainText(): string {
		return AegisHttpRequestParameter.buildParameter(this.name, this.value);
	}

	private buildArray(): string {
		const valAggregator = (all, x) => `${all},${x}`;

		return AegisHttpRequestParameter.buildParameter(this.name, this.value.reduce(valAggregator));
	}

	private static buildParameter(name: string, value: string): string {
		return `${name}=${value}`;
	}
}

export class AegisHttpRequestBuilder {

	private readonly parameters: AegisHttpRequestParameter[];

	constructor(private initUrl: string) {
		this.parameters = [];
	}

	public add(name: string, value: any): void {
		let parameter = new AegisHttpRequestParameter(name, value);
		this.parameters.push(parameter);
	}

	public build(): string {
		if (this.parameters.length === 0)
			return this.initUrl;

		const parAggregator = (all, x) => `${all}&${x}`;

		const parStr = this.parameters.map(x => x.build()).reduce(parAggregator);

		return `${this.initUrl}?${parStr}`;
	}

	public static createForVk(token: IAegisToken, method: string): AegisHttpRequestBuilder{
		const initStr = `https://api.vk.com/method/${method}`;
		const builder = new AegisHttpRequestBuilder(initStr);

		builder.add('v', '5.69');
		builder.add('access_token', token.getString());

		return builder;
	}
}