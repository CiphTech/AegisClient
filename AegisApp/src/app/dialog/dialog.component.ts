import { Component, OnInit } from '@angular/core';
import { AegisConversation, AegisMessage, AegisAccount, AegisResult, AccountType } from '../model/domain';
import { AuthService } from '../services/auth.service';
import { IAegisChannel, AegisMessageContainer } from '../model/channels';
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
  public selectedAcc: AegisAccount;// = new AegisAccount(0, AccountType.Test,'default',undefined);
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
  }

  getSelectedAccConversations(): AegisConversation[] {
    if (this.selectedAcc == null)
      return [];

    return this.selectedAcc.convAcc;
  }

  selectConv(conv: AegisConversation) {
    this.selectedConv = conv;
    this.selectTrue = true;
    console.log(`selectConv ${conv.id}`);
  }

  isAccountSelected () {
    return this.selectAcc !== undefined;
  }

  async sendMessage() {
    if (StringHelper.isNullOrEmpty(this.textMessage)) {
      this.stringNull = true;
      console.log(`message is empty`);
    return;
    }

    await this.selectedAcc.sendMessage(this.selectedConv, this.selectedConv.nameConv, this.textMessage);

  }

}
