import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';


@Component({
  selector: 'app-filialdet',
  templateUrl: './filialdet.component.html',
  styleUrls: ['./filialdet.component.css']
})
export class FilialdetComponent implements OnInit {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "FILIAL DETALLE."
  _IDEMPRESA: string = "";
  _IDFILIAL: string = "";
  _ROL: string = "";
  _ACCION: string = "N"
  _IDUSUARIO: string = "";
  validaCaptura: FormGroup;

  subscription: Subscription;

  estatus: any[] = [
    { IDTIPO: "A", NOMBRE: "ACTIVO" },
    { IDTIPO: "B", NOMBRE: "BAJA" }
  ];

  constructor(private _servicios: ServiciosService,
    private _router: Router,
    private _toastr: ToastrService,
    private confirmBox: NgxConfirmBoxService) { }

  ngOnInit(): void {
    this._IDEMPRESA = localStorage.getItem("IDEMPRESA"); // VARIABLE GLOBAL.
    this._IDUSUARIO = localStorage.getItem("IDUSUARIO"); // VARIABLE GLOBAL.
    this._IDFILIAL = localStorage.getItem("_IDFILIAL");
    this._ROL = localStorage.getItem("ROL"); // VARIABLE GLOBAL.
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDEMPRESA: new FormControl({ value: this._IDEMPRESA, disabled: true }, [Validators.required]),
      IDFILIAL: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required]),
      RAZONSOCIAL: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      RFC: new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(20)]),
      TELEFONO: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      EMAILREVISION: new FormControl("", [Validators.required, Validators.email]),
      EMAILPAGOS: new FormControl("", [Validators.required, Validators.email]),
      EMAILCONTACTO: new FormControl("", [Validators.required, Validators.email]),
      IDUSUARIO: new FormControl({ value: this._IDUSUARIO, disabled: true }, [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Filial")
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });

    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });

      let param = { idempresa: this._IDEMPRESA , valor: this._IDFILIAL};

      this._servicios.wsGeneral("getFilialById", param)
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDEMPRESA: datos.IDEMPRESA,
            IDFILIAL: datos.IDFILIAL,
            RAZONSOCIAL: datos.RAZONSOCIAL,
            RFC: datos.RFC,
            TELEFONO: datos.TELEFONO,
            EMAILREVISION: datos.EMAILREVISION,
            EMAILPAGOS: datos.EMAILPAGOS,
            EMAILCONTACTO: datos.EMAILCONTACTO,
            IDUSUARIO: datos.IDUSUARIO
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Usuario"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });

  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updFilial";
    else
      ws = "insFilial";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Filial");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Filial"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delFilial", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Filail");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Filial"));
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
    this._router.navigate(['/filiales']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDFILIAL");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }


}
