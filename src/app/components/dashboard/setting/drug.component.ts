import {Component, OnInit} from '@angular/core';
import {HISUtilService} from '../../../services/his-util.service';
import {Router} from '@angular/router';
import {RequestsService} from '../../../services/requests.service';
import {UserSharedService} from '../../../services/user.shared.service';
import {AppConstants} from '../../../utils/app.constants';
import {NotificationService} from '../../../services/notification.service';
import {FormBuilder} from '@angular/forms';
import {DrugModel} from '../../../model/drug.model';
import {MenuItem, SelectItem} from "primeng/api";
import {FileServices} from "../../../services/FileServices";
import {DrugManufacturerModel} from "../../../model/DrugManufacturerModel";
import {isNullOrUndefined} from "util";

@Component({
    selector: 'drug',
    templateUrl: '../../../templates/dashboard/setting/drug.template.html',
})
export class DrugComponent implements OnInit {

    drug: DrugModel = new DrugModel();
    nextPage: any;
    prePage: any;
    currPage: any;
    pages: number[] = [];
    data: DrugModel [] = [];
    cols: any[];
    drugMaker: SelectItem[] = [];
    drugMakeListModified: SelectItem[] = [];
    drugMakeList: any = [];
    drugDataImport: File = null;
    items: MenuItem[];

    constructor(private requestsService: RequestsService,
                private router: Router,
                private userSharedService: UserSharedService,
                private HISUtilService: HISUtilService,
                private notificationService: NotificationService,
                private fileServices: FileServices) {
    }

    ngOnInit() {
        if (window.localStorage.getItem(btoa('access_token'))) {
            // this.getPageWiseDrugFromServer(0);
            this.getAllDrugsFromServer();
        } else {
            this.router.navigate(['/login']);
        }
        this.allDrugManufacturer();

        this.cols = [
            { field: 'drugName', header: 'Drug Name' },
            { field: 'companyName', header: 'Company Name' },
            { field: 'genericName', header: 'Generic Name' },
            { field: 'route', header: 'Route' },
            { field: 'strength', header: 'Strength' },
            { field: 'uOM', header: 'UoM' },
            { field: 'drugMaker', header: 'Manufacturer' },
            { field: 'status', header: 'Status' },
            { field: 'active', header: 'Action' }
        ];
        this.items = [
            {label: 'Download Sample',  icon: 'fa fa-download',
                command: () => {
                    this.fileServices.downloadSampleFile('drug');
                }
            },
            {label: 'Import Data', icon: 'fa fa-upload',
                command: () => {
                    this.importDataClicked();
                }
            },
        ];

    }

    getPageWiseDrug(page: number) {
        // this.data = [];
        // if (this.searched) {
        //     this.searchClinicalDepartment(page);
        // } else {
        this.getPageWiseDrugFromServer(page);
        // }
    }
       

