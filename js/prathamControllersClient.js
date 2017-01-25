app.controller("home", function($scope, $http) {
    $scope.title = "Pratham - Pre Login";
    $scope.clientCss = "prathamClient";
});
app.controller("firmRegister", function($scope, $http, $state, $cookieStore) {
    $scope.registerFirm = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Comp/SaveComp",
                ContentType: 'application/json',
                data: {
                    "comp_address": formObj.firmAddress,
                    "comp_appurl": formObj.firmAppURL,
                    "comp_branchid": parseInt(formObj.firmBranch),
                    "comp_emailid": formObj.firmEmailId,
                    "comp_landline": formObj.firmLandline,
                    "comp_logopath": formObj.firmLogo,
                    "comp_mobile": formObj.firmMobile,
                    "comp_name": formObj.firmName,
                    "comp_pan": formObj.firmPAN,
                    "comp_servicetax": formObj.firmServiceTaxNumber,
                    "comp_tin": formObj.firmTIN,
                    "comp_type": formObj.firmType,
                    "comp_vat": formObj.firmVATDetails,
                    "comp_websiteurl": formObj.firmWebsiteURL
                }
            }).success(function(data) {
                //console.log(data);
                alert("Your Company Data Saved");
                $cookieStore.put('comp_guid', data.comp_guid);
                $state.go('/AdminCreation');
            }).error(function() {});
        }
    }
});
app.controller("adminCreation", function($scope, $http, $state, $cookieStore) {
    $scope.createAdminUser = function(formObj, formName) {
        alert($cookieStore.get('comp_guid'));
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_type": 1,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_first_name": formObj.adminFirstName,
                    "user_middle_name": formObj.adminMiddleName,
                    "user_last_name": formObj.adminLastName,
                    "user_mobile_no": formObj.adminMobileNo,
                    "user_email_address": formObj.adminEmailId,
                    "user_password": formObj.password
                }
            }).success(function(data) {
                //console.log(data);
                alert("Admin User Created");
                $state.go('/Login');
            }).error(function() {});
        }
    };
});
app.controller("login", function($scope, $http, $cookieStore, $window) {
    $scope.login = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UserLogin",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": "d0cb84c5-6b52-4dff-beb5-50b2f4af5398",
                    "user_email_address": formObj.emailId,
                    "user_password": formObj.password
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id == 0) {
                    alert("User Does Not Exist!");
                } else {
                    $cookieStore.put('comp_guid', 'd0cb84c5-6b52-4dff-beb5-50b2f4af5398');
                    $cookieStore.put('user_id', data.user_id);
                    $window.location.href = '/home.html';
                }
                angular.element(".loader").hide();
            }).error(function() {});
        }
    };

    $scope.enterLogin = function(keyEvent, formObj, formName) {
        if (keyEvent.which === 13) {
            $scope.login(formObj, formName);
        }
    };
});
/* After Login*/
app.controller("mainCtrl", function($scope, $http, $cookieStore, $state, $window) {
    $scope.title = "Pratham :: Home";
    $scope.clientCss = "prathamClient";
    ($scope.checkLogin = function() {
        var userId = $cookieStore.get('user_id');
        var compGuid = $cookieStore.get('comp_guid');
        if (userId == undefined || compGuid == undefined) {
            $window.location.href = '/';
        }
    })();
    $scope.logout = function() {
        $cookieStore.remove('user_id');
        $cookieStore.remove('comp_guid');
        $window.location.href = '/';
    };
});

app.controller("dashboard", function($scope, $http, $cookieStore) {
    $scope.title = "Pratham :: Home";
});

app.controller("leads", function($scope, $http, $cookieStore, $uibModal, $state) {
    $scope.searchLead = ''; // set the default search/filter term
    ($scope.getLeads = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 3
            }
        }).success(function(data) {
            //console.log(data);
            angular.element(".loader").hide();
            $scope.leads = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.leadDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'leadDetail.html',
            controller: 'leadDetail',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.leads[selectedItem];
                }
            }
        });
    };

    $scope.viewLeadStatus = function(leadNo) {
        alert("View Lead Status: " + leadNo);
    };
});
app.controller("leadDetail", function($scope, $uibModalInstance, $state, item) {
    $scope.states = ["Delhi"];
    $scope.cities = ["New Delhi"];
    $scope.lead = item;
    if ($scope.lead.userprojlist != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.lead.userprojlist.length; i++) { 
            $scope.leadUnitObj = $scope.lead.userprojlist[i];
            $scope.leadProjects.push($scope.leadUnitObj);
            /*for (j = 0; j < $scope.lead.projectlst[i].Lstphases.length; j++) {
                for (k = 0; k < $scope.lead.projectlst[i].Lstphases[j].LstofBlocks.length; k++) {
                    for (l = 0; l < $scope.lead.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls.length; l++) {
                        $scope.leadUnitObj = {};
                        $scope.leadUnitObj.projName = $scope.lead.projectlst[i].Proj_Name;
                        $scope.leadUnitObj.phaseName = $scope.lead.projectlst[i].Lstphases[j].Phase_Name;
                        $scope.leadUnitObj.phaseType = $scope.lead.projectlst[i].Lstphases[j].Phase_UnitType.UnitType_Name;
                        $scope.leadUnitObj.blockName = $scope.lead.projectlst[i].Lstphases[j].LstofBlocks[k].Blocks_Name;
                        $scope.leadUnitObj.unitObj = $scope.lead.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls[l];
                        $scope.leadProjects.push($scope.leadUnitObj);
                    }
                }
            }*/
        }
        //console.log($scope.leadProjects);
    }
    $scope.ok = function() {
        $uibModalInstance.close();
    };
    $scope.deleteRow = function(rowId) {
        angular.element("tr#" + rowId).remove();
    };
    $scope.addLeadProjects = function(leadId) {
        $uibModalInstance.close();
        $state.go("/ProjectDetails", {
            "leadID": leadId
        });
    };


});

