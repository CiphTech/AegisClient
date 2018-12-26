import { HttpClient } from "@angular/common/http";

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