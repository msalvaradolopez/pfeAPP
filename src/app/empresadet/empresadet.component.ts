import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiciosService } from '../servicios.service';
import { NgxConfirmBoxService } from 'ngx-confirm-box';

@Component({
  selector: 'app-empresadet',
  templateUrl: './empresadet.component.html',
  styleUrls: ['./empresadet.component.css']
})
export class EmpresadetComponent implements OnInit, OnDestroy {

  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.
  bgColor = 'rgba(0,0,0,0.5)'; // overlay background color
  confirmHeading = '';
  confirmContent = "Confirmar eliminar el registro.";
  confirmCanceltext = "Cancelar";
  confirmOkaytext = "Eliminar";
  // VALORES DEFAULT PARA VENTANA DE CONFIRMACION.

  datos: any = null;
  _TITULO: string = "EMPRESA DETALLE."
  _IDEMPRESA: string = "";
  _ACCION: string = "N"
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
    this._IDEMPRESA = localStorage.getItem("_IDEMPRESA");
    this._ACCION = localStorage.getItem("_ACCION");

    this.validaCaptura = new FormGroup({
      IDEMPRESA: new FormControl({ value: '', disabled: this._ACCION == "E" }, [Validators.required]),
      RAZONSOCIAL: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      RFC: new FormControl("", [Validators.required, Validators.minLength(12), Validators.maxLength(20)]),
      NOMCONTACTO: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      TELEFONO: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(50)]),
      EMAILCONTACTO: new FormControl("", [Validators.required, Validators.email, Validators.maxLength(50)]),
      ESTATUS: new FormControl("A", [Validators.required])
    });

    this.subscription = this._servicios.navbarRespIcono$
      .subscribe(resp => {
        if (resp == "GUARDAR") {
          if (this.validaCaptura.invalid)
            this._toastr.error("Falta campos por capturar.", "Empresa")
          else
            this.guardar();
        }

        if (resp == "BORRAR")
          this.confirmBox.show();

      });

    if (this._ACCION == "E") {
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: true, GUARDAR: true, BUSCAR: false });

      let param = { valor: this._IDEMPRESA };

      this._servicios.wsGeneral("getEmpresaByID", param)
        .subscribe(datos => {
          this.validaCaptura.setValue({
            IDEMPRESA: datos.IDEMPRESA,
            RAZONSOCIAL: datos.RAZONSOCIAL,
            RFC: datos.RFC,
            NOMCONTACTO: datos.NOMCONTACTO,
            TELEFONO: datos.TELEFONO,
            EMAILCONTACTO: datos.EMAILCONTACTO,
            ESTATUS: datos.ESTATUS
          });
        }, error => this._toastr.error("Error : " + error.error.ExceptionMessage, "Empresa"),
          () => this.validaCaptura.markAllAsTouched());
    } else
      this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: true, BUSCAR: false });


  }

  // ACCION DEL BOTON - GUARDAR.
  guardar() {
    let ws = "";
    if (this._ACCION == "E")
      ws = "updEmpresa";
    else
      ws = "insEmpersa";

    this._servicios.wsGeneral(ws, this.validaCaptura.getRawValue())
      .subscribe(resp => {
        this._toastr.success(resp, "Empresa");
        this.goBack()
      },
        error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Empresa"));
  }

  delDatos(showConfirm: boolean): void {

    if (showConfirm) {
      this._servicios.wsGeneral("delEmpresa", this.validaCaptura.getRawValue())
        .subscribe(resp => {
          this._toastr.success(resp, "Empresa");
          this.goBack();
        },
          error => this._toastr.error("Error: " + error.error.ExceptionMessage, "Empresa"));
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
    this._router.navigate(['/empresas']);
  }

  ngOnDestroy() {
    localStorage.removeItem("_IDEMPRESA");
    localStorage.removeItem("_ACCION");
    this._servicios.navbarAcciones({ TITULO: "", AGREGAR: false, EDITAR: false, BORRAR: false, GUARDAR: false, BUSCAR: false });
    this.subscription.unsubscribe();
  }

}
