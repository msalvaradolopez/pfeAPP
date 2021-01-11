import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  rows: any[] = null;
  valorBuscar: string = "";

  subscription: Subscription;

  constructor(private _servicios: ServiciosService, private _router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {

    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: true, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: true });

    this._servicios.buscarMat$
      .subscribe(resp => {
        this.valorBuscar = resp;
        this.getRows();
      });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "AGREGAR")
          this.newRow();
      });

    this.getRows();
  }

  getRows() {
    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    this._servicios.wsGeneral("getEmpresasList", { valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;
        x.forEach(element => {
          if (element.ESTATUS == "A")
            element.ESTATUS = "ACTIVO";
          else
            element.ESTATUS = "BAJA";
        });
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Empresas"));
  }

  editRow(IDEMPRESA: string) {
    localStorage.setItem("_IDEMPRESA", IDEMPRESA);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/empresadet']);
  }

  newRow() {
    localStorage.setItem("_IDEMPRESA", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/empresadet']);
  }

}
