import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';

@Component({
  selector: 'app-usuariodet',
  templateUrl: './usuariodet.component.html',
  styleUrls: ['./usuariodet.component.css']
})
export class UsuariodetComponent implements OnInit {
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "USUARIO DETALLE."
  _IDEMPRESA: string = "";
  _IDUSUARIO: string = "";
  _ACCION: string = "N"
  _ROL: string = "A";
  validaCaptura: FormGroup;

  subscription: Subscription;

  rols: any[] = [
    { IDROL: "M", NOMBRE: "MASTER" },
    { IDROL: "A", NOMBRE: "ADMIN" },
    { IDROL: "U", NOMBRE: "USUARIO" },
    { IDROL: "P", NOMBRE: "PROVEEDOR" }
  ];

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
    this._IDUSUARIO = localStorage.getItem("_IDUSUARIO");
    this._ACCION = localStorage.getItem("_ACCION");
    this._ROL = localStorage.getItem("ROL") // VARIABLE GLOBAL.

    this.validaCaptura = new FormGroup({
      IDEMPRESA: new FormControl({ value: this._IDEMPRESA, disabled: true }, [Validators.required]),
      IDUSUARIO: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      NOMUSUARIO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      PASSW: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
      ROL: new FormControl("U", [Validators.required]),
      ESTATUS: new FormControl("A", [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Usuario")
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });

    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });

      let param = { idempresa: this._IDEMPRESA , valor: this._IDUSUARIO};

      this._servicios.wsGeneral("getUsuariosbyId", param)
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDEMPRESA: datos.IDEMPRESA,
            IDUSUARIO: datos.IDUSUARIO,
            NOMUSUARIO: datos.NOMUSUARIO,
            ROL: datos.ROL,
            PASSW: datos.PASSW,
            ESTATUS: datos.ESTATUS
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
      ws = "updUsuario";
    else
      ws = "insUsuario";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Usuario");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Usuario"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delUsuario", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Usuario");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Usuario"));
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
    this._router.navigate(['/usuarios']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDEMPRESA");
    localStorage.removeItem("_IDUSUARIO");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }

}
