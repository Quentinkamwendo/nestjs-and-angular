import { DataSource } from "@angular/cdk/collections"
import { User } from "../_models/user"
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountService } from "../_services/account.service";


export class ListDataSource implements DataSource<User> {
private usersDataStream = new BehaviorSubject<User[]>([]);
  constructor(private accountService: AccountService) {}

  connect(): Observable<readonly User[]> {
    return this.usersDataStream.asObservable();
  }

  disconnect(): void {
    this.usersDataStream.complete();
  }

}
