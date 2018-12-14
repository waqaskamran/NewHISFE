import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer, Renderer2} from '@angular/core';
import {
    ViewChild,
    TemplateRef
} from '@angular/core';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
    addMinutes
} from 'date-fns';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material';
import {
    CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,
    CalendarEventTitleFormatter
} from 'angular-calendar';
import {AppConstants} from '../../../utils/app.constants';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Subject} from 'rxjs/Rx';
import {RequestsService} from '../../../services/requests.service';
import {NotificationService} from '../../../services/notification.service';
import {Router} from '@angular/router';
import {Appointment} from '../../../model/Appointment';
import {UserTypeEnum} from '../../../enums/user-type-enum';
import {BranchDoctors} from "../../../model/branchdoctors";
import {Branch} from "../../../model/branch";
import {HISUtilService} from "../../../services/his-util.service";
import {ModalDirective} from "ngx-bootstrap";
import { DatePicker } from 'angular2-datetimepicker';
import {isNullOrUndefined} from "util";


declare var $: any;

@Component({
    selector: 'add-appointment-component',
    templateUrl: '../../../templates/dashboard/appointment/add-appointment-template.html',
    /*providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter
        }]*/
})
export class AddAppointmentComponent implements OnInit ,AfterViewInit {
    refresh: Subject<any> = new ReplaySubject<any>(1);
    events: CalendarEvent[] = [];
    eventsRequest: CalendarEvent[] = [];
    activeDayIsOpen: boolean = false;
    title = 'app';
    patientChecked: boolean = false;
    popup: boolean = false;
    page: number = 0;
    color: string;
    startDate = new Date(2018, 1, 1);
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @ViewChild('addModal') addModal: ModalDirective;
    dateSchedule:Date =new Date();

    view: string = 'month';
    newPatient: boolean = false;
    viewDate: Date = new Date();
    data: any = [];
    branches: any[];
    branchDoctor: BranchDoctors[];
    filteredDoctor: BranchDoctors[];
    filteredServices: any;
    brFiltered: Branch[] = [];
    doctorsList: any[];
    patients: any[] = [];
    selectedType: any = [];
    updateSelectedType: any = [];
    appointmentType: any = [];
    examRooms: any = [];
    filteredData: any[];
    test: string = 'lahore';
    selectedPatientId: number;
    searchedDoctor: number;
    searchedBranch: number;
    servicesList: any = [];
    servicesListWithDoctors: any = [];
    error: string;
    disbaleDoctor: boolean = false;
    serviceDuration: any = 0;
    maxNo: boolean = false;
    amt: number = 0;
    statusesList :any =[];
    modalData: {
        action: string;
        event: CalendarEvent;
    };
    newPatientValidaor : boolean = true;
    patientDisable:boolean =false;
    isRecurringFlag :boolean = false;
    lastAppointmentRecurring : Date =new Date();
    fastAppointmentRecurring : Date =new Date();
    stateOfPatientBox: boolean = false;
    status = [
        {id: 1, name: 'CONFIRMED'},
        {id: 2, name: 'CHECK_IN'},
        {id: 3, name: 'IN_SESSION'},
        {id: 4, name: 'RE_SCHEDULED'},
        {id: 5, name: 'COMPLETE'},
        {id: 9, name: 'CANCELLED'},
        {id: 7, name: 'IN_ROOM'},
        {id: 8, name: 'NOT_CONFIRMED'},

    ];

    Type = [
        {id: 1, name: 'Regular', checked: false},
        {id: 2, name: 'Walk-In', checked: false}
        /* {id: 4, name: 'NewPatient', checked: false},*/

    ];


