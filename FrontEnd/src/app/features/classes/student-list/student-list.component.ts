import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent {
  @Input() claseId!: number;

  expanded: boolean = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
