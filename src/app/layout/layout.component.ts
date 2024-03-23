import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  gameIsStarted = false;
  buttonText = 'Start Game';

  username = '';

  constructor(private authService: AuthService,) {
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername() || '';
  }

  startGame() {
    this.gameIsStarted = !this.gameIsStarted;
    if (this.gameIsStarted) {
      this.buttonText = 'Stop Game';
    } else {
      this.buttonText = 'Start Game';
    }
  }
}
