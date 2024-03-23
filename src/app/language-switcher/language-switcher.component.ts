import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LanguageSwitcherComponent {
  constructor(private translate: TranslateService) {}

  language = 'En'

  switchLanguage(language: string) {
    this.translate.use(language);
    switch (language) {
      case 'en':
        this.language = 'EN'
        break;
      case 'pt':
        this.language = 'PT'
        break;
      case 'de':
        this.language = 'DE'
        break;  
      case 'es':  
        this.language = 'ES'
        break;
      default:
        this.language = 'EN'
        break;    
    }
  }

  ngOnInit(): void {
    this.translate.use('en');
  }
}
