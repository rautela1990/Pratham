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
    if ($scope.lead.projectlst != null) {
        $scope.leadProjects = [];
        for (i = 0; i < $scope.lead.projectlst.length; i++) {
            for (j = 0; j < $scope.lead.projectlst[i].Lstphases.length; j++) {
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

            }

        }
        //console.log(JSON.stringify($scope.leadProjects));
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
app.controller("projectDetails", function($scope, $http, $state, $cookieStore, $compile, $stateParams) {
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
            //			//console.log(data);
            if (data.user_id != 0) {
                if (data.projectlst != null) {
                    $scope.leadProjects = [];
                    for (i = 0; i < data.projectlst.length; i++) {
                        for (j = 0; j < data.projectlst[i].Lstphases.length; j++) {
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

                        }

                    }
//                    console.log(JSON.stringify($scope.leadProjects));
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
		if(blocks == ""){
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
            console.log(JSON.stringify(data));
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
                        $("tr#" + $scope.units[i].UnitDtls_Id).remove();
                    } else {
                        var projObj = {};
                        projObj.ProjId = parseInt($scope.projectDetails.projectName);
                        projObj.Phase_Id = parseInt($scope.projectDetails.phase);
                        projObj.Blocks_Id = parseInt($scope.projectDetails.blocks);
                        projObj.UnitDtls_Id = $scope.units[i].UnitDtls_Id;
                        projObj = JSON.stringify(projObj);
                        //console.log(projObj);

                        var projectRow = '<tr id="' + $scope.units[i].UnitDtls_Id + '"><td><div class="dispNone">' + projObj + '</div>' + $scope.units[i].UnitDtls_BRoom + 'BHK - ' + $scope.units[i].UnitDtls_No + ' - ' + $scope.units[i].UnitDtls_Floor + ' Floor</td><td>' + $scope.units[i].UnitDtls_Msrmnt + ' sq ft</td><td><span class="glyphicon glyphicon-trash delete" ng-click="deleteRow(' + $scope.units[i].UnitDtls_Id + ')"></span></td></tr>';
                        var projectRowComplied = $compile(projectRow)($scope);
                        angular.element(document.getElementById('projectList')).append(projectRowComplied);
                    }
                    $("#unit" + $scope.units[i].UnitDtls_Id).toggleClass('selected');
                } else {
                    alert($scope.flatStatusText[$scope.units[i].UnitDtls_Status - 1]);
                }
            }
        }
    };
    $scope.deleteRow = function(rowId) {
        if(confirm("Are you sure you want to delete this project ?") == true){
            angular.element(".loader").show();
            $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/SaveUser",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_proj": {
                    "UserProj_comp_guid": $cookieStore.get('comp_guid'),
                    "UserProj_user_id": $scope.leadId,
                    "prjjson": [{"ProjId":rowId ,"Phase_Id":0,"Blocks_Id": 0, "UnitDtls_Id":0}]
                }
            }
            }).success(function(data) {
                angular.element(".loader").hide();
                $("tr#" + rowId).remove();
                $("#unit" + rowId).removeClass('selected');
                console.log(JSON.stringify(data));
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
            projJson.push(projObj);
        });
        //console.log(projJson);
        angular.element(".loader").show();
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/SaveUser",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_proj": {
                    "UserProj_comp_guid": $cookieStore.get('comp_guid'),
                    "UserProj_user_id": $scope.leadId,
                    "prjjson": projJson
                }
            }
        }).success(function(data) {
            if (data.user_id != null) {
                $cookieStore.remove('lead_id');
                $state.go('/Leads');
                angular.element(".loader").hide();
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
        $http({
            method: "POST",
            url: "http://120.138.8.150/pratham/User/UserDtls",
            ContentType: 'application/json',
            data: {
                "user_id": $scope.leadId,
                "user_comp_guid": $cookieStore.get('comp_guid')
            }
        }).success(function(data) {
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
                    zip: data.user_zipcode
                }
                angular.element(".loader").hide();
            } else {
                $state.go("/Leads");
            }
        }).error(function() {});
    })();

    $scope.addCustomer = function(formObj, formName) {
        $scope.submit = true;
        
        if ($scope[formName].$valid) {
            var relationType = 0;
            var statusType = 0;
            var noOfChildren = 0;
            var relationName = '';
            
            
            if(formObj.relationType != undefined && formObj.relationType != ''){
                relationType = formObj.relationType;
            }
            
            if(formObj.relationName != undefined && formObj.relationName != ''){
                relationName = formObj.relationName;
            }
            
            if(formObj.residentType != undefined && formObj.residentType != ''){
                statusType = formObj.residentType;
            }
            
            if(formObj.childrenNo != undefined && formObj.childrenNo != ''){
                noOfChildren = formObj.childrenNo;
            }
            
//            alert(relationType);
//            alert(statusType);
//            alert(noOfChildren);
            alert(formObj.spouseAadhar);
        }
        var formData = JSON.stringify(formObj);
//        console.log(formData);
//        console.log(Object.keys(formObj).length);
//        {
//          "user_id": $scope.leadId,
//          "user_comp_guid": $cookieStore.get('comp_guid'),
//          "Cust_User_Id_Assgnto": 1,
//          "Cust_relationtype": relationType,
//          "Cust_relationname": relationName,
//          "Cust_status_type": statusType,
//          "Cust_perm_add": formObj.address2,
//          "Cust_status_other": "Cust_status_other",
//          "Cust_pan": formObj.pan,
//          "Cust_aadhar": formObj.aadhar,
//          "Cust_alt_contactno": formObj.alternateContact,
//          "Cust_qualification": formObj.qualification,
//          "Cust_Profession": formObj.profession,
//          "Cust_company": formObj.company,
//          "Cust_desig": formObj.designation,
//          "Cust_off_add": formObj.officeAddress,
//          "Cust_off_email": formObj.officeEmailId,
//          "Cust_spouse_nm": formObj.spouseName,
//          "Cust_spouse_dob": formObj.spouseDob,
//          "Cust_spouse_pan": formObj.spousePan,
//          "Cust_spouse_aadhar": formObj.spouseAadhar,
//          "Cust_noof_childrn": 1,
//          "Cust_child1_nm": "Atul",
//          "Cust_child1_dob": "2012-12-12",
//          "Cust_child2_nm": "",
//          "Cust_child2_dob": "2012-12-12",
//          "Cust_child3_nm": "",
//          "Cust_child3_dob": "2012-12-12",
//          "Cust_child4_nm": "",
//          "Cust_child4_dob": "2012-12-12",
//          "Cust_wedanv": formObj.weddingAnniversary,
//          "Cust_bankloan": 1,
//          "Cust_banknm": "HDFC Bank",
//          "Cust_bankaccno": "464464644087",
//          "Cust_bankadd": "Test Bank Address",
//          "Cust_bankifsccode": "HDFC2351",
//          "Cust_bankemailid": "Cust_bankemailid",
//          "Cust_gpaholdr": 1,
//          "Cust_gpa_nm": "Cust_gpa_nm",
//          "Cust_gpa_relationtype": 1,
//          "Cust_gpa_dob": "1983-01-01",.       
//          "Cust_gpa_add": "Cust_gpa_add",
//          "Cust_gpa_permadd": "Cust_gpa_permadd",
//          "Cust_gpa_reltnwithcusty": "Cust_gpa_reltnwithcusty",
//          "Cust_gpa_pan": "Cust_gpa_pan",
//          "Cust_gpa_aadhar": "Cust_gpa_aadhar"
//        }
    };
   $scope.appendFields = function() {
        angular.element("#children").html('');
        for (i = 1; i <= $scope.customer.childrenNo; i++) {
            var childDiv = '<div><input type="text" placeholder="Child ' + i + ' Name" title="Child ' + i + ' Name" class="form-control" name="child' + i + 'Name" ng-model="customer.child' + i + 'Name" /></div><div><input type="text" placeholder="Child ' + i + ' D.O.B." title="Child ' + i + ' D.O.B." class="form-control" name="child' + i + 'Dob" ng-model="customer.child' + i + 'Dob"/></div>';
            var childDivComplied = $compile(childDiv)($scope);
            angular.element("#children").append(childDivComplied);

        }
    };
});