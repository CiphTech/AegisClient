export class StringHelper{
	static isNullOrEmpty(str: string){
		if (str === null || str === undefined) 
			return true;

		return str.length === 0;
	}
}