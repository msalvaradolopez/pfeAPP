import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
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

    this._servicios.wsGeneral("getUsuariosList", { idempresa: _IDEMPRESA, valor: this.valorBuscar })
      .subscribe(x => {
        this.rows = x;
        x.forEach(element => {
          if (element.ESTATUS == "A")
            element.ESTATUS = "ACTIVO";
          else
            element.ESTATUS = "BAJA";

          if (element.ROL == "M")
            element.ROL = "MASTER";
          if (element.ROL == "A")
            element.ROL = "ADMIN";
          if (element.ROL == "U")
            element.ROL = "USUARIO";
          if (element.ROL == "P")
            element.ROL = "PROVEEDOR";
        });
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Usuarios"));
  }

  editRow(IDUSUARIO: string) {
    localStorage.setItem("_IDUSUARIO", IDUSUARIO);
    localStorage.setItem("_ACCION", "E");
    this._router.navigate(['/usuariodet']);
  }

  newRow() {
    localStorage.setItem("_IDUSUARIO", "0");
    localStorage.setItem("_ACCION", "N");
    this._router.navigate(['/usuariodet']);
  }

}
