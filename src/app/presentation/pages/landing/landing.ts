import { Component } from '@angular/core';
import { Header } from 'app/presentation/components/header/header';

@Component({
  selector: 'app-landing',
  imports: [Header],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
