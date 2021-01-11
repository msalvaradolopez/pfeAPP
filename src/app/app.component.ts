import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosService } from './servicios.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Proveedor FE';

  menuSiNo: boolean = false;
  IDUSUARIO: string = "MSALVARADO";

  classMenu: string = "";
  ROL: string = "";

  menuItems: any[] = [];
  menu: any[] = [
    { IDMENU: "empresas", NOMBRE: "Empresas", ICONO: "nav-icon fas fa-industry", ROL: "M" },
    { IDMENU: "usuarios", NOMBRE: "Usuarios", ICONO: "nav-icon fas fa-users", ROL: "M" },
    { IDMENU: "filiales", NOMBRE: "Filiales", ICONO: "nav-icon fas fa-layer-group", ROL: "M" },
    { IDMENU: "proveedores", NOMBRE: "Proveedores", ICONO: "nav-icon fas fa-boxes", ROL: "M" },
    { IDMENU: "ordenes", NOMBRE: "Ordenes de Compra", ICONO: "nav-icon fas fa-list-ol", ROL: "M" },
    { IDMENU: "recepcion", NOMBRE: "Facturas Electronicas", ICONO: "nav-icon fas fa-clipboard-list", ROL: "M" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "M" },
    { IDMENU: "usuarios", NOMBRE: "Usuarios", ICONO: "nav-icon fas fa-users", ROL: "A" },
    { IDMENU: "filiales", NOMBRE: "Filiales", ICONO: "nav-icon fas fa-layer-group", ROL: "A" },
    { IDMENU: "proveedores", NOMBRE: "Proveedores", ICONO: "nav-icon fas fa-boxes", ROL: "A" },
    { IDMENU: "ordenes", NOMBRE: "Ordenes de Compra", ICONO: "nav-icon fas fa-list-ol", ROL: "A" },
    { IDMENU: "recepcion", NOMBRE: "Facturas Electronicas", ICONO: "nav-icon fas fa-clipboard-list", ROL: "A" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "A" },
    { IDMENU: "recepcion", NOMBRE: "Facturas Electronicas", ICONO: "nav-icon fas fa-clipboard-list", ROL: "P" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "P" },
    { IDMENU: "proveedores", NOMBRE: "Proveedores", ICONO: "nav-icon fas fa-boxes", ROL: "U" },
    { IDMENU: "ordenes", NOMBRE: "Ordenes de Compra", ICONO: "nav-icon fas fa-list-ol", ROL: "U" },
    { IDMENU: "recepcion", NOMBRE: "Facturas Electronicas", ICONO: "nav-icon fas fa-clipboard-list", ROL: "U" },
    { IDMENU: "login", NOMBRE: "Login", ICONO: "nav-icon fas fa-key", ROL: "U" },
  ];

  constructor(private _servicios: ServiciosService, private _router: Router) { }

  ngOnInit() {
    // $.widget.bridge('uibutton', $.ui.button)
    localStorage.clear();

    this._servicios.activarmenu$
      .subscribe(accion => {
        this.menuSiNo = accion;
        if (accion) {
          this.ROL = localStorage.getItem("ROL");
          this.menuItems = this.menu.filter(x => x.ROL == this.ROL);
          if (this.ROL == "M")
            this._router.navigate(['/empresas']);

          if (this.ROL == "A")
            this._router.navigate(['/filiales']);

          if (this.ROL == "U")
            this._router.navigate(['/proveedores']);

          if (this.ROL == "P")
            this._router.navigate(['/recepcion']);

          this.classMenu = "content-wrapper";
        } else
          this.classMenu = "";

        this.IDUSUARIO = localStorage.getItem("IDUSUARIO");
      });

  }

}
