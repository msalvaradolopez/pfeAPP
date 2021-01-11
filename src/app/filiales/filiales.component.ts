import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';


@Component({
  selector: 'app-filiales',
  templateUrl: './filiales.component.html',
  styleUrls: ['./filiales.component.css']
})
export class FilialesComponent implements OnInit {

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
    let _IDEMPRESA: number = 0;

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    if (localStorage.getItem("ROL") == "M")
      _IDEMPRESA = 0;
    else
      _IDEMPRESA = Number.parseInt(localStorage.getItem("IDEMPRESA"));

    this._servicios.wsGeneral("getFilialesList", { idempresa: _IDEMPRESA, valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;
        x.forEach(element => {
          if (element.ESTATUS == "A")
            element.ESTATUS = "ACTIVO";
          else
            element.ESTATUS = "BAJA";
        });
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Filiales"));
  }

  editRow(IDFILIAL: string) {
    localStorage.setItem("_IDFILIAL", IDFILIAL);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/filialdet']);
  }

  newRow() {
    localStorage.setItem("_IDFILIAL", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/filialdet']);
  }

}
