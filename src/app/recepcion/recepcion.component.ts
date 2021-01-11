import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';


@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {
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
    let _IDPROVEEDOR: string = "0";

    if (this.valorBuscar == "")
      this.valorBuscar = "0";

    _IDEMPRESA = Number.parseInt(localStorage.getItem("IDEMPRESA")); //VVARIABLE GLOBAL.
    _IDPROVEEDOR = localStorage.getItem("IDPROVEEDOR"); //VVARIABLE GLOBAL.

    let param: any = {
      idempresa: _IDEMPRESA,
      idfilial: 0,
      idproveedor: _IDPROVEEDOR,
      valor: this.valorBuscar,
      estatus: "A"
    };

    this._servicios.wsGeneral("getOCsByFilters", param)
      .subscribe(x => {
        this.rows = x;
        x.forEach(element => {
          if (element.ESTATUS == "A")
            element.ESTATUS = "ACTIVO";
          else
            element.ESTATUS = "BAJA";

          if (element.MONEDA == "1")
            element.MONEDA = "MXN";
          if (element.MONEDA == "2")
            element.MONEDA = "USD";
          if (element.MONEDA == "1")
            element.MONEDA = "EUR";

        });
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Ordenes"));
  }

  editRow(ITEM: any) {
    localStorage.setItem("_IDFILIAL", ITEM.IDFILIAL);
    localStorage.setItem("_IDPROVEEDOR", ITEM.IDPROVEEDOR);
    localStorage.setItem("_IDFOLIOOC", ITEM.IDFOLIOOC);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/recepciondet']);
  }

  newRow() {
    localStorage.setItem("_IDPROVEEDOR", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/recepciondet']);
  }

}
