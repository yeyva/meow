import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth/auth.service';

interface LevelMenuItem {
  label: string;
  icon?: string;
  value: string;
}

interface Stat {
  level: string;
  wordsWithoutErrors: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {

  levelMenuItems: LevelMenuItem[] = [
    { label: 'Easy', icon: 'sentiment_very_satisfied', value: 'easy'},
    { label: 'Medium', icon: 'sentiment_satisfied', value: 'medium'},
    { label: 'Hard', icon: 'sentiment_very_dissatisfied', value: 'hard'},
  ];
  selectedLevelItem: string = 'easy';

  scores: number = 0;
  
  timer: any = null;

  stats: Stat[] = [];
  
  constructor(private dataService: DataService, private authService: AuthService,) {
  }

  sampleText = `Test`;

  charsetEasy = ['Hello world', 'How are you', 'Take your time'];
  charsetMedium = ['This is 2 a test', 'Do you have 5 aplles', 'I am 18 years old']
  charsetHard = ['Please type this password 789!*@#$%^', 'The ocean is 90% water', 'His banck account code is 123qwert#^&(']

  spaces = 0;
  
  count = -1;

  currentErrors = 0;

  numberOfWordsWithoutErrors = 0;

  regenerateTestWords(): any {
    let randomText;
    this.stopGame();
    const randomIndex = Math.floor(Math.random()*3);
    switch (this.selectedLevelItem) {
      case 'easy':
        randomText = this.charsetEasy[randomIndex];
        break;
      case 'medium':
        randomText = this.charsetMedium[randomIndex];
        break;
      case 'hard':
        randomText = this.charsetHard[randomIndex];
        break;
      default:
        randomText = this.charsetEasy[randomIndex];
        break;
    }

    if (this.sampleText === randomText) {
      console.log('Regenerating text')
      return this.regenerateTestWords();
    }

    return this.sampleText = randomText;
  }

  selectLevelItem(value: string) {
    this.regenerateTestWords();
  }
  
  sendData() {
    const data = {
      userId: Number(this.authService.getToken()),
      wordsWithoutErrors: this.numberOfWordsWithoutErrors,
      level: this.selectedLevelItem
    }
    this.dataService.sendData(data).subscribe(response => {
    });
  }

  formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    return [hours, minutes, seconds]
        .map(val => val < 10 ? "0" + val : val)
        .join(":");
  }

  startTimer() {
    console.log('Timer started');
    if (this.timer !== null) return; 
    let elapsedSeconds = 0;

    this.timer = setInterval(() => {
        elapsedSeconds++;
        document!.getElementById('time')!.textContent = this.formatTime(elapsedSeconds);
    }, 1000); // Update every second
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
    document!.getElementById('time')!.textContent = this.formatTime(0);
  }

  stopGame() {
    this.stopTimer();
    console.log('Game stopped', 'this.numberOfWordsWithoutErrors', this.numberOfWordsWithoutErrors);
    this.sendData();
    this.scores = 0;
    this.count = -1;
    this.currentErrors = 0;
    this.numberOfWordsWithoutErrors = 0;
    this.spaces = 0;
  }

