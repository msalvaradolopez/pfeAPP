import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxConfirmBoxModule, NgxConfirmBoxService } from 'ngx-confirm-box';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { EmpresasComponent } from './empresas/empresas.component';
import { EmpresadetComponent } from './empresadet/empresadet.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuariodetComponent } from './usuariodet/usuariodet.component';
import { FilialesComponent } from './filiales/filiales.component';
import { FilialdetComponent } from './filialdet/filialdet.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedordetComponent } from './proveedordet/proveedordet.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { OrdendetComponent } from './ordendet/ordendet.component';
import { RecepcionComponent } from './recepcion/recepcion.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    EmpresasComponent,
    EmpresadetComponent,
    UsuariosComponent,
    UsuariodetComponent,
    FilialesComponent,
    FilialdetComponent,
    ProveedoresComponent,
    ProveedordetComponent,
    OrdenesComponent,
    OrdendetComponent,
    RecepcionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgxConfirmBoxModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [NgxConfirmBoxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