    allDrugManufacturer() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_ACTIVE_DRUG_MAKERS)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'DRUG_MANUFACTURER_SUC_11') {
                    this.drugMakeList = response['responseData'];
                    for (let drugMaker of this.drugMakeList) {
                        let pair: any = {label: drugMaker.name, value: drugMaker.id};
                        this.drugMakeListModified.push(pair);
                    }
                }
            },
            (error: any) => {
                this.notificationService.error(error.error.error);
            }
        );
    }


    getPageWiseDrugFromServer(page: number) {
        // this.searchDepart = '';

        this.requestsService.getRequest(
            AppConstants.DRUG_FETCH_ALL_PAGINATED_URI + page)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_8') {
                        this.nextPage = response['responseData']['nextPage'];
                        this.prePage = response['responseData']['prePage'];
                        this.currPage = response['responseData']['currPage'];
                        this.pages = response['responseData']['pages'];
                        this.data = response['responseData']['data'];
                        console.log(this.data);
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    getAllDrugsFromServer() {
        this.requestsService.getRequest(AppConstants.DRUG_FETCH_ALL_PAGINATED_URI + "all")
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'DRUG_SUC_10') {
                        this.data = response['responseData']['data'];
                        console.log(this.data);
                    }
                },
                (error: any) => {
                    //console.log(error.json())
                    this.notificationService.error(error.error.error);
                }
            );
    }

    deleteDrug(drugId: number) {
        if (window.localStorage.getItem(btoa('access_token'))) {
            if (!confirm('Are You Sure Want To Delete?')) return;
            this.requestsService.deleteRequest(
                AppConstants.DRUG_DELETE_URI + drugId)
                .subscribe(
                    (response: Response) => {
                        if (response['responseCode'] === 'DRUG_SUC_6') {
                            this.notificationService.success(response['responseMessage'], 'Drug');
                            // this.getPageWiseDrugFromServer(0);
                            this.getAllDrugsFromServer();
                        } else {
                            // this.getPageWiseDrugFromServer(0);
                            this.getAllDrugsFromServer();
                            this.notificationService.error(response['responseMessage'], 'Drug');
                        }
                    },
                    (error: any) => {
                        this.notificationService.error(error.error, 'Drug')
                    }
                );
        } else {
            this.router.navigate(['/login']);
        }
    }
    
    saveDrug(data: FormData) {
        if (this.drug.drugName == '') {
            this.notificationService.error('Please enter Drug name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }
        if (this.drug.genericName == '') {
            this.notificationService.error('Please enter generic Name.', 'Drug');
            document.getElementById('genericName').focus();
            return;
        }
        // if (this.drug.companyName == '') {
        //     this.notificationService.error('Please enter company Name.', 'Drug');
        //     document.getElementById('companyName').focus();
        //     return;
        // }
        if (this.drug.route == '') {
            this.notificationService.error('Please enter  route name.', 'Drug');
            document.getElementById('route').focus();
            return;
        }

        if (this.drug.strengths.length == 0) {
            this.notificationService.error('Please enter  strength.', 'Drug');
            document.getElementById('strengths').focus();
            return;
        }

       // if(isNullOrUndefined(this.drugMaker)){
       //      this.notificationService.error('Please Select Make.', 'Drug');
       //      document.getElementById('origin').focus();
       //      return;
       //  }
       //  this.drug.drugMaker=this.drugMaker;
        console.log(this.drug);
        this.requestsService.postRequest(AppConstants.DRUG_SAVE_URL, this.drug)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'DRUG_SUC_1') {
                    this.notificationService.success(response['responseMessage'], 'Drug');
                    // this.getPageWiseDrugFromServer(0);
                    this.getAllDrugsFromServer();
                    this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                } else {
                    this.notificationService.error(response['responseMessage'], 'Drug');
                }
            },
            (error: any) => {
                //console.log(error.json())
                // this.notificationService.error(error.error.error);
                this.notificationService.error('Cannot Save Drug Record', 'Drug');
            }
        );
    }

    updateDrug() {

        if (this.drug.drugName == '') {
            this.notificationService.error('Please enter Drug name.', 'Drug');
            document.getElementById('drugName').focus();
            return;
        }
        if (this.drug.genericName == '') {
            this.notificationService.error('Please enter generic Name.', 'Drug');
            document.getElementById('genericName').focus();
            return;
        }
        // if (this.drug.companyName == '') {
        //     this.notificationService.error('Please enter company Name.', 'Drug');
        //     document.getElementById('companyName').focus();
        //     return;
        // }
        if (this.drug.route == '') {
            this.notificationService.error('Please enter drug route.', 'Drug');
            document.getElementById('route').focus();
            return;
        }

        if (this.drug.strengths.length == 0) {
            this.notificationService.error('Please enter  strength.', 'Drug');
            document.getElementById('strengths').focus();
            return;
        }

        this.drug.drugMaker=this.drugMaker;
        console.log(this.drug);
        this.requestsService.putRequest(AppConstants.DRUG_UPDATE_URL, this.drug)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'DRUG_SUC_11') {
                    this.notificationService.success(response['responseMessage'], 'Drug');
                    // this.getPageWiseDrugFromServer(0);
                    this.getAllDrugsFromServer();
                    this.HISUtilService.hidePopupWithCloseButtonId('closeButton');
                } else {
                    this.notificationService.error(response['responseMessage'], 'Drug');
                }
            }, (error: any) => {
                //console.log(error.json())
                this.notificationService.error('Cannot Update Drug Record', 'Drug');
                // this.notificationService.error(error.error.error);
            });
    }

    onUpdatePopupDrug(id: any) {
        this.requestsService.getRequest(AppConstants.DRUG_GET_URL + id)
            .subscribe((response: Response) => {
                if (response['responseCode'] === 'DRUG_SUC_10') {
                    this.drug = response['responseData'];
                    let drug = new DrugModel();
                    this.drug.routes = drug.routes;
                    this.drug.UOMs = drug.UOMs;

                    if (isNaN(this.drug.drugMaker)) {
                        this.drugMaker = this.drug.drugMaker;
                    } else {
                        this.drugMaker = this.drug.addInfo.drugMaker;
                    }

                    console.log(this.drug);
                } else {
                    this.notificationService.error(response['responseMessage']);
                }
            }, (error: any) => {
                // this.notificationService.error(error.error.error);
            });
    }

    onAddDrug() {
        this.drug = new DrugModel();
        this.requestsService.getRequest(AppConstants.DRUG_GET_NATURAL_ID_URL)
            .subscribe((response: Response) => {
                if (response['responseCode'] == 'DRUG_SUC_15') {
                    this.drug.drugNaturalId = response['responseData'];
                } else {
                    this.notificationService.error(response['responseMessage']);
                }
            }, (error: any) => {
                // this.notificationService.error(error.error.error);
            }
        );
    }

    importData(event: any) {
        console.log(event);
        console.log("Data import method is called");
        let fileList: FileList = event.target.files;
        if (fileList != null && fileList.length > 0) {
            if (event.target.name === 'drugsDataImport') {
                if (fileList[0].size > 0 && fileList[0].size < 4000000) {         // if (fileList[0].size < 4000000) {
                    this.drugDataImport = fileList[0];
                    this.requestsService.postRequestMultipartForm(AppConstants.IMPORT_DRUGS_LIST_TO_SERVER, this.drugDataImport)
                        .subscribe(
                            (response: Response) => {
                                if (response['responseCode'] === 'SUCCESS') {
                                    this.notificationService.success(response['responseMessage'], 'Drug');
                                    // this.getPageWiseDrugFromServer(0);
                                    this.getAllDrugsFromServer();
                                } else {
                                    this.notificationService.error(response['responseMessage'], 'Drug');
                                }
                            }, (error: any) => {
                                //console.log(error.json())
                                this.HISUtilService.tokenExpired(error.error.error);
                                this.notificationService.error(error.error.responseMessage, 'Drug');
                            }
                        );
                } else {
                    this.notificationService.warn('File size must be more than 0 byte and less than 4 MB');
                }
            }
        }
    }

    openUrl(val :string){
        let url: string = '';
        if (!/^http[s]?:\/\//.test(val)) {
            url += 'http://';
        }
        url += val;
        window.open(url, '_blank');
        //   window.open("https://www.google.com", "_blank");
    }

    drugMakerPrint() {
        this.drugMaker = this.drug.drugMaker;
        console.log(this.drugMaker);
        console.log(this.drug.drugMaker);
    }

    openCaretDropdown() {
        let elementByDiv: any[] = Array.from(document.getElementsByClassName("ui-splitbutton-menubutton"));
        for (let i = 0; i < elementByDiv.length; i++) {
            // console.log(elementByDiv[i]);
            elementByDiv[i].click();
        }
    }

    importDataClicked(){
        document.getElementById("drugsDataImport").click();
    }

}