  ngOnInit() {
    const token = this.authService.getToken();

    this.dataService.getData(token)!.subscribe((data: any) => {
      this.stats = [];
      data.forEach((stat: any) => {
        this.stats.push({ level: stat.level, wordsWithoutErrors: stat.max_words_completed });
      });
      console.log('Data:', JSON.stringify(this.stats));
    });
    
    let theTextBox = document.getElementById('enteredText');
    
    let allTheKeys = document.getElementById('keyboard');
    let changeKeys = document.getElementsByClassName('shifter');
    let capsLockKey = document.getElementById('20');
    let shiftKey = document.getElementById('16');

    //Store all the original values of the non-alphabetical keys
    var originalShifterArray: any = [];
    for (let i = 0; i < changeKeys.length; i++) {
      originalShifterArray.push(changeKeys[i].innerHTML);
    }

    //Set up an array for the replacement values of the non-alphabetical keys that get subbed in when Shift is pressed
    var shifterArray = [
      '~',
      '!',
      '@',
      '#',
      '$',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '_',
      '+',
      '{',
      '}',
      '|',
      ':',
      '"',
      '<',
      '>',
      '?',
    ];

    //Function that clears the text box
    function clearText() {
      theTextBox!.innerHTML = '<br>';
    }

    function setPosition() {
      const range = document.createRange();
      range.selectNodeContents(theTextBox!);
      range.collapse(false);
      const sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    }

    //Function that detects keypresses and does the appropriate things
    const  highlightAndType= (e: any) => {
      var keyPressed = e.keyCode;
      var charPressed = e.key;
      const keys = document.getElementById(keyPressed);

      if (!keys) {
        return;
      }

      keys!.classList.add('pressed');

      if (!charPressed) {
        theTextBox!.innerHTML =
          "Sorry, this pen doesn't work in your browser. :( <br> Try Chrome, Firefox or Opera.";
        return;
      }

      //If the user presses CapsLock or Shift, make the alphabetical keys uppercase
      if (charPressed == 'CapsLock' || charPressed == 'Shift') {
        allTheKeys!.classList.add('uppercase');
      }
      //If the user presses Shift, also replace all non-alphabetical keys with their shifted values
      if (charPressed == 'Shift') {
        for (let i = 0; i < changeKeys.length; i++) {
          changeKeys[i].innerHTML = shifterArray[i];
        }
      }

      //Make sure the key that was typed was a character
      if (e.key.length <= 1 || e.code ==='Space') {
        if (e.code ==='Space') {
          this.spaces = this.spaces + 1;
          theTextBox!.innerHTML += '&nbsp;';
          e.preventDefault();

          if (this.currentErrors === 0) {
            this.numberOfWordsWithoutErrors = this.numberOfWordsWithoutErrors + 1;
            this.currentErrors = 0;
          }

        }
      
        if (theTextBox!.innerHTML.endsWith('<br>')) {
          var newText = theTextBox!.innerHTML.slice(0, -4);
          theTextBox!.innerHTML = newText;
        }
        
        this.count = this.count + 1;

        if (this.sampleText[this.count] === e.key) {
          theTextBox!.innerHTML += `<span style="color: green;">${e.key}</span>`;
        } else {
          if (e.code !=='Space') {
            this.scores = this.scores + 1;
          }
          this.currentErrors = this.currentErrors + 1;
          theTextBox!.innerHTML += `<span style="color: red;">${e.key}</span>`;
        }

        if (this.sampleText.length - 1 == this.count) {
          //this.sendData('success');
          this.scores = this.scores + 1;
          if (this.currentErrors === 0) {
            this.numberOfWordsWithoutErrors = this.numberOfWordsWithoutErrors + 1;
          }
          this.regenerateTestWords();
        }
        
        setPosition();

        //If a backspace was typed, delete the last character in the text box. If shift was also held, delete all text.
      } else if (e.key == 'Backspace') {
        if (shiftKey!.classList.contains('pressed')) {
          clearText();
        } else {
          var newText = theTextBox!.innerText.slice(0, -1);
          theTextBox!.innerHTML = newText;
          setPosition();
        }
        //If the Enter key was typed, remove all text from the text box
      } else if (e.key == 'Enter') {
        theTextBox!.innerHTML += '<br><br>';
      }
      //if Tab is pressed, don't tab out of the window. Add extra space to the text box instead
      if (keyPressed == 9) {
        e.preventDefault();
        theTextBox!.innerHTML += '&emsp;&emsp;';
      }
    }

    //Function that detects when the user lets off a key and does the appropriate things
    function removeKeypress(e: any) {
      var keyDepressed = e.keyCode;
      const keys = document.getElementById(keyDepressed);

      if (!keys) {
        return;
      }

      keys!.classList.remove('pressed');
      //If CapsLock or Shift was just let off, and if the other isn't still on, return keys to lowercase
      if (
        (keyDepressed == 20 && !shiftKey!.classList.contains('pressed')) ||
        (keyDepressed == 16 && !capsLockKey!.classList.contains('pressed'))
      ) {
        allTheKeys!.classList.remove('uppercase');
      }
      //If Shift was just let off, replace all non-alphabetical keys with their original values rather than their shifted values
      if (keyDepressed == 16) {
        for (let i = 0; i < changeKeys.length; i++) {
          changeKeys[i].innerHTML = originalShifterArray[i];
        }
      }
    }

    //Whenever the user presses a key down, run the proper function
    window.addEventListener('keydown', highlightAndType);

    //Whenever the user lets a key up, run the proper function
    window.addEventListener('keyup', removeKeypress);

    //Whenever the window is clicked, run the function to clear out the text box
    theTextBox!.addEventListener('click', clearText);
  }
}
