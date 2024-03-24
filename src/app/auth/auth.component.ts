import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AuthComponent>
  ) {}


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.dialogRef!.close({ event: 'login-success'});
      const { username, password } = this.loginForm.value;
      console.log('Username:', username);
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response.token) {
            this.authService.saveToken(response.token);
            this.authService.saveUsename(response.username);
            this.router.navigate(['/game']); 
          } else {
            console.error('Error');
          }
          
        },
        error: (error) => {
          console.error('Error', error);
        }
      });
    }
  }
}
