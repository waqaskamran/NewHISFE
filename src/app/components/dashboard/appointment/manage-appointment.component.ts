import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AppConstants} from "../../../utils/app.constants";
import {HISUtilService} from "../../../services/his-util.service";
import {NotificationService} from "../../../services/notification.service";
import {MedicalService} from '../../../model/medical-service';
import {ConfirmationdialogComponent} from '../confirmationdialog.component';
import {ConformationDialogService} from '../../../services/ConformationDialogService';

@Component({
    selector: 'manage-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/manage-appointment.template.html',
})
export class ManageAppointmentComponent implements OnInit {
    nextPage:any;
    prePage: any;
    currPage:any;
    pages: number[] = [];
    data: any;
    searchData:string;
    searchFlag:boolean=false;
    cols:any;
    selectedMedicalService: MedicalService = new MedicalService();

    constructor(private requestsService: RequestsService,
                private router: Router,
                private titleService: Title,
                private hisUtilService: HISUtilService,
                private confirmationDialogService:ConformationDialogService,
                private notificationService: NotificationService) {
    };

    ngOnInit() {
        this.titleService.setTitle('HIS | Manage Appointments');
        this.getAllPaginatedAppointmentsFromServer(0);

        this.cols = [
            { field: 'patientFirstName', header: 'Patient' },
            { field: 'examName', header: 'Exam Room' },
            { field: 'branchName', header: 'Branch' },
            { field: 'appointmentType', header: 'Type' },
            { field: 'scheduleDate', header: 'Started On' },
            { field: 'appointmentEndedOn', header: 'Ended On' },
            { field: 'duration', header: 'Duration' },
            { field: 'Status', header: 'status' },
            { field: 'status', header: 'Action' }
        ];

/*        <th width="15%"> Patient</th>
            <th width="15%"> Exam Room</th>
        <th width="10%"> Branch</th>
            <th width="10%"> Type</th>
            <th width="15%"> Started On</th>
        <th width="10%"> Ended On</th>
        <th width="10%"> Status</th>
            <th width="10%"> Action</th>*/
    }

    getPageWisePatients(page: number) {
        this.getAllPaginatedAppointmentsFromServer(page);
    }

    getAllPaginatedAppointmentsFromServer(page: number) {
        if (page > 0) {
            page = page;
        }
        this.requestsService.getRequest(
            AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                    }
                },
                (error: any) => {
                  //  this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }
    searchAppointment(page: any) {
        this.searchFlag = true;
        this.requestsService.getRequest(
            AppConstants.SEARCH_APPOINTMENTS_BY_PATIENT + page + '?patientName=' + this.searchData)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        /*     this.nextPage = response['responseData']['nextPage'];
                             this.prePage  = response['responseData']['prePage'];
                             this.currPage = response['responseData']['currPage'];
                             this.pages    = response['responseData']['pages'];
                             this.data     = response['responseData']['data'];
                         } else {
                             this.nextPage = 0;
                             this.prePage = 0;
                             this.currPage = 0;
                             this.pages = [];
                             this.data = null;
                         }*/
                        this.data = response['responseData'];
                    }
                    },
                (error: any) => {
                }
            );
    }
    updateAppointment(id: any) {
        this.router.navigate(['/dashboard/appointment/edit/', id]);
    }

    deleteAppointment(id: number) {
        var self=this;
        console.log('idd'+id);
        this.confirmationDialogService
            .confirm('Delete', 'Are you sure you want to do this?')
            .subscribe(res => {
                if (id) {
                    this.requestsService.deleteRequest(AppConstants.DELETE_APPOINTMENT_URI + id).subscribe((data: Response) => {
                        if (data['responseCode'] === 'APPT_SUC_05') {
                            self.notificationService.success('Appointment has been Deleted Successfully');
                            self.getAllPaginatedAppointmentsFromServer(0);

                        }
                    }, error => {
                        self.notificationService.error('ERROR', 'Appointment Unable to Delete ');

                    });
                    // this.router.navigate(['/home']);
                }
            });
    }

}
