import { HttpHeaders } from '@angular/common/http';
export const environment = {
  production: true,
  HTTPS: 'https://srv656099.hstgr.cloud:4000/apiAdae',
  //HTTPS: 'http://localhost:4000/apiAdae',
  autorization: {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adae')}`
    })},
    proyecto:"Sistema de Gestion Educativa",
    titulo:"ADAE",
    telefono:"2841080373"
};