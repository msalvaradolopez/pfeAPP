import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresadetComponent } from './empresadet/empresadet.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { FilialdetComponent } from './filialdet/filialdet.component';
import { FilialesComponent } from './filiales/filiales.component';
import { LoginComponent } from './login/login.component';
import { OrdendetComponent } from './ordendet/ordendet.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { ProveedordetComponent } from './proveedordet/proveedordet.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { UsuariodetComponent } from './usuariodet/usuariodet.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'empresas', component: EmpresasComponent},
  { path: 'empresadet', component: EmpresadetComponent},
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'usuariodet', component: UsuariodetComponent},
  { path: 'filiales', component: FilialesComponent},
  { path: 'filialdet', component: FilialdetComponent},
  { path: 'proveedores', component: ProveedoresComponent},
  { path: 'proveedordet', component: ProveedordetComponent},
  { path: 'ordenes', component: OrdenesComponent},
  { path: 'ordendet', component: OrdendetComponent},
  { path: 'recepcion', component: RecepcionComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
