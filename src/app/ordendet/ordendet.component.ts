import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';
import { formatDate } from '@angular/common';
declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-ordendet',
  templateUrl: './ordendet.component.html',
  styleUrls: ['./ordendet.component.css']
})
export class OrdendetComponent implements OnInit, OnDestroy {// VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "ORDEN DETALLE."
  _IDEMPRESA: string = "";
  _IDPROVEEDOR: string = "";
  _ROL: string = "";
  _ACCION: string = "N"
  _IDUSUARIO: string = "";
  _IDFILIAL: string = "";
  _IDFOLIOOC: string = "";

  validaCaptura: FormGroup;

  subscription: Subscription;

  catProveedores: any[] = [];
  catFiliales: any[] = [];

  estatus: any[] = [
    { IDTIPO: "A", NOMBRE: "ABIERTA" },
    { IDTIPO: "X", NOMBRE: "CERRADA" },
    { IDTIPO: "C", NOMBRE: "CANCELADA" }
  ];

  monedas: any[] = [
    { ID: "1", NOMBRE: "MXN" },
    { ID: "2", NOMBRE: "USD" },
    { ID: "3", NOMBRE: "EUR" }
  ];


  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDEMPRESA = localStorage.getItem("IDEMPRESA"); // VARIABLE GLOBAL.
    this._IDUSUARIO = localStorage.getItem("IDUSUARIO"); // VARIABLE GLOBAL.
    this._IDPROVEEDOR = localStorage.getItem("_IDPROVEEDOR");
    this._IDFILIAL = localStorage.getItem("_IDFILIAL");
    this._IDFOLIOOC = localStorage.getItem("_IDFOLIOOC");
    this._ROL = localStorage.getItem("ROL"); // VARIABLE GLOBAL.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDEMPRESA: new FormControl({ value: this._IDEMPRESA, disabled: true }, [Validators.required]),
      IDPROVEEDOR: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required]),
      IDFILIAL: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required]),
      IDFOLIOOC: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required, Validators.maxLength(10)]),
      FECHAOC: new FormControl(moment(new Date()).format('DD/MM/YYYY'), [Validators.required]),
      OBRA: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      COSTO: new FormControl("", [Validators.required, Validators.max(99999999)]),
      MONEDA: new FormControl("1", [Validators.required]),
      IDUSUARIO: new FormControl(this._IDUSUARIO, [Validators.required]),
      COMENTARIO: new FormControl("", [Validators.maxLength(100)]),
      ESTATUS: new FormControl("A", [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Orden")
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });

    // CATALOGOS GENERALES -- PROVEEDORES Y FILIALES
    let paramProveedores: any = { idempresa: this._IDEMPRESA, valor: "0" };

    this._servicios.wsGeneral("getProveedoresList", paramProveedores)
      .subscribe(datos => {
        this.catProveedores = datos;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "cat Proveedores"));

    let paraFiliales: any = { idempresa: this._IDEMPRESA, valor: "0" };

    this._servicios.wsGeneral("getFilialesList", paraFiliales)
      .subscribe(datos => {
        this.catFiliales = datos;
      }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "cat Filiales"));

    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });

      let param = {
        idempresa: this._IDEMPRESA,
        idproveedor: this._IDPROVEEDOR,
        idfilial: this._IDFILIAL,
        foliooc: this._IDFOLIOOC
      };

      this._servicios.wsGeneral("getOrdenCompraById", param)
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDEMPRESA: datos.IDEMPRESA,
            IDFILIAL: datos.IDFILIAL,
            IDPROVEEDOR: datos.IDPROVEEDOR,
            IDFOLIOOC: datos.IDFOLIOOC,
            FECHAOC: moment(datos.FECHAOC).format('DD/MM/YYYY'),
            OBRA: datos.OBRA,
            COSTO: datos.COSTO,
            MONEDA: datos.MONEDA,
            COMENTARIO: datos.COMENTARIO,
            ESTATUS: datos.ESTATUS,
            IDUSUARIO: datos.IDUSUARIO
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Orden"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updOrden";
    else
      ws = "insOrden";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Orden");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Orden"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delOrden", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Orden");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Orden"));
    }
  }

  // validacion de campos generales.
  validaCampo(campo: string): boolean {
    return this._servicios.isValidField(this.validaCaptura, campo);
  }

  mensajeErrorCampo(campo: string): string {
    return this._servicios.getErrorMessageField(this.validaCaptura, campo);
  }

  goBack() {
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this._router.navigate(['/ordenes']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDPROVEEDOR");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }



}
