import {Routes} from '@angular/router';
import {StaffComponent} from '../components/dashboard/setting/staff.component';
import {CodeComponent} from '../components/dashboard/setting/code.component';
import {DepartmentComponent} from '../components/dashboard/setting/department.component';
import {CashierComponent} from '../components/dashboard/setting/cashier.component';
import {MedicalServiceComponent} from '../components/dashboard/setting/medical-service.component';
import {NurseComponent} from '../components/dashboard/setting/nurse.component';
import {ReceptionistComponent} from '../components/dashboard/setting/receptionist.component';
import {BranchComponent} from '../components/dashboard/setting/branch.component';
import {RolePermissionsComponent} from '../components/dashboard/setting/role-permissions.component';
import {AddReceptionistComponent} from '../components/dashboard/setting/addreceptionist.component';
import {AddBranchComponent} from '../components/dashboard/setting/addbranch.component';
import {OrganizationComponent} from '../components/dashboard/setting/organization.component';
import {AddOrganizationComponent} from '../components/dashboard/setting/addorganization.component';
import {AddStaffComponent} from '../components/dashboard/setting/addstaff.component';
import {UpdateBranchComponent} from '../components/dashboard/setting/update-branch.component';
import {VersionComponent} from '../components/dashboard/setting/version.component';
import {CodeVersionComponent} from '../components/dashboard/setting/code-version.component';
import {AddMedicalServiceComponent} from '../components/dashboard/setting/add-medical-service.component';
import {ServiceTaxComponent} from '../components/dashboard/setting/service-tax.component';
import {EditMedicalServiceComponent} from "../components/dashboard/setting/edit-medical-service.component";
import {NotFound404SettingComponent} from "../components/dashboard/setting/not-found-404-setting.component";


export const SettingRoutes: Routes = [
    // Setting Pages
    {path: '', redirectTo: 'organization', pathMatch: 'full'},
    {path: 'organization', component: OrganizationComponent},
    {path: 'organization/add', component: AddOrganizationComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'branch/add', component: AddBranchComponent},
    {path: 'staff', component: StaffComponent},
    {path: 'staff/add', component: AddStaffComponent},
    {path: 'nurse', component: NurseComponent},
    {path: 'department', component: DepartmentComponent},
    {path: 'cashier', component: CashierComponent},
    {path: 'receptionist', component: ReceptionistComponent},
    {path: 'receptionist/add', component: AddReceptionistComponent},
    {path: 'code', component: CodeComponent},
    {path: 'version', component: VersionComponent},
    {path: 'codeVersion', component: CodeVersionComponent},
    {path: 'medicalServices', component: MedicalServiceComponent},
    {path: 'medicalServices/add', component: AddMedicalServiceComponent},
    {path: 'medicalServices/edit/:id', component: EditMedicalServiceComponent},
    {path: 'role-permissions', component: RolePermissionsComponent},
    {path: 'service-tax', component: ServiceTaxComponent},
    {path: '404-not-found', component: NotFound404SettingComponent},
    {path: '**', redirectTo: '404'},
    {path:'branch/edit/:id',component: UpdateBranchComponent},
];