app.controller("addLead", function($scope, $http, $state, $cookieStore) {
    $scope.pageTitle = "Add Lead";
    $scope.addLeadBtn = true;
    $scope.addLead = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_type": 3,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": formObj.dob,
                    "user_gender": parseInt(formObj.gender),
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id != 0) {
                    //$cookieStore.put('lead_id', data.user_id);
                    $state.go("/ProjectDetails", {
                        "leadID": data.user_id
                    });
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});

app.controller("editLead", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Lead";
    $scope.editLeadBtn = true;
    ($scope.getLeadDetail = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            var state = data.user_state;
            var city = data.user_city;
            var dob = $filter('date')(data.user_dob, 'MMM dd, yyyy');

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }
            if (dob == "Jan 01, 0001") {
                dob = "";
            }
            if (data.user_id != 0) {
                $scope.addLead = {
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    mobileNumber: data.user_mobile_no,
                    emailId: data.user_email_address,
                    dob: dob,
                    gender: data.user_gender,
                    country: data.user_country,
                    state: state + "",
                    city: city + "",
                    address: data.user_address,
                    zip: data.user_zipcode
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.updateLead = function(formObj, formName) {
        //console.log(formObj);
        $scope.submit = true;
        if ($scope[formName].$valid) {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUser",
                ContentType: 'application/json',
                data: {
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_id": $scope.leadId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_office_no": formObj.officeNumber,
                    "user_email_address": formObj.emailId,
                    "user_country": formObj.country,
                    "user_city": formObj.city,
                    "user_state": formObj.state,
                    "user_address": formObj.address,
                    "user_zipcode": formObj.zip,
                    "user_dob": formObj.dob,
                    "user_gender": parseInt(formObj.gender),
                }
            }).success(function(data) {
                //console.log(data);
                if (data.user_id != 0) {
                    //$cookieStore.put('lead_id', data.user_id);
                    $state.go("/Leads");
                } else {
                    alert("Some Error!");
                }
            }).error(function() {});
        }
    };
});
app.controller("projectDetails", function($scope, $http, $state, $cookieStore, $compile, $stateParams, $window) {
    $scope.leadId = $stateParams.leadID;
    if ($scope.leadId == undefined) {
        $state.go('/AddLead');
    }
    ($scope.getLeadProjects = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
			//console.log(data);
            if (data.user_id != 0) {
                if (data.userprojlist != null) {
                    $scope.leadProjects = [];
                    for (i = 0; i < data.userprojlist.length; i++) {
                        $scope.leadUnitObj = data.userprojlist[i];
                        $scope.leadProjects.push($scope.leadUnitObj);
                        /*for (j = 0; j < data.projectlst[i].Lstphases.length; j++) {
                            for (k = 0; k < data.projectlst[i].Lstphases[j].LstofBlocks.length; k++) {
                                for (l = 0; l < data.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls.length; l++) {

                                    $scope.leadUnitObj = {};
                                    $scope.leadUnitObj.ProjId = data.projectlst[i].ProjId;
                                    $scope.leadUnitObj.Phase_Id = data.projectlst[i].Lstphases[j].Phase_Id;
                                    $scope.leadUnitObj.Blocks_Id = data.projectlst[i].Lstphases[j].LstofBlocks[k].Blocks_Id;
                                    $scope.leadUnitObj.UnitDtls = data.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls[l];
                                    $scope.leadProjects.push($scope.leadUnitObj);
                                }

                            }

                        }*/
                    }
                    //console.log(JSON.stringify($scope.leadProjects));
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.flatStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.flatStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];
    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhaseList = function(projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.perFloorUnits = [];
        $scope.units = [];
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Blocks_Phase_Id": phase
            }
        }).success(function(data) {
            console.log(data);
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnits = function(blocks) {
        $scope.units = [];
        $scope.perFloorUnits = [];
        if (blocks == "") {
            return;
        }
        for (i = 0; i < $scope.blockList.length; i++) {
            if ($scope.blockList[i].Blocks_Id == blocks) {
                $scope.blockFloors = $scope.blockList[i].Blocks_Floors;
                $scope.blockFloorUnits = $scope.blockList[i].Blocks_UnitPerfloor;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/UnitDtls/ByUnitDtlsBlocksId",
            ContentType: 'application/json',
            data: {
                "UnitDtls_Block_Id": blocks,
                "UnitDtls_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(JSON.stringify(data));
            $scope.selectedUnits = [];
            $(".dispNone").each(function(index) {
                var projObj = $(this).text();
                projObj = angular.fromJson(projObj);
                $scope.selectedUnits.push(projObj.UnitDtls_Id);
            });

            for (i = 0; i < data.length; i++) {
                for (j = 0; j < $scope.selectedUnits.length; j++) {
                    if (data[i].UnitDtls_Id == $scope.selectedUnits[j]) {
                        data[i].markUp = "selected";
                        break;
                    }
                }
            }
            var count = 0;
            for (k = 0; k < $scope.blockFloors; k++) {
                var floorUnits = [];
                for (l = 0; l < $scope.blockFloorUnits; l++) {
                    floorUnits.push(data[count]);
                    count++;
                }
                $scope.perFloorUnits.push(floorUnits);
            }
            $scope.units = data;
            angular.element(".loader").hide();

        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.markUnits = function() {
        alert($scope.selectedUnits);
    };
    $scope.selectUnit = function(unitId, projectDetails) {
        for (i = 0; i < $scope.units.length; i++) {
            if ($scope.units[i].UnitDtls_Id == unitId) {
                if ($scope.units[i].UnitDtls_Status == 1 || $scope.units[i].UnitDtls_Status == 2) {
                    if ($("#unit" + $scope.units[i].UnitDtls_Id).hasClass('selected')) {
                        $scope.deleteRow($scope.projectDetails.projectName, $scope.units[i].UnitDtls_Id);
                    } else {
                        var projObj = {};
                        projObj.ProjId = parseInt($scope.projectDetails.projectName);
                        projObj.Phase_Id = parseInt($scope.projectDetails.phase);
                        projObj.Blocks_Id = parseInt($scope.projectDetails.blocks);
                        projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                        projObj = JSON.stringify(projObj);
                        //console.log(projObj);

                        var projectRow = '<tr id="' + $scope.units[i].UnitDtls_Id + '"><td><div class="dispNone">' + projObj + '</div>' + $scope.units[i].UnitDtls_BRoom + 'BHK - ' + $scope.units[i].UnitDtls_No + ' - ' + $scope.units[i].UnitDtls_Floor + ' Floor</td><td>' + $scope.units[i].UnitDtls_Msrmnt + ' sq ft</td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow(' + projectDetails.projectName + ',' + $scope.units[i].UnitDtls_Id + ')"></span></td></tr>';
                        var projectRowComplied = $compile(projectRow)($scope);
                        angular.element(document.getElementById('projectList')).append(projectRowComplied);
                    }
                    $("#unit" + $scope.units[i].UnitDtls_Id).addClass('selected');
                } else {
                    alert($scope.flatStatusText[$scope.units[i].UnitDtls_Status - 1]);
                }
            }
        }
    };
    $scope.deleteRow = function(projId, rowId) {
        var deleteUser = $window.confirm('Are you sure you want to delete ?');

        if (deleteUser) {
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/ProjUnitDel",
                ContentType: 'application/json',
                data: [{
                        "comp_guid": $cookieStore.get('comp_guid'),
                        "ProjDtl_Id":projId
                      }]
            }).success(function(data) {
                if (data.Comm_ErrorDesc == '0|0') {
                    $("tr#" + rowId).remove();
                    $("#unit" + rowId).removeClass('selected');
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    $scope.saveLead = function(projectObj) {
        var projJson = [];
        $(".dispNone").each(function(index) {
            //console.log(index + ": " + $(this).text());
            var projObj = $(this).text();
            projObj = angular.fromJson(projObj);
            projObj.comp_guid = $cookieStore.get('comp_guid');
            projObj.Projusrid = $scope.leadId;
            projObj.ProjDtl_Status = 2;
            projJson.push(projObj);
        });
        //console.log(projJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitSave",
            ContentType: 'application/json',
            data: projJson
        }).success(function(data) {
            angular.element(".loader").hide();
            if (data.Comm_ErrorDesc == '0|0') {
                $cookieStore.remove('lead_id');
                $state.go('/Leads');
                angular.element(".loader").hide();
            } else{
                alert('Something went wrong.');
            }
            //console.log(JSON.stringify(data));
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
});
app.controller("convertCustomer", function($scope, $http, $compile, $cookieStore, $stateParams, $filter, $state) {
    ($scope.convertCustomer = function() {
        angular.element(".loader").show();
        $scope.leadId = $stateParams.leadID;
        $scope.action = $stateParams.action;
        
        //alert($scope.leadId+' : '+$scope.action);
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            var state = data.user_state;
            var city = data.user_city;
            var dob = $filter('date')(data.user_dob, 'MMM dd, yyyy');

            if (state == 0) {
                state = "";
            }
            if (city == 0) {
                city = "";
            }
            if (dob == "Jan 01, 0001") {
                dob = "";
            }

            if (data.user_id != 0) {
                if($scope.action == 'addCustomer'){
                    $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dob,
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0
                    }
                } else if($scope.action == 'editCustomer'){
                    $scope.customer = {
                        firstName: data.user_first_name,
                        middleName: data.user_middle_name,
                        lastName: data.user_last_name,
                        mobileNumber: data.user_mobile_no,
                        officeNumber: data.user_office_no,
                        emailId: data.user_email_address,
                        dob: dob,
                        gender: data.user_gender,
                        country: data.user_country,
                        state: state + "",
                        city: city + "",
                        address: data.user_address,
                        zip: data.user_zipcode,
                        gpaHolder: 0,
                        bankloan: 0,
                        relationType: data.Cust_relationtype+"",
                        relationName: data.Cust_relationname,
                        residentType: data.Cust_status_type+"",
                        address2: data.Cust_perm_add,
                        pan: data.Cust_pan,
                        aadhar: data.Cust_aadhar,
                        alternateContact: data.Cust_alt_contactno,
                        qualification: data.Cust_qualification,
                        profession: data.Cust_Profession,
                        company: data.Cust_company,
                        designation: data.Cust_desig,
                        officeAddress: data.Cust_off_add,
                        officeEmailId: data.Cust_off_email,
                        spouseName : data.Cust_spouse_nm,
                        spouseDob : data.Cust_spouse_dob,
                        spousePan : data.Cust_spouse_pan,
                        spouseAadhar: data.Cust_spouse_aadhar,
                        childrenNo : data.Cust_noof_childrn+"",
                        bankloan : data.Cust_bankloan

                    }
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Customers");
            }
        }).error(function() {});
    })();
    
    $scope.updateCustomer = function(formObj, formName) {
    }

    $scope.addCustomer = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            angular.element(".loader").show();

            var relationType = 0;
            var statusType = 0;
            var noOfChildren = 0;
            var gpaRelation = 0;

            if (formObj.relationType != undefined && formObj.relationType != '') {
                relationType = formObj.relationType;
            }

            if (formObj.gpaRelation != undefined && formObj.gpaRelation != '') {
                gpaRelation = formObj.gpaRelation;
            }

            if (formObj.residentType != undefined && formObj.residentType != '') {
                statusType = formObj.residentType;
            }

            if (formObj.childrenNo != undefined && formObj.childrenNo != '') {
                noOfChildren = formObj.childrenNo;
            }

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Cust/SaveCust",
                ContentType: 'application/json',
                data: {
                    "user_id": $scope.leadId,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "Cust_User_Id_Assgnto": 1,
                    "Cust_relationtype": relationType,
                    "Cust_relationname": formObj.relationName,
                    "Cust_status_type": statusType,
                    "Cust_perm_add": formObj.address2,
                    "Cust_status_other": "Cust_status_other",
                    "Cust_pan": formObj.pan,
                    "Cust_aadhar": formObj.aadhar,
                    "Cust_alt_contactno": formObj.alternateContact,
                    "Cust_qualification": formObj.qualification,
                    "Cust_Profession": formObj.profession,
                    "Cust_company": formObj.company,
                    "Cust_desig": formObj.designation,
                    "Cust_off_add": formObj.officeAddress,
                    "Cust_off_email": formObj.officeEmailId,
                    "Cust_spouse_nm": formObj.spouseName,
                    "Cust_spouse_dob": formObj.spouseDob,
                    "Cust_spouse_pan": formObj.spousePan,
                    "Cust_spouse_aadhar": formObj.spouseAadhar,
                    "Cust_noof_childrn": noOfChildren,
                    "Cust_child1_nm": formObj.child1Name,
                    "Cust_child1_dob": formObj.child1Dob,
                    "Cust_child2_nm": formObj.child2Name,
                    "Cust_child2_dob": formObj.child2Dob,
                    "Cust_child3_nm": formObj.child3Name,
                    "Cust_child3_dob": formObj.child3Dob,
                    "Cust_child4_nm": formObj.child4Name,
                    "Cust_child4_dob": formObj.child4Dob,
                    "Cust_wedanv": formObj.weddingAnniversary,
                    "Cust_bankloan": formObj.bankloan,
                    "Cust_banknm": formObj.bankName,
                    "Cust_bankaccno": formObj.accountNumber,
                    "Cust_bankadd": formObj.bankAdress,
                    "Cust_bankifsccode": formObj.ifscCode,
                    "Cust_bankemailid": formObj.bankEmailId,
                    "Cust_gpaholdr": formObj.gpaHolder,
                    "Cust_gpa_nm": formObj.gpaName,
                    "Cust_gpa_relationtype": gpaRelation,
                    "Cust_gpa_dob": formObj.gpaDob,
                    "Cust_gpa_add": formObj.gpaAddress,
                    "Cust_gpa_permadd": formObj.permanentAddress,
                    "Cust_gpa_reltnwithcusty": formObj.relationWithcustomer,
                    "Cust_gpa_pan": formObj.gpaPan,
                    "Cust_gpa_aadhar": formObj.gpaAadhar
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/Customers");
                angular.element(".loader").hide();
            }).error(function() {
                alert("Error in save customer");
                angular.element(".loader").hide();
            });
        }
    };
    $scope.appendFields = function() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B. (YYYY-DD-MM)" title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };
});
app.controller("addAgentController", function($scope, $http, $cookieStore, $state) {
    $scope.pageTitle = "Add Agent";
    $scope.addAgentBtn = true;
    $scope.addAgent = function(formObj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            console.log(formObj);

            angular.element(".loader").show();

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/SaveUser",
                ContentType: 'application/json',
                data: {
                    "user_type": formObj.type,
                    "user_comp_guid": $cookieStore.get('comp_guid'),
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "user_password": formObj.password,
                    "Agent_assgnto_user_Id": 1,
                    "Agent_Branch_Id": 1,
                    "Agents_Indvdl": 1,
                    "Agents_firmname": formObj.firmName,
                    "Agents_firmtype": "Agents_firmtype",
                    "Agents_add": formObj.address,
                    "Agent_ctc": formObj.totCtc,
                    "Agents_pan": formObj.pan,
                    "Agents_aadhar": formObj.aadhar,
                    "Agents_alt_contactno": formObj.alternateContactNumber,
                    "Agents_alt_email": formObj.alternameEmailId,
                    "Agents_contactperson": formObj.contactPerson,
                    "Agents_servicetaxdtls": formObj.serviceTaxDetails,
                    "Agents_noofyrsinbsns": formObj.yearsInBusiness,
                    "Agents_totalyrsofexp": formObj.totalYearOfExp,
                    "Agents_banknm": formObj.bankName,
                    "Agents_bankacno": formObj.accountNumber,
                    "Agents_bankadd": formObj.bankAddress,
                    "Agents_banktypeofacn": formObj.accountType,
                    "Agents_bankifsccode": formObj.ifscCode,
                    "Agents_bankemailid": formObj.bankEmailID
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid!");
        }
    };
});

app.controller("agentsController", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.searchAgents = ''; // set the default search/filter term
    ($scope.getAgents = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_type": 5,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $scope.agents = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.agentDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'agentDetail.html',
            controller: 'agentsDetailController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.agents[selectedItem];
                }
            }
        });
    };
});

