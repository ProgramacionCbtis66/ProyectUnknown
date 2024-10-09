import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-administrativos',
  templateUrl: './administrativos.component.html',
  styleUrls: ['./administrativos.component.css']
})
export class AdministrativosComponent implements OnInit {

  constructor(private router: Router) { } // Mantén el Router en el constructor

  ngOnInit(): void {

  }
}
