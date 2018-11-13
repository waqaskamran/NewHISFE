import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../../services/notification.service';
import {RequestsService} from '../../../services/requests.service';
import {HISUtilService} from '../../../services/his-util.service';
import {AppConstants} from '../../../utils/app.constants';
import {ActivatedRoute, Router} from "@angular/router";
import {SmsTemplateModel} from "../../../model/SmsTemplateModel";
import {PrefixTemplateModel} from "../../../model/PrefixTemplateModel";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'prefix-template-component',
    templateUrl: '../../../templates/dashboard/setting/prefix.template.html',
})
export class PrefixTemplateComponent {

    smsTemplateList: SmsTemplateModel[] = [];
    prefixTemplateList: PrefixTemplateModel[];
    prefixTemplate: PrefixTemplateModel = new PrefixTemplateModel();

    id: number;

    constructor(private notificationService: NotificationService,
                private requestsService: RequestsService,
                private HISUtilService: HISUtilService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        document.title = 'HIS | Email Template';
        if (localStorage.getItem(btoa('access_token'))) {
            this.getAllPrefixList();
        }
    }

    getAllPrefixList() {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.getRequest(AppConstants.FETCH_PREFIX_CONFIGURATIONS
            ).subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.prefixTemplateList = response['responseData'];
                           // console.log("Length : " + this.prefixTemplateList.length);
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Prefix Configurations');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(Response['responseMessage'], 'Prefix Configurations');
                    }
            );
        } else {
            this.router.navigate(['/login']);
        }
    }


    editPrefixModule(formData: NgForm) {
        if (localStorage.getItem(btoa('access_token'))) {
            this.requestsService.postRequest(AppConstants.PREFIX_CONFIGURATION_SAVE , this.prefixTemplate)
             .subscribe(
               (response: Response) => {
                        if (response['responseCode'] === 'SUCCESS') {
                            this.prefixTemplateList = response['responseData'];
                            document.getElementById('close-btn-Prefix').click();
                            this.notificationService.success(response['responseMessage'], 'Update Module Prefix');
                        } else {
                            this.notificationService.error(response['responseMessage'], 'Update Module Prefix');
                        }
                    },
                    (error: any) => {
                        this.HISUtilService.tokenExpired(error.error.error);
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }


    edit(editModule: any){
        this.prefixTemplate = editModule;
    }
}