app.controller("agentsDetailController", function($scope, $http, $cookieStore, $uibModalInstance, item) {
    $scope.agentDetail = item;
    $scope.ok = function() {
        $uibModalInstance.close();
    };
});

app.controller("editAgentController", function($scope, $http, $state, $cookieStore, $stateParams, $filter) {
    $scope.pageTitle = "Edit Agent";
    $scope.editAgentBtn = true;

    ($scope.getAgentDetail = function() {
        $scope.agentId = $stateParams.agentID;

        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.agentId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            console.log(data);

            /*var dob = $filter('date')(data.user_dob, 'MMM dd, yyyy');

            if (dob == "Jan 01, 0001") {
                dob = "";
            }*/
            if (data.Agents_User_Id != 0) {
                $scope.addAgent = {
                    type: data.user_type + "",
                    firstName: data.user_first_name,
                    middleName: data.user_middle_name,
                    lastName: data.user_last_name,
                    firmName: data.Agents_firmname,
                    emailId: data.user_email_address,
                    address: data.Agents_add,
                    mobileNumber: data.user_mobile_no,
                    password: data.user_password,
                    //                    dob: dob,
                    pan: data.Agents_pan,
                    aadhar: data.Agents_aadhar,
                    alternateContactNumber: data.Agents_alt_contactno,
                    alternameEmailId: data.Agents_alt_email,
                    contactPerson: data.Agents_contactperson,
                    serviceTaxDetails: data.Agents_servicetaxdtls,
                    yearsInBusiness: data.Agents_noofyrsinbsns,
                    totalYearOfExp: data.Agents_totalyrsofexp,
                    totCtc: data.Agent_ctc,
                    bankName: data.Agents_banknm,
                    accountNumber: data.Agents_bankacno,
                    bankAddress: data.Agents_bankadd,
                    accountType: data.Agents_banktypeofacn,
                    ifscCode: data.Agents_bankifsccode,
                    bankEmailID: data.Agents_bankemailid
                }
            } else {
                $state.go("/Agents");
            }
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.updateAgent = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            angular.element(".loader").show();

            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/UpdateUserAgent",
                ContentType: 'application/json',
                data: {
                    "Agents_comp_guid": $cookieStore.get('comp_guid'),
                    "Agents_User_Id": $scope.agentId,
                    "user_first_name": formObj.firstName,
                    "user_middle_name": formObj.middleName,
                    "user_last_name": formObj.lastName,
                    "user_mobile_no": formObj.mobileNumber,
                    "user_email_address": formObj.emailId,
                    "Agent_assgnto_user_Id": 1,
                    "Agent_Branch_Id": 1,
                    "Agents_Indvdl": 1,
                    "Agents_firmname": formObj.firmName,
                    "Agents_firmtype": "Agents_firmtype",
                    "Agents_add": formObj.address,
                    "Agent_ctc": formObj.totCtc,
                    "Agents_pan": formObj.pan,
                    "Agents_aadhar": formObj.aadhar,
                    "Agents_alt_contactno": formObj.alternateContactNumber,
                    "Agents_alt_email": formObj.alternameEmailId,
                    "Agents_contactperson": formObj.contactPerson,
                    "Agents_servicetaxdtls": formObj.serviceTaxDetails,
                    "Agents_noofyrsinbsns": formObj.yearsInBusiness,
                    "Agents_totalyrsofexp": formObj.totalYearOfExp,
                    "Agents_banknm": formObj.bankName,
                    "Agents_bankacno": formObj.accountNumber,
                    "Agents_bankadd": formObj.bankAddress,
                    "Agents_banktypeofacn": formObj.accountType,
                    "Agents_bankifsccode": formObj.ifscCode,
                    "Agents_bankemailid": formObj.bankEmailID
                }
            }).success(function(data) {
                console.log(data);
                $state.go("/Agents");
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid!");
        }
    };
});

