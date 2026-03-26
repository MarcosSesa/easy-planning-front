import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiTabs } from '@taiga-ui/kit';

@Component({
  selector: 'app-my-trips',
  imports: [TranslatePipe, TuiButton, TuiIcon, RouterLink, TuiTabs],
  templateUrl: './my-trips-page.component.html',
  styleUrl: './my-trips-page.component.scss',
})
export class MyTripsPageComponent {
  readonly invitations = [1];
}