    ngAfterViewInit(): void {
        this.getAllAppointments();

    }
    getAllAppointments(){
        this.events.length=0;
        this.requestsService.getRequest(
            AppConstants.FETCH_APPOINTMENTS_URL)
            .subscribe(
                (response: Response) => {
                    console.log('');
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        for (let apt of response['responseData']) {
                            this.events.push({
                                id: apt.id,
                                /* title: `${apt.patient}  ' ' ${apt.scheduleDateAndTime}  ' '  ${apt.branchName}`,*/
                                title: /*'<div  class="popup-hiden">\n' +apt.branchName+*/
                                '<div class="headng-bck">\n' +
                                ' <div class="hadng-txt">\n' +
                                '<table width="236" border="0">\n' +
                                '\n' +
                                '<tr class="" width="236">\n' +
                                '    <td style="width:20%; padding: 6px !important; margin: 6px;"><img alt="" width="70" height="70" class="img-circle" src="/public/images/patient.jpg"></td>\n' +
                                '    <td style="width:80%; padding: 6px !important; margin: 6px;"><h2>'+ apt.patient +'</h2></td>\n' +
                                '</tr>\n' +
                                '  </table>\n' +
                                '            </div>\n' +
                                /* '        </div> ' +*/
                                '<div class="bc-bg">\n' +
                                '                <table width="236" border="0">\n' +
                                '\n' +
                                '            <tr class="gry-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Branch</td>\n' +
                                '                    <td style="width:70%">\n'+apt.branchName +'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Patient</td>\n' +
                                '                    <td style="width:70%">\n'+apt.patient +'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Schedule Date</td>\n' +
                                '                    <td style="width:70%">\n'+apt.scheduleDate +'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Doctor</td>\n' +
                                '                    <td style="width:70%">\n'+apt.docFirstName+'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Service</td>\n' +
                                '                    <td style="width:70%">\n'+apt.serviceName+'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Duration</td>\n' +
                                '                    <td style="width:70%">\n'+apt.duration +'min'+'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Status</td>\n' +
                                '                    <td style="width:70%">\n'+apt.status+'</td>\n' +
                                '                </tr>\n' +
                                '            <tr class="whte-bckgrnd inr-txt">\n' +
                                '                    <td style="width:30%">Room</td>\n' +
                                '                    <td style="width:70%">\n'+apt.examName+'</td>\n' +
                                '                </tr>\n' +
                                '            </table>\n' +
                                '                \n' +
                                '            </div>\n' +
                                '            </div>\n' ,
                                /*   '<br/>' + '' + apt.scheduleDateAndTime + '<br/>' + " " + apt.branchName,*/
                                start: addMinutes(startOfDay(new Date(apt.scheduleDate)), apt.appointmentConvertedTime),
                                end: addMinutes(startOfDay(new Date(apt.scheduleDate)), apt.appointmentEndedConvertedTime),
                                /*color: {
                                    primary: apt.color,
                                    secondary: apt.color
                                },*/
                                colorHash: apt.color,
                                draggable: true,
                                notes: apt.notes,
                                // patientId: apt.patientId,
                                reason: apt.reason,
                                status: apt.status,
                                duration: apt.duration,
                                age: apt.age,
                                type: apt.appointmentType,
                                //cellPhone:apt.patient.profile.cellPhone,
                                //selectWorkingDays:this.selectedRecurringDays,
                                appointmentType: apt.appointmentType,
                                followUpDate: apt.followUpDateResponse,
                                followUpReason: apt.followUpReason,
                                recurseEvery: apt.recurseEvery,
                                neverEnds: false,
                                followUpReminder: apt.followUpReminder,
                                arrangeFollowUpReminder: false,
                                firstAppointment: apt.firstAppointmentOn,
                                lastAppointment: apt.lastAppointmentOn,
                                recurringAppointment: false,
                                branch: apt.branchName,
                                examRoom: apt.examName,
                                branchId: apt.branchId,
                                roomId: apt.roomId,
                                doctorId: apt.doctorId,
                                serviceId: apt.serviceId,
                                patientId: apt.patientId,
                                appointmentId :apt.appointmentId,
                                statusId :apt.statusId

                            });
                            this.refresh.next();
                        }

                    }

                    //  this.renderer.setText(this.nameInputRef,'kamiii')

                },
                (error: any) => {
                    //  this.hisUtilService.tokenExpired(error.error.error);
                }
            );
    }
    constructor(private modal: NgbModal, private dialog: MatDialog, private fb: FormBuilder, private hisCoreUtilService: HISUtilService,
                private notificationService: NotificationService, private router: Router, private requestsService: RequestsService,private renderer: Renderer2) {
        this.getBranchesFromServer();
        this.getDoctorsFromServer();
        this.allServices();
        this.getPatientFromServer();
        this.allServicesWithDoctors();
        this.getBranchesAndDoctorFromServer();

        DatePicker.prototype.ngOnInit = function() {
            this.settings = Object.assign(this.defaultSettings, this.settings);
            if (this.settings.defaultOpen) {
                this.popover = true;
            }
            this.settings.timePicker =true;
            // this.settings.format = 'dd-MM-yyyy'
            this.date = new Date();
        };


    }

    ngOnInit() {
        this.allStatusesOfOrganization();
    }

    get selectedOptions() {
        return this.Type
            .filter(opt => opt.checked)
            .map(opt => opt.name);
    }

    allServices() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.servicesList = response['responseData'];
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    closeAddModal() {
        this.eventsRequest.length = 0;
        this.selectedType.length = 0;
        this.refresh.next();
        this.maxNo =false;
        this.amt =0;
        if(this.Type.length !=0)
            this.Type.map((x:any)=>{x.checked = false});
        this.addModal.hide();

    }

    selectType(form: NgForm, checked: boolean) {
        this.selectedType.length = 0;
        if (checked)
            this.amt++
        else
            this.amt--
        this.amt === 2 ? this.maxNo = true : this.maxNo = false;
        console.log('amount' + this.amt);
        this.selectedType.push(...this.selectedOptions);
    }

    createNewPatient() {
        if (this.stateOfPatientBox) {
            this.patientChecked = true;
            this.newPatient = true;
            this.newPatientValidaor =false;
            this.patientDisable = true;
        }
        else {
            this.patientChecked = false;
            this.newPatient = false;
            this.newPatientValidaor =true;
            this.patientDisable = false;
        }
    }

    moveMouse(action: string, event: CalendarEvent) {
        this.modalData = {event, action};
        this.popup = true;
    }

    mouseEnter(div: string) {
        //  console.log("mouse enter : " + div);
    }

    mouseLeave(action: string, event: CalendarEvent) {
        this.popup = false;
    }

    recurringDays = [
        {name: 'Monday'},
        {name: 'Tuesday'},
        {name: 'Wednesday'},
        {name: 'Thursday'},
        {name: 'Friday'},
        {name: 'Saturday'},
        {name: 'Sunday'},

    ];
    selectedRecurringDays: any = [];

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);

            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.eventsRequest = this.eventsRequest.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];


    getBranchesFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_URL + 'all')
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branches = response['responseData'];
                    }
                },
                (error: any) => {
                }
            );
    }

    getDoctorsFromServer() {
        this.requestsService.getRequest(
            AppConstants.USER_BY_ROLE + '?name=' + UserTypeEnum.DOCTOR)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'USER_SUC_01') {
                        this.doctorsList = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
    }

    getBranchesAndDoctorFromServer() {
        this.requestsService.getRequest(
            AppConstants.FETCH_ALL_BRANCHES_WITH_DOCTOR_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'BR_SUC_01') {
                        this.branchDoctor = response['responseData'];
                        let brObj;
                        let _brMap = new Map<any, String>();
                        this.branchDoctor.forEach(function (element) {
                            _brMap.set(element.id, element.branchName);

                        })
                        _brMap.forEach((key: string, value: number) => {
                            brObj = new Branch(value, key);
                            this.brFiltered.push(brObj);
                        })


                    }
                },
                (error: any) => {

                }
            );
    }

    allServicesWithDoctors() {
        this.requestsService.getRequest(AppConstants.FETCH_MEDICALSERVICES_WITH_DOCTORS)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'MED_SER_SUC_01') {
                        this.servicesListWithDoctors = response['responseData'];
                        //console.log(this.servicesList);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }
    allStatusesOfOrganization() {
        this.requestsService.getRequest(AppConstants.FETCH_ALL_STATUSES)
            .subscribe(
                (response: Response) => {
                    //console.log('i am branch call');
                    if (response['responseCode'] === 'STATUS_SUC_05') {
                        this.statusesList = response['responseData'];
                        //console.log(this.servicesList);
                    }
                },
                (error: any) => {
                    this.error = error.error.error;
                })

    }

    getPatientFromServer() {
        this.requestsService.getRequest(
            AppConstants.GET_ALL_PATIENT_URL)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'PATIENT_SUC_11') {
                        this.patients = response['responseData'];
                    }
                },
                (error: any) => {

                }
            );
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                // this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.addEvent(date);
    }

    eventTimesChanged({
                          event, newStart, newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = {event, action};
        this.filteredDoctor = [...this.branchDoctor];
        this.filteredServices = [...this.servicesListWithDoctors];
        this.disbaleDoctor = true;
        this.Type.filter(e => event.appointmentType.includes(e.name)).map(e => e.checked = true);
        this.selectedType = event.appointmentType;
        var filteredData2 = this.branches.filter(x => x.id == event.branchId);

        this.examRooms = filteredData2[0].examRooms;
        $('#exampleModalCenter2').modal('show');

    }

    deleteEvent(action: string, event: CalendarEvent): void {

        this.eventsRequest.splice(this.eventsRequest.indexOf(event), 1);
        //this.refresh.next();
    }

    addEvent(date: any): void {
        this.disbaleDoctor = true;
        this.eventsRequest.length = 0;
        this.serviceDuration = 0;
        this.addModal.show();
        //  $('#create-responsive').modal('show');
        /* $('#create-responsive').on('show', function() {
             alert('hello i am jquery');
         })*/
        this.eventsRequest.push({
            title: 'Name',
            start: startOfDay(new Date(date)),
            end: endOfDay(date),
            draggable: true,
            notes: '',
            email: '',
            patient: 0,
            reason: '',
            status: 'CONFIRMED',
            duration: this.serviceDuration,
            age: 'age',
            type: '',
            gender: 'Gender',
            cellPhone: '',
            selectWorkingDays: this.selectedRecurringDays,
            appointmentType: this.selectedType,
            followUpDate: new Date(),
            followUpReason: '',
            recurseEvery: 'rescurse',
            neverEnds: false,
            followUpReminder: false,
            arrangeFollowUpReminder: false,
            firstAppointment: new Date(),
            lastAppointment: new Date(),
            recurringAppointment: false,
            branch: 'select',
            //  doctorId: 0,
            examRoom: 'select',
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });

        this.refresh.next();

    }

    getSearchedBranch(brObj: any) {
        this.searchedBranch = brObj.value;
    }

    getSearchedDoctor(docObj: any) {
        this.searchedDoctor = docObj.value;
    }

    searchAppointment() {
        var self = this;
        this.requestsService.searchWithParam(AppConstants.SEARCH_APPOINTMENT_URL, this.searchedDoctor, this.searchedBranch)
            .subscribe(
                (response: Response) => {
                    if (response['responseCode'] === 'APPT_SUC_01') {
                        this.events.length = 0;
                        self.notificationService.success('Success', "Appointment Founded ");
                        for (let apt of response['responseData']) {
                            this.events.push({
                                id: apt.id,
                                title: apt.patient,
                                start: startOfDay(new Date(apt.scheduleDate)),
                                end: endOfDay(new Date(apt.scheduleDate)),
                                color: {
                                    primary: apt.color,
                                    secondary: apt.color
                                },
                                colorHash: apt.color,
                                draggable: true,
                                notes: apt.notes,
                                reason: apt.reason,
                                status: apt.status,
                                duration: apt.duration,
                                age: apt.age,
                                type: apt.appointmentType,
                                //cellPhone:apt.patient.profile.cellPhone,
                                //selectWorkingDays:this.selectedRecurringDays,
                                appointmentType: apt.appointmentType,
                                followUpDate: new Date(),
                                followUpReason: apt.followUpReason,
                                recurseEvery: apt.recurseEvery,
                                neverEnds: false,
                                followUpReminder: false,
                                arrangeFollowUpReminder: false,
                                firstAppointment: apt.firstAppointmentOn,
                                lastAppointment: apt.lastAppointmentOn,
                                recurringAppointment: false,
                                branch: apt.branchName,
                                examRoom: apt.examName,
                                branchId: apt.branchId,
                                roomId: apt.roomId,
                                doctorId: apt.doctorId
                                //service id
                            });
                            this.refresh.next();
                        }

                    }
                    if (response['responseCode'] === 'APPT_ERR_03') {
                        this.events = [];
                        self.notificationService.warn("No Appointment Founded");
                    }

                }, (error: any) => {
                    console.log('user defined Erro ' + error);
                });
    }

    selectRecurringDays(event: any, item: any) {
        if (event.target.checked) {
            this.selectedRecurringDays.push(item.name);
        }
        else {
            let updateItem = this.selectedRecurringDays.find(this.findIndexToUpdate, item.name);
            let index = this.selectedRecurringDays.indexOf(updateItem);
            this.selectedRecurringDays.splice(index, 1);
        }
    }

    findIndexToUpdate(type: any) {
        return type.name === this;
    }

    getExamRoom(eventObj: any) {
        this.disbaleDoctor = false;
        console.log('br objj' + eventObj.value);
        /*  var sp = event.split(': ');
          if (sp.length > 1)
              roomId = sp[1];
          else
              roomId = sp[0];*/
        let roomId = eventObj.value;
        let filteredData2 = this.branchDoctor.filter(x => x.id == roomId);
        let filterDoctor = this.branchDoctor.filter(x => x.id == roomId);
        if(filteredData2.length != 0){this.examRooms = filteredData2[0].examRooms;}
        let filteredDoctorsWithValue : any[]=[];
        let branchDocobj2 = null;
        filterDoctor.forEach(x => {
            branchDocobj2  = new DoctorService(x.firstName+ x.lastName,x.doctorId);
            filteredDoctorsWithValue.push(branchDocobj2);
        })
        //  filteredDoctorsWithValue.forEach(x=>{console.log('xv' , x.label , x.value)})
        this.filteredDoctor = [...filteredDoctorsWithValue];
    }

    selectServices(item: any) {
        this.filteredServices = [];
        let list = this.servicesListWithDoctors.filter((x: any) => x.doctorId == item.value);
        this.filteredServices = [...list];
    }
    isRecurring(){
        this.isRecurringFlag =!this.isRecurringFlag;
    }

    saveAppointment(event: any, form: NgForm) {
        var self = this;
        let dateTes = convert(this.dateSchedule);
        console.log('appt schedulae date ' + event.firstAppointment);
        this.Type.map(x => x.checked = false);
        if (form.valid) { //error type seklection
            if (this.selectedType.length == 0) {
                this.eventsRequest.length = 0;
                self.notificationService.error('Select At leat One Type', 'Invalid Form');
            }
            if (this.newPatient == false && event.patientId == null) {
                this.eventsRequest.length = 0;
                self.notificationService.error('Patient is required', 'Invalid Form');
            }
            if (this.newPatient == true && event.newPatient == undefined) {
                this.eventsRequest.length = 0;
                this.newPatient = false;
                self.notificationService.error('Patient Name and Cell Phone are mandatory', 'Invalid Form');
            }
            if (this.eventsRequest.length != 0) {
                let obj = new Appointment(event.id, event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId,
                    event.reason, event.statusId, this.serviceDuration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
                    event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId, this.stateOfPatientBox,this.dateSchedule);
                this.requestsService.postRequest(AppConstants.CREATE_APPOINTMENT_URL,
                    obj)
                    .subscribe(
                        (response: Response) => {
                            if (response['responseCode'] === 'APPT_SUC_02') {
                                self.notificationService.success('created successfully', 'Appointment');
                                self.router.navigate(['/dashboard/appointment/manage']);
                                this.eventsRequest.length = 0;
                                this.selectedType.length = 0;
                                this.hisCoreUtilService.hidePopupWithCloseButtonId('closeAppt');
                                /*  $('#exampleModalCenter2').modal('close');*/
                            }
                            else if (response['responseCode'] === 'APPT_ERR_06') {
                                this.eventsRequest.length = 0;
                                this.selectedType.length = 0;
                                self.notificationService.error('Appointment on this Schedule is Already Exists', 'Appointment');
                                this.hisCoreUtilService.hidePopupWithCloseButtonId('closeAppt');
                            }
                            else {
                                this.eventsRequest.length = 0;
                                self.notificationService.error('Appointment is not created', 'Appointment');
                            }
                            this.newPatient = false;
                        },

                        (error: any) => {

                        });
            }
        } else {
            this.eventsRequest.length = 0;
            //   $('#exampleModalCenter2').modal('close');
            //   this.validateAllFormFields(form);
            self.notificationService.error('Error', 'Invalid Form');
        }
    }

    updateAppointment(event: any) {
        var self = this;
        console.log('up apptment'+ event.start)
        let obj = new Appointment(event.id,event.appointmentId, event.title, event.branchId, event.doctorId, event.scheduleDateAndTime, event.start, event.end, event.draggable, this.selectedRecurringDays, this.selectedType, event.notes, event.patientId,
            event.reason, event.statusId, event.duration, event.followUpDate, event.followUpReason, event.followUpReminder, event.recurringAppointment, event.recurseEvery,
            event.firstAppointment, event.lastAppointment, event.examRoom, event.age, event.cellPhone, event.gender, event.email, this.color, event.roomId, event.newPatient, event.dob, event.serviceId,this.stateOfPatientBox,event.start);
        this.requestsService.putRequest(AppConstants.UPDATE_APPOINTMENT + event.id,
            obj).subscribe(
            (response: Response) => {
                console.log('event idd appt:' + event.appointmentId);
                if (response['responseCode'] === 'APPT_SUC_03') {
                    self.notificationService.success('Updated successfully', 'Appointment');
                    self.router.navigate(['/dashboard/appointment/manage']);
                } else {
                    self.notificationService.warn(`Warning, ${response['responseMessage']}`);
                }
            },
            (error: any) => {

            });
    }

    getSelectedService(item: any) {
        let list = this.servicesListWithDoctors.filter((x: any) => x.mServiceId == item.value);
        list.forEach((x:any)=>{console.log('services test'+ x.doctorId + 'teta'+x.duration)
            if (!isNullOrUndefined(x))
                this.serviceDuration = x.duration ?x.duration : '';
        })
    }

    refreshAllAppointments():void{
        this.getAllAppointments();
    }

    /*  validateAllFormFields(formGroup: NgForm) {
          Object.keys(formGroup.controls).forEach(field => {
              const control = formGroup.get(field);
              if (control instanceof FormControl) {
                  control.markAsTouched({onlySelf: true});
              } else if (control instanceof FormGroup) {
                  this.validateAllFormFields(control);
              }
          });
      }*/

}
class DoctorService{
    label:string;
    value:number;
    constructor(label:string,value:number){
        this.label = label;
        this.value = value;
    }
}
function convert(str:any) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day ].join("-");
}