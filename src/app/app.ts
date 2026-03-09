import { TuiRoot } from '@taiga-ui/core';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from 'app/presentation/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('easy-planings-front');
}
