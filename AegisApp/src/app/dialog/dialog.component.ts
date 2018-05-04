import { Component, OnInit } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount} from '../model/domain';
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
	selectedConv:AegisConversation = new AegisConversation("default");
	selectTrue: boolean = false; // для выделения message при выборе
  stringNull: boolean = false; // для отображения ошибки ввода
  columnVisible: string = "c1";

  constructor(convSvc: AuthService) {
    this.convSvc = convSvc;
  }

  ngOnInit() {
  }

  selectConv(conv: AegisConversation){
  	this.selectedConv = conv;
  	this.selectTrue = true;
  }

  sendMessage (){
  	if (StringHelper.isNullOrEmpty(this.textMessage)) {
  		this.stringNull = true;
  		return;
  	}

  	let msg = new AegisMessage(this.selectedConv.nameConv,this.textMessage,"from");
  	this.selectedConv.addMessage(msg);
  	this.textMessage="";
  	this.stringNull = false;
  }

  addConv (acc: AegisAccount, nameConv:string){
  	let conv = new AegisConversation(nameConv);
  	acc.addConv(conv);
  }

}
