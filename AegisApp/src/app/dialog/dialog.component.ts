import { Component, OnInit } from '@angular/core';
import { Conversation, Message, Account} from '../model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

	textMessage:string;	
  	convSvc: AuthService;
	selectedConv:Conversation = new Conversation("111");

  constructor(convSvc: AuthService) {
    this.convSvc = convSvc;
  }

  ngOnInit() {
  }

  selectConv(conv: Conversation){
  	this.selectedConv = conv;
  }

  sendMessage (){
  	let msg = new Message(this.selectedConv.nameConv,this.textMessage,"from");
  	this.selectedConv.addMessage(msg);
  	this.textMessage="";
  }

  conver(){
  	console.log(this.convSvc.conversations);
  }
}
