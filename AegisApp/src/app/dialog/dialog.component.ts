import { Component, OnInit } from '@angular/core';
import { Conversation, Message, Account} from '../model';
import { AuthService } from '../auth.service';
import { StringHelper } from '../utility';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

	textMessage:string;	
  	convSvc: AuthService;
	selectedConv:Conversation = new Conversation("default");
	selectTrue: boolean = false; // для выделения message при выборе
	stringNull: boolean = false; // для отображения ошибки ввода

  constructor(convSvc: AuthService) {
    this.convSvc = convSvc;
  }

  ngOnInit() {
  }

  selectConv(conv: Conversation){
  	this.selectedConv = conv;
  	this.selectTrue = true;
  }

  sendMessage (){
  	if (StringHelper.isNullOrEmpty(this.textMessage)) {
  		this.stringNull = true;
  		return;
  	}

  	let msg = new Message(this.selectedConv.nameConv,this.textMessage,"from");
  	this.selectedConv.addMessage(msg);
  	this.textMessage="";
  	this.stringNull = false;
  }

  addConv (acc: Account, nameConv:string){
  	let conv = new Conversation(nameConv);
  	acc.addConv(conv);
  }
}
