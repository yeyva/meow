import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../auth/auth.component';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {
  constructor(private dialog: MatDialog) { }  
  openDialogLogin(): void {
    const dialogRef = this.dialog.open(AuthComponent, {
      width: '250px'
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  openDialogRegistration(): void {
    const dialogRef = this.dialog.open(RegistrationComponent, {
      width: '250px'
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
