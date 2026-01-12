import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

    private messageSource = new BehaviorSubject<string>('default message');
    currentMessage = this.messageSource.asObservable();

    private readonly notification = inject(NzNotificationService);

    changeMessage(message: string) {
        this.messageSource.next(message);

        this.notification.create(
          'success',
          'Notification Title',
          message
        );
    }
}
