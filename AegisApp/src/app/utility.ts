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

enum AegisHttpRequestParameterType {
	Plain,
	Array
}

class AegisHttpRequestParameter {

	constructor(public name: string, public value: any, public type: AegisHttpRequestParameterType) {
	}
}

export class AegisHttpRequestBuilder {

	private readonly parameters: AegisHttpRequestParameter[];

	constructor(private initUrl: string) {
		this.parameters = [];
	}

	public addParameter(name: string, value: any): void {
		let parameter = new AegisHttpRequestParameter(name, value, AegisHttpRequestParameterType.Plain);

		this.parameters.push(parameter);
	}

	public addArray(name: string, value: any[]): void {
		let parameter = new AegisHttpRequestParameter(name, value, AegisHttpRequestParameterType.Array);

		this.parameters.push(parameter);
	}

	public build(): string {
		if (this.parameters.length === 0)
			return this.initUrl;

		let parametersStr = '';
		let ampersand = '';

		for (const parameter of this.parameters) {
			switch (parameter.type){
				case AegisHttpRequestParameterType.Plain:
					parametersStr += `${ampersand}${parameter.name}=${parameter.value}`;
					break;

				case AegisHttpRequestParameterType.Array:
					const aggregator = (all, x) => `${all},${x}`;
					parametersStr += `${ampersand}${parameter.name}=${parameter.value.reduce(aggregator)}`;
					break;

				default:
					throw new Error(`Unexpected type of parameter: ${AegisHttpRequestParameterType[parameter.type]}`);
			}

			ampersand = '&';
		}

		return `${this.initUrl}?${parametersStr}`;
	}

	public static createForVk(token: IAegisToken, method: string): AegisHttpRequestBuilder{
		const initStr = `https://api.vk.com/method/${method}`;
		const builder = new AegisHttpRequestBuilder(initStr);

		builder.addParameter('v', '5.69');
		builder.addParameter('access_token', token.getString());

		return builder;
	}
}