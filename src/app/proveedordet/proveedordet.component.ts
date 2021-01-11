import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';


@Component({
  selector: 'app-proveedordet',
  templateUrl: './proveedordet.component.html',
  styleUrls: ['./proveedordet.component.css']
})
export class ProveedordetComponent implements OnInit, OnDestroy {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "PROVEEDOR DETALLE."
  _IDEMPRESA: string = "";
  _IDPROVEEDOR: string = "";
  _ROL: string = "";
  _ACCION: string = "N"
  _IDUSUARIO: string = "";
  validaCaptura: FormGroup;

  subscription: Subscription;

  estatus: any[] = [
    { IDTIPO: "A", NOMBRE: "ACTIVO" },
    { IDTIPO: "B", NOMBRE: "BAJA" }
  ];

  _TIPOPROV: any[] = [
    { ID: "M", NOMBRE: "FISICO" },
    { ID: "F", NOMBRE: "MORAL" }
  ];

  _TIPOPAGO: any[] = [
    { ID: "C", NOMBRE: "CREDITO" },
    { ID: "E", NOMBRE: "CONTADO" }
  ];

  _TIPOVENCE: any[] = [
    { ID: "E", NOMBRE: "FECHA EMISION" },
    { ID: "R", NOMBRE: "FECHA REVISION" }
  ];

  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDEMPRESA = localStorage.getItem("IDEMPRESA"); // VARIABLE GLOBAL.
    this._IDUSUARIO = localStorage.getItem("IDUSUARIO"); // VARIABLE GLOBAL.
    this._IDPROVEEDOR = localStorage.getItem("_IDPROVEEDOR");
    this._ROL = localStorage.getItem("ROL"); // VARIABLE GLOBAL.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDEMPRESA: new FormControl({ value: this._IDEMPRESA, disabled: true }, [Validators.required]),
      IDPROVEEDOR: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required]),
      RAZONSOCIAL: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      TIPOPROV: new FormControl("M", [Validators.required]),
      CURP: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
      RFC: new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(20)]),
      TIPOPAGO: new FormControl("C", [Validators.required]),
      DIASCREDITO: new FormControl("0", [Validators.required, Validators.min(0), Validators.max(999)]),
      TIPOFACTURA: new FormControl("X", [Validators.required]),
      TIPOVENCE: new FormControl("E", [Validators.required]),
      CLAVEPROV: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      CLAVEPROD: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      NOMCONTACTO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      APPCONTACTO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      APMCONTACTO: new FormControl("", [Validators.minLength(5), Validators.maxLength(50)]),
      EMAILPROV: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      TELEFONO: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
      IDUSUARIO: new FormControl(this._IDUSUARIO, [Validators.required]),
      IDMODIFICA: new FormControl(this._IDUSUARIO, [Validators.required]),
      ESTATUS: new FormControl("A", [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Proveedor")
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });

    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });

      let param = { idempresa: this._IDEMPRESA, valor: this._IDPROVEEDOR };

      this._servicios.wsGeneral("getProveedorById", param)
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDEMPRESA: datos.IDEMPRESA,
            IDPROVEEDOR: datos.IDPROVEEDOR,
            RAZONSOCIAL: datos.RAZONSOCIAL,
            TIPOPROV: datos.TIPOPROV,
            CURP: datos.CURP,
            RFC: datos.RFC,
            TIPOPAGO: datos.TIPOPAGO,
            DIASCREDITO: datos.DIASCREDITO,
            TIPOFACTURA: datos.TIPOFACTURA,
            TIPOVENCE: datos.TIPOVENCE,
            CLAVEPROV: datos.CLAVEPROV,
            CLAVEPROD: datos.CLAVEPROD,
            NOMCONTACTO: datos.NOMCONTACTO,
            APPCONTACTO: datos.APPCONTACTO,
            APMCONTACTO: datos.APMCONTACTO,
            EMAILPROV: datos.EMAILPROV,
            TELEFONO: datos.TELEFONO,
            IDUSUARIO: datos.IDUSUARIO,
            IDMODIFICA: datos.IDMODIFICA,
            ESTATUS: datos.ESTATUS
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Proveedor"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updProveedor";
    else
      ws = "insProveedor";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Proveedor");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Proveedor"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delProveedor", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Proveedor");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Proveedor"));
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
    this._router.navigate(['/proveedores']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDPROVEEDOR");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }


}
