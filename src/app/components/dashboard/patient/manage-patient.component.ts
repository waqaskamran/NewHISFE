import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";
import {UserTypeEnum} from "../../../enums/user-type-enum";
import {Patient} from "../../../model/patient";

@Component({
    selector: 'manage-patient',
    templateUrl: '../../../templates/dashboard/patient/manage-patient.template.html',
})
export class ManagePatientComponent implements OnInit {
    patient: Patient = new Patient();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: any;
    searchString:string="";
    searched:boolean=false;

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Patient');
        this.getAllPaginatedPatientFromServer(0);
    }

    getPageWisePatients(page: number) {
        if (this.searched){
            this.searchPatient(page);
        }else {
            this.getAllPaginatedPatientFromServer(page);
        }
    }

    getAllPaginatedPatientFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_PATIENT_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    deletePatient(patientId: number) {
        if (localStorage.getItem(btoa('access_token'))) {
            if (!confirm("Are Your Source You Want To Delete")) return;
            this.requestsService.deleteRequest(
                AppConstants.PATIENT_DELETE_URI + patientId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'PATIENT_SUC_06') {
                            this.notificationService.success(response['responseMessage'], 'Patient');
                            this.getAllPaginatedPatientFromServer(0);
                        } else {
                            this.getAllPaginatedPatientFromServer(0);
                            this.notificationService.error(response['responseMessage'], 'Patient');
                        }
                    },
                    (error: any) => {
                        //console.log(error.json())
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }

    searchPatient(page: number) {
        this.searched = true;
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.SEARCH_ALL_PATIENT_URL + page + '?searchString=' + this.searchString)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                        this.notificationService.success(response['responseMessage'], 'Patient');
                    }else {
                        this.data = null;
                        this.notificationService.warn(response['responseMessage']);
                    }
                },
                (error: any) => {
                    this.HISUtilService.tokenExpired(error.error.error);
                }
            );
    }

    refreshPatient(){
        this.searched = false;
        this.searchString = "";
        this.getAllPaginatedPatientFromServer(0);
    }


}
