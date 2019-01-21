import { Component, OnInit } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AegisResult, AccountType } from '../model/domain';
import { AuthService } from '../services/auth.service';
import { IAegisChannel, AegisReceived } from '../model/channels';
import { StringHelper } from '../utility';
import { ConvAccessComponent } from '../conv-access/conv-access.component';
import { AegisEvent, IEventHandler, ITypedSubscription } from '../model/events';
import { MaterialModule } from '../material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public textMessage: string;
  public convSvc: AuthService;
  public selectedConv: AegisConversation = new AegisConversation('default');
  public selectedAcc: AegisAccount = new AegisAccount(0, AccountType.Test,'default',undefined);
  public selectTrue = false; // для выделения message при выборе
  public stringNull = false; // для отображения ошибки ввода
  public titleInterlocutor: string;


  constructor(convSvc: AuthService) {
    this.convSvc = convSvc;
  }

  ngOnInit() {
  }
  
  selectAcc(acc: AegisAccount) {
    this.selectedAcc = acc;
    console.log(`selectAcc ${acc.id}`);
  }

  selectConv(conv: AegisConversation) {
    this.selectedConv = conv;
    this.selectTrue = true;
    console.log(`selectConv ${conv.id}`);
  }

  isAccountSelected () {
    return this.selectAcc !== undefined;
  }

  sendMessage() {
    if (StringHelper.isNullOrEmpty(this.textMessage)) {
      this.stringNull = true;
      console.log(`message is empty`);
    return;
    }

    let msg = new AegisMessage(this.selectedConv.nameConv, this.textMessage);

    const channel = this.selectedAcc.getChannel();

    let handler = function(arg: AegisReceived, context?: any) {

      this.titleInterlocutor = arg.conversation.nameConv;

      for (var i = 0; i < arg.messages.length; i++) {
          this.selectedConv.addMessage(arg.messages[i]);
        }
    };

    let subscription = channel.onNewMessage.subscribe(handler, this);

    let result = channel.sendMessage(this.selectedConv, msg);

    subscription.unsubscribe();

    result.then(data => {
          console.log(data);

          let result = data as AegisResult;

          if (result.isSucceed) {
            this.selectedConv.addMessage(msg);
          } else {
            console.log('Error: ' + result.message);
          }

          this.textMessage = '';
          this.stringNull = false;
        }
      ).catch(err => console.log(err));
  }
   /*CSS-Класс по входящим сообщениям*/
  getClassIncoming(msg: AegisMessage) {

    return {'bg-danger' : msg.isIncoming};

  }

}
