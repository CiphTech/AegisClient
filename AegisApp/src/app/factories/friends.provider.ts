import { AegisAccount, AccountType } from "../model/domain";
import { HttpClient } from "@angular/common/http";
import { AegisPerson } from "../model/person";
import { AegisHttpRequester } from '../utility';

export class AegisFriendsProvider {
    public static getFriends(account: AegisAccount, http: HttpClient): Promise<AegisPerson[]> {
        switch(account.accType){
            case AccountType.Vk:
                return this.getVkFriends(account, http);

            case AccountType.Test:
                return this.getTestFriends();

            default:
                throw new Error(`Unexpected type of account: ${AccountType[account.accType]}`);
        }
    }

    private static getTestFriends(): Promise<AegisPerson[]> {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    private static getVkFriends(account: AegisAccount, http: HttpClient): Promise<AegisPerson[]> {
        const url = `https://api.vk.com/method/friends.get?fields=city,domain&v=5.69&access_token=${account.token.getString()}`;

        console.log(url);
        
        const requester = new AegisHttpRequester(http);

        const prom = requester.Request(url, response => this.parseFriendList(response));

		return prom;
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

    private static parseFriend(node: any): AegisPerson {
        return new AegisPerson(node.id, node.first_name, node.last_name);
    }
}