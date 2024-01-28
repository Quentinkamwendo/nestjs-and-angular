import { Component } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent {
  // user: User | null;
  username: any;

  constructor(private accountService: AccountService) {
    this.username = this.accountService.userValue?.authUser?.username;
  }

}
