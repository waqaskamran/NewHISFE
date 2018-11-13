"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var notification_service_1 = require("../../../services/notification.service");
var requests_service_1 = require("../../../services/requests.service");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var app_constants_1 = require("../../../utils/app.constants");
var organization_1 = require("../../../model/organization");
var AdminProfileComponent = (function () {
    function AdminProfileComponent(route, router, requestService, fb, notificationService) {
        this.route = route;
        this.router = router;
        this.requestService = requestService;
        this.fb = fb;
        this.notificationService = notificationService;
        this.organization = new organization_1.Organization();
        //  this.getOrganizationAccount();
        this.getOrganizationFromServer(0);
    }
    AdminProfileComponent.prototype.ngOnInit = function () {
        this.createAccountForm();
    };
    AdminProfileComponent.prototype.createAccountForm = function () {
        this.accountForm = this.fb.group({
            'firstName': [null],
            'userId': [null],
            'lastName': [null],
            'userName': [null],
            'userEmail': [null, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$')])],
            'cellPhone': [null],
            'userAddress': [null],
            'formName': ['ACCOUNT'],
            'homePhone': [null],
        });
    };
    AdminProfileComponent.prototype.saveAccount = function (data) {
        var self = this;
        if (this.accountForm.valid) {
            //account url can be change
            this.requestService.putRequest(app_constants_1.AppConstants.UPDATE_ORGANIZATION_URL + this.id, data)
                .subscribe(function (response) {
                if (response['responseCode'] === 'ORG_SUC_03') {
                    self.notificationService.success('Organization has been Update Successfully');
                }
            }, function (error) {
                self.notificationService.error('ERROR', 'Organization is not Updated');
            });
        }
        else {
            this.validateAllFormFields(this.accountForm);
        }
    };
    AdminProfileComponent.prototype.getOrganizationAccount = function () {
        var _this = this;
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ORG_ACCOUNT_URL)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_04') {
                _this.organization = response['responseData'];
            }
        }, function (error) {
        });
    };
    AdminProfileComponent.prototype.validateAllFormFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            //console.log(field);
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFormFields(control);
            }
        });
    };
    AdminProfileComponent.prototype.getOrganizationFromServer = function (page) {
        var _this = this;
        if (page > 0) {
            page = page;
        }
        this.requestService.getRequest(app_constants_1.AppConstants.FETCH_ALL_ORGANIZATION_URL_PAGINATED + page)
            .subscribe(function (response) {
            if (response['responseCode'] === 'ORG_SUC_02') {
                _this.data = response['responseData']['data'];
                _this.id = _this.data[0].id;
                _this.getOrganizationAccount();
            }
        }, function (error) {
        });
    };
    AdminProfileComponent = __decorate([
        core_1.Component({
            selector: 'icd-code-component',
            templateUrl: '../../../templates/dashboard/setting/admin-profile.template.html',
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, router_1.Router, requests_service_1.RequestsService, forms_1.FormBuilder, notification_service_1.NotificationService])
    ], AdminProfileComponent);
    return AdminProfileComponent;
}());
exports.AdminProfileComponent = AdminProfileComponent;
//# sourceMappingURL=admin-profile.component.js.map