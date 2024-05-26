import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalHelpComponent } from './shared/components/modal-help/modal-help.component';
import { Router } from '@angular/router';

@Component({
  selector: 'wsa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public dialog: MatDialog, private router: Router ) {}

  openHelp(): void {
    this.dialog.open(ModalHelpComponent);
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

}
