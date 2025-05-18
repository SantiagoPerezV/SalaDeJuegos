import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RefreshService{
    private refreshSubject = new Subject<string>();

    public refresh$ = this.refreshSubject.asObservable();

    public refreshComponent(componentType: string): void {
        this.refreshSubject.next(componentType)
    }
}