app.controller("unitAllocation", function($scope, $http, $cookieStore, $state, $uibModal) {
    $scope.unitStatus = ['vacant', 'userinterest', 'mgmtquota', 'blockedbyadvnc', 'blockedbynotadvnc', 'sold'];
    $scope.unitStatusText = ['Vacant', 'User Interested', 'Management Quota', 'Blocked By Paying Advance', 'Blocked By Not Paying Advance', 'Sold'];
    
    ($scope.getProjectList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.getPhaseList = function(projectName) {
        $scope.flatType = "";
        $scope.projectDetails.phase = "";
        $scope.projectDetails.blocks = "";
        $scope.blockList = {};
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/PhaseDtls/ByPhaseProjId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Phase_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.phaseList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getBlockList = function(phase, projectName) {
        $scope.projectDetails.blocks = "";
        for (i = 0; i < $scope.phaseList.length; i++) {
            if ($scope.phaseList[i].Phase_Id == phase) {
                $scope.flatType = $scope.phaseList[i].Phase_UnitType.UnitType_Name;
            }
        }
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/BlockDtls/ByPhaseBlocksId",
            ContentType: 'application/json',
            data: {
                "Phase_Proj_Id": projectName,
                "Blocks_Phase_Id": phase
            }
        }).success(function(data) {
            $scope.blockList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    $scope.getUnitAllocation = function(obj, formName) {
        $scope.submit = true;
        if ($scope[formName].$valid) {
            var userProjData = [];
            if (obj.blocks != "") {
                userProjData.push({
                    "Blocks_Id": obj.blocks
                });
            } else {
                userProjData.push({
                    "Phase_Id": obj.phase
                });
            }
            
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/User/AllocByUserType",
                ContentType: 'application/json',
                data: {
                        "comp_guid" : $cookieStore.get('comp_guid'),
                        "Projusrtyp":3,
                        "Phase_Id":obj.phase,
                        "Blocks_Id":obj.blocks
                      }
            }).success(function(data) {
                console.log(data);
                console.log(obj.projectName.value);
                $scope.unitAllocationData = [];
                for (h = 0; h < data.length; h++) {
                    for (i = 0; i < data[h].userprojlist.length; i++) {
                        $scope.unitAllocationObj = {};
                        
                        $scope.unitAllocationObj.name = data[h].user_first_name + ' ' + data[h].user_middle_name + ' ' + data[h].user_last_name;
                        $scope.unitAllocationObj.email = data[h].user_email_address;
                        $scope.unitAllocationObj.mobile = data[h].user_mobile_no;
                        /*$scope.unitAllocationObj.projName = data[h].userprojlist[i].Proj_Name;
                        $scope.unitAllocationObj.phaseName = data[h].userprojlist[i].Phase_Name;
                        $scope.unitAllocationObj.phaseType = 'Temp Phase Type';
                        $scope.unitAllocationObj.blockName = data[h].userprojlist[i].Blocks_Name;*/
                        $scope.unitAllocationObj.unitObj = data[h].userprojlist[i];
                        $scope.unitAllocationObj.leadID = data[h].user_id;
                        
                        $scope.unitAllocationData.push($scope.unitAllocationObj);
                    }
                    /*for (i = 0; i < data[h].projectlst.length; i++) {
                        for (j = 0; j < data[h].projectlst[i].Lstphases.length; j++) {
                            for (k = 0; k < data[h].projectlst[i].Lstphases[j].LstofBlocks.length; k++) {
                                for (l = 0; l < data[h].projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls.length; l++) {

                                    $scope.unitAllocationObj = {};

                                    $scope.unitAllocationObj.name = data[h].user_first_name + ' ' + data[h].user_middle_name + ' ' + data[h].user_last_name;
                                    $scope.unitAllocationObj.email = data[h].user_email_address;
                                    $scope.unitAllocationObj.mobile = data[h].user_mobile_no;
                                    $scope.unitAllocationObj.projName = data[h].projectlst[i].Proj_Name;
                                    $scope.unitAllocationObj.phaseName = data[h].projectlst[i].Lstphases[j].Phase_Name;
                                    $scope.unitAllocationObj.phaseType = data[h].projectlst[i].Lstphases[j].Phase_UnitType.UnitType_Name;
                                    $scope.unitAllocationObj.blockName = data[h].projectlst[i].Lstphases[j].LstofBlocks[k].Blocks_Name;
                                    $scope.unitAllocationObj.unitObj = data[h].projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls[l];
                                    $scope.unitAllocationObj.leadID = data[h].user_id;

                                    $scope.unitAllocationData.push($scope.unitAllocationObj);
                                }

                            }

                        }
                    }*/
                }
                angular.element(".loader").hide();
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    }

    $scope.updateUnitAllocationStatus = function(unitData) {
        var modalInstance = $uibModal.open({
            templateUrl: 'unitStatusUpdate.html',
            controller: 'unitUpdateController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return unitData;
                }
            }
        });
    };
});

app.controller("unitUpdateController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.unit = item;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.updateStatus = function(formObj) {
        if (formObj.updateStatus != undefined && formObj.updateStatus != '') {
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/UpdtUnitDtls/ByUnitDtlsID",
                ContentType: 'application/json',
                data: {
                    "UnitDtls_comp_guid": $cookieStore.get('comp_guid'),
                    "UnitDtls_Id": $scope.unit.unitObj.UnitDtls_Id,
                    "UnitDtls_Status": formObj.updateStatus,
                    "UnitDtls_user_id": formObj.leadID
                }
            }).success(function(data) {
                console.log(data);
                $uibModalInstance.close();
                if (data[0].UnitDtls_ErrorDesc == '0') {
                    $uibModalInstance.close();
                    $state.go("/ConvertCustomer", {
                        "leadID": $scope.unit.leadID,
                        "action": 'addCustomer'
                    });
                } else {
                    alert('some error in changing unit status.');
                }
            }).error(function() {
                alert('some error!!');
            });
        } else {
            alert('Please select any option first.');
        }
    };
});

