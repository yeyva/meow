import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<RegistrationComponent>
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.dialogRef!.close({ event: 'login-success'});
      const { username, password, repassword } = this.registrationForm.value;
      if (password !== repassword) {
        console.error('Passwords do not match');
        return;
      }
      this.authService.registration(username, password).subscribe({
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
