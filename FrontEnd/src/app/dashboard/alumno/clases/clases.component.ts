import { Component, OnInit } from '@angular/core';
import { ClasesService } from '../../../Core/service/clases.service';
import Notiflix from 'notiflix';

interface Clase {
  nombreClase: string;
  nombreProfesor: string;
  foto: string;
  tareas: string[];
}

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {


  constructor(private dataService: ClasesService) {}

  ngOnInit(): void {
  }

}
