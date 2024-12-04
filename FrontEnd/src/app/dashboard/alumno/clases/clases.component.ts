import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Importamos ActivatedRoute

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  claseId: any;  // Variable para almacenar el ID de la clase

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const numericId = +id!;  // Usamos '!' para indicar que no es nulo
      if (!isNaN(numericId)) {
        this.claseId = numericId;
        console.log('ID de clase:', this.claseId);
      } else {
        console.log('El parámetro "id" no es un número válido.');
      }
    });
  }
  
}
