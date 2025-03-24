import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderComponent } from '../folder/folder.component';

export interface FileItem {
name: string;
file?: File;
}

export interface Folder {
name: string;
files: FileItem[];
subfolders: Folder[];
isMain?: boolean;
}

@Component({
selector: 'app-file-explorer',
standalone: true,
imports: [CommonModule, FolderComponent],
templateUrl: './file-explorer.component.html',
styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {
folders: Folder[] = [];

ngOnInit(): void {
this.initializeFolders();
}

initializeFolders() {
// Carpeta principal "Ingreso"
const ingreso: Folder = {
name: 'Ingreso',
files: [],
subfolders: [
{ name: 'Certificado de secundaria o estudios previos', files: [], subfolders: [] },
{ name: 'Acta de nacimiento', files: [], subfolders: [] },
{ name: 'Identificación oficial (o de los padres/tutores)', files: [], subfolders: [] },
{ name: 'Comprobante de domicilio', files: [], subfolders: [] },
{ name: 'CURP', files: [], subfolders: [] },
{ name: 'Formularios de inscripción completados', files: [], subfolders: [] },
{ name: 'Exámenes de admisión', files: [], subfolders: [] },
],
isMain: true,
};


// Carpeta principal "Estadia"
const estadia: Folder = {
  name: 'Estadia',
  files: [],
  subfolders: [
    { name: 'Historial académico/boletas de calificaciones', files: [], subfolders: [] },
    { name: 'Registros de asistencia', files: [], subfolders: [] },
    { name: 'Reportes disciplinarios', files: [], subfolders: [] },
    { name: 'Constancias de participación en actividades extracurriculares', files: [], subfolders: [] },
    { name: 'Documentos médicos relevantes', files: [], subfolders: [] },
    { name: 'Comprobantes de pago', files: [], subfolders: [] },
  ],
  isMain: true,
};

this.folders = [ingreso, estadia];
}

addSubfolder(parentFolder: Folder) {
const subfolderName = prompt('Ingrese el nombre de la nueva subcarpeta:');
if (subfolderName && subfolderName.trim() !== '') {
parentFolder.subfolders.push({ name: subfolderName, files: [], subfolders: [] });
}
}

onFileUploaded(folder: Folder, file: File) {
folder.files.push({ name: file.name, file });
}
}