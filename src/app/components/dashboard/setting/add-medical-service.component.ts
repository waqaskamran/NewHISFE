import {Component, OnInit} from '@angular/core';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {MedicalService} from '../../../model/medical-service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Tax} from '../../../model/Tax';
import {forEach} from '@angular/router/src/utils/collection';
import {Branch} from '../../../model/branch';
import {letProto} from 'rxjs/operator/let';

@Component({
    selector: 'add-medical-services-component',
    templateUrl: '../../../templates/dashboard/setting/add-medical-services.template.html',
})
export class AddMedicalServiceComponent implements OnInit {

    ms: MedicalService = new MedicalService();
    taxes: Tax[] = [];
    branchId: number;
    serviceTax: any;
    branchIds: number[] = [];

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private router: Router) {
        this.ms.tax.id = -1;
        this.getBranchesFromServer();
        this.getDepartmentsFromServer();
        this.getTaxesFromServer();
    }

    ngOnInit() {

    }

    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.ms.branches = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getDepartmentsFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.ms.departments = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    onBranchSelection() {

        this.ms.selectedDepartments = [];
        this.ms.departments = [];
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_BY_BRANCHES_IDs_URI + '?branchIds=' + this.ms.selectedBranches)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'CLI_DPT_SUC_01') {
                        this.ms.selectedDepartments = [];
                        this.ms.departments = [];
                        this.ms.departments = response['responseData'];
                    } else {
                        this.ms.selectedDepartments = [];
                        this.ms.departments = [];
                        this.notificationService.error(response['responseMessage']);
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    getTaxesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_TAX_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'SER_TAX_SUC_01') {
                        this.taxes = response['responseData'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    saveMedicalServices(msForm: NgForm) {
        if (msForm.valid) {

            let foundBranch = 0;
            for (let branch of this.ms.branches) {
                if (branch.checkedBranch) {
                    foundBranch++;
                }
            }

            if (foundBranch <= 0) {
                this.notificationService.warn('Please select at least one branch.');
                document.getElementById('branchId').focus();
                return;
            }

            let foundDepartment = 0;
            for (let department of this.ms.departments) {
                if (department.checkedDepartment) {
                    foundDepartment++;
                }
            }

            if (foundDepartment <= 0) {
                this.notificationService.warn('Please select at least one Department.');
                document.getElementById('departmentId').focus();
                return;
            }

            if (this.ms.tax.id <= 0) {
                this.notificationService.warn('Please select tax.');
                document.getElementById('taxId').focus();
                return;
            }

            this.requestsService.postRequest(
                AppConstants.SAVE_MEDICAL_SERVICES_URL,
                this.ms)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'MED_SER_SUC_02') {
                            this.notificationService.success(response['responseMessage'], 'Medical Service');
                            this.router.navigate(['/dashboard/setting/medicalServices']);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Medical Service');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {

            if (this.ms.name === '') {
                this.notificationService.warn('Please enter name.');
                document.getElementById('msTitle').focus();
                return;
            }
            if (this.ms.code === '') {
                this.notificationService.warn('Please enter code.');
                document.getElementById('code').focus();
                return;
            }
            this.notificationService.error('Please provide required field data', 'Medical Service');
        }
    }


}
