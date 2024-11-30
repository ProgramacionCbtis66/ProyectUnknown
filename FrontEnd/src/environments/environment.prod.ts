import { HttpHeaders } from '@angular/common/http';
export const environment = {
  production: true,
  HTTPS: 'http://160.238.36.50/apiAdae',
  autorization: {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adae')}`
    })},
    proyecto:"Sistema de Gestion Educativa",
    titulo:"ADAE",
    telefono:"2841080373"
};