app.controller("projects", function($scope, $http, $cookieStore, $state) {
    
    ($scope.getProjectsList = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Proj/View",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid'),
                "ProjId":0
            }
        }).success(function(data) {
            for(var i = 0; i < data.length; i++){
                if(data[i].Proj_Types.length > 1){
                    var types = data[i].Proj_Types.split('#');
                    var typeValue = '';
                    for(var j = 0; j < types.length; j++){
                        if(!(j == types.length-1))
                            typeValue = typeValue+' , '+getTypeNameById(types[j]);
                        else
                            typeValue = typeValue+' & '+getTypeNameById(types[j]);
                    }
                    data[i].Proj_Types = typeValue.substring(2, typeValue.length);
                }
                else{
                    data[i].Proj_Types = getTypeNameById(data[i].Proj_Types);
                }       
            }
            $scope.projectsList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    function getTypeNameById(typeId){
        var typeName = '';
        switch(parseInt(typeId)) {
            case 1: typeName = 'Flat';
                    break;
            case 2: typeName = 'Sites';
                    break;
            case 3: typeName = 'Villa';
                    break;
            case 4: typeName = 'Row Houses';
                    break;
            default: console.log('eror');
        }
        return typeName;
    }
});

app.controller("addProject", function($scope, $http, $cookieStore, $state) {
    $scope.pageTitle = "Add Project";
    $scope.addProjectBtn = true;
    $scope.saveProject = function(formObj, formName) {
        $scope.submit = true;                
        if ($scope[formName].$valid) {
            var projType = '';
       
            if(formObj.type1 == true)
                projType = '1';
            if(formObj.type2 == true)
                projType = projType+'2';
            if(formObj.type3 == true)
                projType = projType+'3';
            if(formObj.type4 == true)
                projType = projType+'4';
       
            var projTypes = projType.split('');
            projType = '';
            for(var i = 0; i < projTypes.length; i++){
                if(i != 0)
                    projType = projType+'#'+projTypes[i];
                else
                    projType = projTypes[i];
            }
    
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/Save",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId":0,
                    "Proj_Code":formObj.projCode,
                    "Proj_Name": formObj.projectName,
                    "Proj_Location": formObj.location,
                    "Proj_Surveyno":formObj.surveyNos,
                    "Proj_Phases":formObj.phases,
                    "Proj_Types":projType
                }
            }).success(function(data) {
//                console.log(data);
                angular.element(".loader").hide();
                $state.go('/Projects');
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    function getTypeIdByName(typeName){
        var typeId = '';
        switch(typeName) {
            case 'Flat':        typeId = 1;
                                break;
            case 'Sites':       typeId = 2;
                                break;
            case 'Villa':       typeId = 3;
                                break;
            case 'Row Houses':  typeId = 4;
                                break;
            default:            console.log('eror');
        }
        return typeId;
    }    
});

app.controller("editProject", function($scope, $http, $cookieStore, $state, $stateParams) {
    $scope.pageTitle = "Edit Project";
    $scope.editProjectBtn = true;
    
    ($scope.getProjectList = function() {
        $scope.projId = $stateParams.projId;
        $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/View",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId":$scope.projId
                }
            }).success(function(data) {
                angular.element(".loader").hide();
                var projTypes = data[0].Proj_Types;
                $scope.addProject = {
                    location: data[0].Proj_Location,
                    projectName: data[0].Proj_Name,
                    phases: data[0].Proj_Phases,
                    surveyNos: data[0].Proj_Surveyno,
                    projCode: data[0].Proj_Code,
                    type1: projTypes.indexOf("1") != -1,
                    type2: projTypes.indexOf("2") != -1,
                    type3: projTypes.indexOf("3") != -1,
                    type4: projTypes.indexOf("4") != -1
                };
            }).error(function() {
                angular.element(".loader").hide();
            });
    })();
    
    function getTypeNameById(typeId){
        var typeName = '';
        switch(parseInt(typeId)) {
            case 1: typeName = 'Flat';
                    break;
            case 2: typeName = 'Sites';
                    break;
            case 3: typeName = 'Villa';
                    break;
            case 4: typeName = 'Row Houses';
                    break;
            default: console.log('eror');
        }
        return typeName;
    }
    
    $scope.editProject = function(formObj, formName) {
        $scope.submit = true;                
        if ($scope[formName].$valid) {
            var projType = '';
       
            if(formObj.type1 == true)
                projType = '1';
            if(formObj.type2 == true)
                projType = projType+'2';
            if(formObj.type3 == true)
                projType = projType+'3';
            if(formObj.type4 == true)
                projType = projType+'4';
       
            var projTypes = projType.split('');
            projType = '';
            for(var i = 0; i < projTypes.length; i++){
                if(i != 0)
                    projType = projType+'#'+projTypes[i];
                else
                    projType = projTypes[i];
            }
    
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Proj/Save",
                ContentType: 'application/json',
                data: {
                    "Proj_comp_guid": $cookieStore.get('comp_guid'),
                    "ProjId":$scope.projId,
                    "Proj_Code":formObj.projCode,
                    "Proj_Name": formObj.projectName,
                    "Proj_Location": formObj.location,
                    "Proj_Surveyno":formObj.surveyNos,
                    "Proj_Phases":formObj.phases,
                    "Proj_Types":projType
                }
            }).success(function(data) {
//                console.log(data);
                angular.element(".loader").hide();
                $state.go('/Projects');
            }).error(function() {
                angular.element(".loader").hide();
            });
        }
    };
    
    function getTypeIdByName(typeName){
        var typeId = '';
        switch(typeName) {
            case 'Flat':        typeId = 1;
                                break;
            case 'Sites':       typeId = 2;
                                break;
            case 'Villa':       typeId = 3;
                                break;
            case 'Row Houses':  typeId = 4;
                                break;
            default:            console.log('eror');
        }
        return typeId;
    }  
});

