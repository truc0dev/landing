import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCompleteSubject = new Subject<void>();
  loadingComplete$ = this.loadingCompleteSubject.asObservable();

  completeLoading() {
    this.loadingCompleteSubject.next();
  }
} 