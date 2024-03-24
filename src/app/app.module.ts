import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { GameComponent } from './game/game.component';
import { KittyComponent } from './kitty/kitty.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from "@angular/material/dialog";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './guards/auth.guard';
import { RegistrationComponent } from './registration/registration.component';
import { BaseComponent } from './base/base.component';

const routes: Routes = [
  { path: 'game', component: LayoutComponent, canActivate: [authGuard] },
  { path: '', component: BaseComponent },
  { path: 'registration', component: RegistrationComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    GameComponent,
    KittyComponent,
    LanguageSwitcherComponent,
    AuthComponent,
    RegistrationComponent,
    BaseComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: function HttpLoaderFactory(http: HttpClient) {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
