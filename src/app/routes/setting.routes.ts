import {Routes} from '@angular/router';
import {StaffComponent} from '../components/dashboard/setting/staff.component';
import {CodeComponent} from '../components/dashboard/setting/code.component';
import {DepartmentComponent} from '../components/dashboard/setting/department.component';
import {CashierComponent} from '../components/dashboard/cashier/cashier.component';
import {MedicalServiceComponent} from '../components/dashboard/setting/medical-service.component';
import {NurseComponent} from '../components/dashboard/setting/nurse.component';
import {ReceptionistComponent} from '../components/dashboard/setting/receptionist.component';
import {BranchComponent} from '../components/dashboard/setting/branch.component';
import {RolePermissionsComponent} from '../components/dashboard/setting/role-permissions.component';
import {UpdateReceptionistComponent} from '../components/dashboard/setting/update-receptionist.component';
import {AddBranchComponent} from '../components/dashboard/setting/addbranch.component';
import {OrganizationComponent} from '../components/dashboard/setting/organization.component';
import {AddOrganizationComponent} from '../components/dashboard/setting/add-organization.component';
import {AddStaffComponent} from '../components/dashboard/setting/addstaff.component';
import {UpdateBranchComponent} from '../components/dashboard/setting/update-branch.component';
import {VersionComponent} from '../components/dashboard/setting/version.component';
import {CodeVersionComponent} from '../components/dashboard/setting/code-version.component';
import {AddMedicalServiceComponent} from '../components/dashboard/setting/add-medical-service.component';
import {TaxComponent} from '../components/dashboard/setting/tax.component';
import {EmailTemplateComponent} from "../components/dashboard/setting/email-template-component";
import {AddEmailTemplateComponent} from "../components/dashboard/setting/add-email-template.component";
import {EditEmailTemplateComponent} from "../components/dashboard/setting/edit-email-template.component";
import {EditMedicalServiceComponent} from "../components/dashboard/setting/edit-medical-service.component";
import {NotFound404SettingComponent} from "../components/dashboard/setting/not-found-404-setting.component";
import {UpdateNurseComponent} from '../components/dashboard/setting/updatenurse.component';
import {UpdatedoctorComponent} from '../components/dashboard/setting/updatedoctor.component';
import {UpdateCashierComponent} from '../components/dashboard/setting/updatecashier.component';
import {UpdateOrganizationComponent} from '../components/dashboard/setting/update-organization.component';

import {StatusesComponent} from "../components/dashboard/setting/statuses.component";
import {AdminProfileComponent} from "../components/dashboard/setting/admin-profile.component";

import {EmailConfigurationComponent} from "../components/dashboard/setting/email-configuration.component";
import {SmsTemplateComponent} from "../components/dashboard/setting/sms-template.component";
import {AddEditSmsTemplateComponent} from "../components/dashboard/setting/add-edit-sms-template.component";
import {PrefixTemplateComponent} from "../components/dashboard/setting/prefix-template.component";
import {ChartOfAccountComponent} from "../components/dashboard/setting/chart-of-account.component";
import {VitalSetupComponent} from "../components/dashboard/setting/vital-setup.component";
import {AccountSetupComponent} from "../components/dashboard/setting/account-setup.component";
import {LabTestComponent} from "../components/dashboard/setting/lab-test.component";
import {PatientGroupComponent} from '../components/dashboard/patient/patient-group.component';
import {DrugModel} from '../model/drug.model';
import {DrugComponent} from '../components/dashboard/setting/drug.component';
import {UserPermissionsComponent} from "../components/dashboard/setting/user-permissions.component";
import {PaymentTypeComponent} from "../components/dashboard/setting/PaymentType.component";
import {CurrencyComponent} from '../components/dashboard/setting/currency.component';
import {PaymentComponent} from "../components/dashboard/cashier/payment.component";
import {PatientImageComponent} from "../components/dashboard/setting/PatientImageComponent";
import {InsurranceplanComponent} from "../components/dashboard/setting/insurranceplan.component";
import {InsurranceprofileComponent} from "../components/dashboard/setting/insuranceprofile.component";


export const SettingRoutes: Routes = [
    // Setting Pages dashboard/setting/chart-of-account-template
    {path: '', redirectTo: 'organization', pathMatch: 'full'},
    {path: 'organization', component: OrganizationComponent},
    {path: 'organization/add', component: AddOrganizationComponent},
    {path:'organization/edit/:id',component: UpdateOrganizationComponent},
    {path: 'branch', component: BranchComponent},
    {path: 'admin/profile', component: AdminProfileComponent},
    {path: 'branch/add', component: AddBranchComponent},
    {path: 'staff', component: StaffComponent},
    {path: 'staff/add', component: AddStaffComponent},
    {path: 'nurse', component: NurseComponent},
    {path: 'department', component: DepartmentComponent},
    {path: 'Payment/type', component: PaymentTypeComponent},
    {path: 'cashier', component: CashierComponent},
    {path: 'receptionist', component: ReceptionistComponent},
    {path: 'nurse/edit/:id', component: UpdateNurseComponent},
    {path: 'doctor/edit/:id', component: UpdatedoctorComponent},
    {path: 'cashier/edit/:id', component: UpdateCashierComponent},
    {path: 'receptionist/edit/:id', component: UpdateReceptionistComponent},
    {path: 'branch/edit/:id', component: UpdateBranchComponent},
    {path: 'code', component: CodeComponent},
    {path: 'version', component: VersionComponent},
    {path: 'codeVersion', component: CodeVersionComponent},
    {path: 'medicalServices', component: MedicalServiceComponent},
    {path: 'medicalServices/add', component: AddMedicalServiceComponent},
    {path: 'medicalServices/edit/:id', component: EditMedicalServiceComponent},
    {path: 'role-permissions', component: RolePermissionsComponent},
    {path: 'user-permissions', component: UserPermissionsComponent},
    {path: 'tax', component: TaxComponent},
    {path: 'status', component: StatusesComponent},
    {path: '404-not-found', component: NotFound404SettingComponent},
    {path: 'branch/edit/:id',component: UpdateBranchComponent},
    {path: 'email-template', component: EmailTemplateComponent},
    {path: 'email-configuration', component: EmailConfigurationComponent},
    {path: 'email-template/add', component: AddEmailTemplateComponent},
    {path: 'email-template/edit/:id', component: EditEmailTemplateComponent},

    {path: 'sms-template', component: SmsTemplateComponent},
    {path: 'sms-template/add', component: AddEditSmsTemplateComponent},
    {path: 'sms-template/edit/:id', component: AddEditSmsTemplateComponent},
    {path: 'prefix-template', component: PrefixTemplateComponent},
    {path: 'chart-of-account-template', component: ChartOfAccountComponent},
    {path: 'vital-setup-template', component: VitalSetupComponent},
    {path: 'account-setup-template', component: AccountSetupComponent},
    {path: 'lab-test-template', component: LabTestComponent},
    {path: 'patient-group', component: PatientGroupComponent},
    {path: 'drug', component: DrugComponent},
// Add Payment Type
    {path: 'currency', component: CurrencyComponent},
    {path :'payment', component :PaymentComponent},
    {path: 'PatientImage', component: PatientImageComponent},
    {path: 'InsurancePlan', component: InsurranceplanComponent},
    {path: 'InsuranceProfile', component: InsurranceprofileComponent},
    {path: '**', redirectTo: '404'}
];
