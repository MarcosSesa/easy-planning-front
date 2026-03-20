import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { HeaderComponent } from 'app/presentation/components/header/header.component';

@Component({
  selector: 'app-landing',
  imports: [HeaderComponent, TranslatePipe, TuiButton, TuiIcon],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {}