app.controller("editPhases", function($scope, $http, $cookieStore, $state, $compile, $stateParams) {
    $scope.pageTitle = "Edit Phase";
    $scope.editPhaseBtn = true;
    
    ($scope.getPhaseInfo = function() {
        
        angular.element(".loader").show();
         $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            $scope.projectDetails = {
                projectName: $stateParams.projId
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
        
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": $stateParams.projId,
                "Phase_Id": $stateParams.phaseId
            }
        }).success(function(data) {
            //console.log(data);
            editAppendFields(data);
            var phaseList = [];
            
            for(var i = 0; i < data[0].LstofBlocks.length; i++){
                phaseList.push(data[0].LstofBlocks[i].Blocks_Name);
            }
            
            $scope.projectDetails = {
                phaseName: data[0].Phase_Name,
                location: data[0].Phase_Location,
                surveyNos: data[0].Phase_Surveynos,
                unitOfMeasurement: data[0].Phase_UnitMsmnt.UnitMsmnt_Id+"",
                phaseType: data[0].Phase_UnitType.UnitType_Id,
                noOfBlocks: data[0].Phase_NoofBlocks,
                projectName: $stateParams.projId,
                blockName: phaseList
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    function editAppendFields(data) {
        angular.element("#noOfBlocks").html('');
        for (i = 1; i <= data[0].LstofBlocks.length; i++) {
            var childDiv = '<div id="block'+data[0].LstofBlocks[i-1].Blocks_Id+'"><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control" name="blockName[' + (i-1) + ']" ng-model="projectDetails.blockName[' + (i-1) + ']" />';
            if(!data[0].LstofBlocks[i-1].blnunitexists)
                childDiv = childDiv+'<span ng-click="deleteBlock('+data[0].Phase_Id + ',' + data[0].LstofBlocks[i-1].Blocks_Id+')" class="glyphicon glyphicon-trash delete"></span></div>';
            else
                childDiv = childDiv+"</div>";
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#noOfBlocks").append(childDivComplied);
        }
    };
    
    $scope.appendFields = function(noOfLocation) {
        angular.element("#noOfBlocks").html('');
        for (i = 1; i <= noOfLocation; i++) {
            var childDiv = '<div><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control" name="blockName[' + (i-1) + ']" ng-model="projectDetails.blockName[' + (i-1) + ']" /></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#noOfBlocks").append(childDivComplied);
        }
    };
    
    $scope.editPhase = function(formObj, formName) {
        alert("update phase");
        console.log(formObj);
    };
    
    $scope.deleteBlock = function(blockId, phaseId) {
        //alert(blockId+" delete block  "+phaseId);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/Block/Delete",
            ContentType: 'application/json',
            data: {
                "Blocks_comp_guid": $cookieStore.get('comp_guid'),
                "Blocks_Id": blockId,
                "Blocks_Phase_Id": phaseId
            }
        }).success(function(data) {
            $('#block'+phaseId).remove();
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
});

app.controller("addPhases", function($scope, $http, $cookieStore, $state, $compile, $stateParams) {
    $scope.pageTitle = "Add Phase";
    $scope.addPhaseBtn = true;
    
    ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            $scope.projectList = data;
            $scope.projectDetails = {
                phaseType: "1",
                unitOfMeasurement: "1",
                projectName: $stateParams.projId
            };
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.appendFields = function(noOfLocation) {
        angular.element("#noOfBlocks").html('');
        for (i = 1; i <= noOfLocation; i++) {
            var childDiv = '<div><input type="text" placeholder="Block  ' + i + ' Name" title="Block ' + i + ' Name" class="form-control" name="blockName[' + (i-1) + ']" ng-model="projectDetails.blockName[' + (i-1) + ']" /></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#noOfBlocks").append(childDivComplied);
        }
    };
    
     $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            var blockLst = [];
            
            for(var i = 0; i < formObj.noOfBlocks; i++){
                var tmp = {};
                tmp.Blocks_Name = formObj.blockName[i];
                tmp.Blocks_Id = 0; 
                blockLst.push(tmp);
            }
            
//            console.log(formObj);
            angular.element(".loader").show();
            $http({
                method: "POST",
                url: "http://120.138.8.150/pratham/Proj/Phase/Save",
                ContentType: 'application/json',
                data: {
                     "Phase_comp_guid": $cookieStore.get('comp_guid'),
                     "Phase_Id": 0,
                     "Phase_Proj_Id": formObj.projectName,
                     "Phase_Name": formObj.phaseName,
                     "Phase_Surveynos": formObj.surveyNos,
                     "Phase_UnitMsmnt": {"UnitMsmnt_Id": formObj.unitOfMeasurement},
                     "Phase_UnitType": {"UnitType_Id": formObj.phaseType},
                     "Phase_NoofBlocks": formObj.noOfBlocks,
                     "Phase_Location": formObj.location,
                     "LstofBlocks": blockLst
                }
            }).success(function(data) {
                console.log(data);
                $scope.addPhaseResult = data;
                angular.element(".loader").hide();
                if($scope.addPhaseResult.Comm_ErrorDesc.match('0|')){
                    $state.go("/Phases");
                } else {
                    alert("Something went wrong.");
                }
            }).error(function() {
                angular.element(".loader").hide();
            });
        } else {
            alert("Not valid Form.");
        }
     };
});

app.controller("phases", function($scope, $http, $cookieStore, $state, $compile) {
    $scope.typeNames = ['Flat','Sites','Villa','Row Houses'];
    
     ($scope.getProjectList = function() {
        $scope.perFloorUnits = [];
        $scope.units = [];
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/Proj/ProjDtls/ByCompGuid",
            ContentType: 'application/json',
            data: {
                "Proj_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
            //console.log(data);
            $scope.projectList = data;
            angular.element(".loader").hide();
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();
    
    $scope.getPhases = function(projId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham//Proj/Phase/View",
            ContentType: 'application/json',
            data: {
                "Phase_comp_guid": $cookieStore.get('comp_guid'),
                "Phase_Proj_Id": projId
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $scope.phaseList = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    };
    
    $scope.addPhase = function(formObj, formName) {
        $scope.submit = true;

        if ($scope[formName].$valid) {
            console.log(formObj);
            $state.go("/AddPhases", {
                "projId": formObj.projectName
            });
            /*$state.go("/AddPhases");
            $scope.projectDetails = {
                projectName : formObj.projectName
            };*/
        }
     };
});

app.controller("customerController", function($scope, $http, $cookieStore, $state, $uibModal) {
    ($scope.getCustomers = function() {
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls/ByUserType",
            ContentType: 'application/json',
            data: {
                "user_comp_guid": $cookieStore.get('comp_guid'),
                "user_type": 4
            }
        }).success(function(data) {
            console.log(data);
            angular.element(".loader").hide();
            $scope.customers = data;
        }).error(function() {
            angular.element(".loader").hide();
        });
    })();

    $scope.customerDetail = function(selectedItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'customerDetail.html',
            controller: 'customerDetailController',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                item: function() {
                    return $scope.customers[selectedItem];
                }
            }
        });
    };
});

app.controller("customerDetailController", function($scope, $http, $cookieStore, $state, $uibModalInstance, item) {
    $scope.customer = item;
    $scope.unitStatus = [];
    $scope.unitStatus[2] = "Interested";
    $scope.unitStatus[4] = "Blocked by paying advance";
    $scope.unitStatus[5] = "Blocked by not paying advance";
    $scope.unitStatus[6] = "Sold";
    $scope.unitStatus[7] = "Cancelled";
    
    $scope.leadId = $scope.customer.user_id;
    
    if ($scope.customer.userprojlist != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.customer.userprojlist.length; i++) {
            $scope.leadUnitObj = $scope.customer.userprojlist[i];
            $scope.leadUnitObj.unitViewStatus = "N/A";
            if($scope.customer.userprojlist[i].ProjDtl_Status != 0)
                $scope.leadUnitObj.unitViewStatus = $scope.unitStatus[$scope.customer.userprojlist[i].ProjDtl_Status];
                $scope.leadProjects.push($scope.leadUnitObj);
            
            /*for (j = 0; j < $scope.customer.projectlst[i].Lstphases.length; j++) {
                for (k = 0; k < $scope.customer.projectlst[i].Lstphases[j].LstofBlocks.length; k++) {
                    for (l = 0; l < $scope.customer.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls.length; l++) {
                        $scope.leadUnitObj = {};
                        $scope.leadUnitObj.projName = $scope.customer.projectlst[i].Proj_Name;
                        $scope.leadUnitObj.projId = $scope.customer.projectlst[i].ProjId;
                        $scope.leadUnitObj.phaseName = $scope.customer.projectlst[i].Lstphases[j].Phase_Name;
                        $scope.leadUnitObj.phaseType = $scope.customer.projectlst[i].Lstphases[j].Phase_UnitType.UnitType_Name;
                        $scope.leadUnitObj.blockName = $scope.customer.projectlst[i].Lstphases[j].LstofBlocks[k].Blocks_Name;
                        $scope.leadUnitObj.unitObj = $scope.customer.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls[l];
                        $scope.leadUnitObj.unitViewStatus = $scope.unitStatus[$scope.customer.projectlst[i].Lstphases[j].LstofBlocks[k].Lstofunitdtls[l].UnitDtls_Status];

                        $scope.leadProjects.push($scope.leadUnitObj);
                    }
                }
            }*/
        }
    }
    
    $scope.deleteRow = function(projId, rowId) {
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/ProjUnitDel",
            ContentType: 'application/json',
            data: [{
                    "comp_guid": $cookieStore.get('comp_guid'),
                    "ProjDtl_Id":projId
                  }]
        }).success(function(data) {
            if (data.Comm_ErrorDesc == '0|0') {
                $("tr#" + rowId).remove();
                $("#unit" + rowId).removeClass('selected');
            }
            angular.element(".loader").hide();
        }).error(function() {
            alert('Something went wrong.');
            angular.element(".loader").hide();
        });
    };

    $scope.ok = function() {
        $uibModalInstance.close();
    };
});