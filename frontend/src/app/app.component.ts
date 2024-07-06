import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tooltip, initTWE,Ripple } from 'tw-elements';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontend';

  ngOnInit(): void {
    initTWE({ Tooltip,Ripple });
  }
}
