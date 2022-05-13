


(function(e,f){var b={},g=function(a){b[a]&&(f.clearInterval(b[a]),b[a]=null)};e.fn.waitUntilExists=function(a,h,j){var c=this.selector,d=e(c),k=d.not(function(){return e(this).data("waitUntilExists.found")});"remove"===a?g(c):(k.each(a).data("waitUntilExists.found",!0),h&&d.length?g(c):j||(b[c]=f.setInterval(function(){d.waitUntilExists(a,h,!0)},500)));return d}})(jQuery,window);

/**
 *  * @function
 *   * @property {object} jQuery plugin which runs handler function once specified
 *    *           element is inserted into the DOM
 *     * @param {function|string} handler
 *      *            A function to execute at the time when the element is inserted or
 *       *            string "remove" to remove the listener from the given selector
 *        * @param {bool} shouldRunHandlerOnce
 *         *            Optional: if true, handler is unbound after its first invocation
 *          * @example jQuery(selector).waitUntilExists(function);
 *           */







function PageChanged(){
    console.log("Location: "+window.location);

    var url = window.location.href;
    var path = window.location.pathname
    var host = window.location.hostname

    var hostParts=host.split('.')
    var pathParts=path.split('/')

    var L1 = pathParts[1]
    var L2 = pathParts[2]
    var L3 = pathParts[3]
    var L4 = pathParts[4]
    var L5 = pathParts[5]

    if (L2 == 'tickets' && L3.match(/[0-9a-f-]+/) ){
        console.log("Doing ticket stuff");
		setTimeout(function(){UpdateTicketPage()},5000);
        //jQuery('div#moreButtons:visible').waitUntilExists(UpdateTicketPage());
    }
	if (L2 == 'deployment' && L3.match(/[0-9a-f-]+/) ){
        console.log("Doing deployment stuff");
		setTimeout(function(){UpdateDeploymentPage()},5000);
        //jQuery('div#moreButtons:visible').waitUntilExists(UpdateTicketPage());
    }
	if (L2 == 'users' && L3.match(/[0-9a-f-]+/) ){
        console.log("Doing user stuff");
		setTimeout(function(){UpdateUserPage()},2000);
        //jQuery('div#moreButtons:visible').waitUntilExists(UpdateTicketPage());
    }


}

function UpdateTicketPage(){
    console.log("Updating a ticket page now");
	
	if ($('#PrintTicketReceipt').length==0){
		$('div.ticket-actions').append('<button class="btn btn-white ng-scope" type="button" onclick="PrintTicketReceipt()" id="PrintTicketReceipt">Print TR</button>');
	}
	
	if ($('#CheckoutAssetToUser').length==0){
		$('spark-ticket-requestor  div.ibox-content').append('<button class="btn btn-xs ng-scope" type="button" onclick="CheckAssetOutToTicketReporter()" id="CheckoutAssetToUser">Checkout Asset</button>');
	}
	
//	if ($('#AddUserPrimaryAsset').length==0){
//		$('spark-ticket-requestor  div.ibox-content').append('<button class="btn btn-xs ng-scope" type="button" onclick="AddUserPrimaryAsset()" id="AddUserPrimaryAsset">Add Primary Asset</button>');
//	}

	$("[ng-bind='$ctrl.Ticket.For.Email").replaceWith('<span>'+$("[ng-bind='$ctrl.Ticket.For.Email").text()+'</span>');
	$("[ng-bind='$ctrl.Ticket.Owner.Email").replaceWith('<span>'+$("[ng-bind='$ctrl.Ticket.Owner.Email").text()+'</span>');
}

function UpdateDeploymentPage(){
    console.log("Updating a deployment page now");
	
	if ($("[ng-bind='Data.Title']").length=1 && $("#PrintStorageReceipt").length == 0){
		$("[ng-bind='Data.Title']").append('<button class="pull-right btn btn-default top-n5 position-relative ng-scope" type="button" onclick="PrintStorageReceipt()" id="PrintStorageReceipt">Print SR</button>');
	}
	
}

function UpdateUserPage(){
    console.log("Updating a user page now");
	
	if ($('#PrintUserLabel').length==0){
		$("h5:contains('Devices')").after('<button class="btn btn-white ng-scope" type="button" onclick="GSDPrintStudentAssetLabel()" id="PrintUserLabel">Print User Label</button>');
	}
	

}


function PrintTicketReceipt (){

    var ticketNumber = $("div.ticket-detail span[ng-bind='$ctrl.Ticket.TicketNumber']").html();
    var ticketSubject = $("h3.field-issue-description-title").text().replace(/Issue:.../,"").replace(/&/,"&amp;");

    var ticketForEmail = $("[ng-show='$ctrl.Ticket.For.Email']").text();
    var ticketOwnerEmail = $("[ng-show='$ctrl.Ticket.Owner.Email']").text();

    var ticketForName = $("[ng-bind='$ctrl.Ticket.For.Name']").text();
    var ticketOwnerName = $("[ng-bind='$ctrl.Ticket.Owner.Name']").text();

    var submittedDate = $('spark-ticket-details-bar div div:nth-child(2)').text().replace(/Submitted: /,'');

    var locationName = $("[ng-bind='$ctrl.Ticket.Location.Name']").text();
    var locationDetail = $("[ng-show='$ctrl.Ticket.LocationDetails']").text().replace(' - ','');

    var newtasknote = $('.new-task-entry input').val();
    var tasks=[];
    $('spark-subtasks-task.incomplete input').each(function(index){if(this.value.length > 0){tasks.push(this.value)}});
	
	var assetTag = $("[ng-bind='$ctrl.Asset.AssetTag']").text();
	
	var ticketStatus = $("[ng-bind='$ctrl.GetTicketStatusText()']").text();
	var ticketTags = $('div.tags').text().trim()

	var currentDateTime = Date().toString().replace(/ GMT.*/,'');
//<text lang="en" smooth="true"/>
//<text font="font_a"/>
    
	var xmlbody=`<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
<text width="3" height="3" align="center">GSD IT Ticket</text>
<text align="left" />
<feed line="3"/>
<text width="1" height="1">${ticketSubject}</text>
<feed line="2"/>
`

	xmlbody+= `<text em="true" align="left">Reporter:</text><text em="false">${ticketOwnerName} (${ticketOwnerEmail.replace(/@gatewayk12\.(org|net)/,'').trim()})</text><feed />`;
	if (ticketOwnerEmail != ticketForEmail) {
		xmlbody+=`<text em="true" align="left">For:</text><text em="false">${ticketForName} (${ticketForEmail.replace(/@gatewayk12\.(org|net)/,'').trim()})</text><feed />`;
	}

	xmlbody+=`<text em="true" align="left">Location:</text><text em="false">${locationName}/${locationDetail}</text><feed />`;
	xmlbody+=`<text em="true" align="left">Submitted:</text><text em="false">${submittedDate}</text><feed />`;
	if (assetTag != '') {
		xmlbody+=`<text em="true" align="left">Asset:</text><text em="false">${assetTag}</text><feed />`;
	}
	if (ticketTags != '') {
		xmlbody+=`<text em="true" align="left">Ticket Tags:</text><text em="false">${ticketTags}</text><feed />`;
	}
	xmlbody+=`<text em="true" align="left">Status:</text><text em="false">${ticketStatus}</text><feed />`;




try {

	if (!( tasks.length > 0 || (newtasknote.length > 0))){
		xmlbody+=`<feed />`;
	}


	if (tasks.length > 0){
		//xmlbody+=`<text em="true" align="center">Tasks</text><feed />`;
		for (task of tasks) {xmlbody+=`<text align="right" em="false">${task} __</text><feed />`;}
	}
//	if (tasks.length > 0){
//		xmlbody+=`<text em="true" align="center">Tasks</text><feed />`;
//		for (task of tasks) {xmlbody+=`<text align="center" em="false">${task}</text><feed />`;}
//		xmlbody+=`<feed />`;
//	}
	if (newtasknote.length > 0){
		xmlbody+=`<text align="right" em="false">${newtasknote}</text><feed />`;
		xmlbody+=`<feed />`;
	}

} catch (error) {
  console.error(error);
}




	xmlbody+=`<barcode type="code128" hri="below" height="64" align="center">{B${ticketNumber}</barcode>`;
	xmlbody+=`<feed line="1"/>`;
	xmlbody+=`<text align="center">${currentDateTime}</text>`;
	xmlbody+=`<feed line="1"/>`;
	xmlbody+=`<cut type="feed"/>`;	
	xmlbody+=`</epos-print>`;

	PrintReceipt(xmlbody);
}




function PrintStorageReceipt(){

	var currentDateTime = Date().toString().replace(/ GMT.*/,'');
	
	var checkinmessage= $("[ng-bind='Data.SuccessMessage']").text();
	
//<text lang="en" smooth="true"/>
//<text font="font_a"/>
    
	
	
	var xmlbody=`<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
<text width="3" height="3" align="center">GSD Tech</text>
<feed line="3"/>
<text width="3" height="3" align="center">Storage</text>
<text align="left" />
<feed line="3"/>
<text width="1" height="1">${checkinmessage}</text>
<feed line="3"/>
`

	xmlbody+=`<text align="center">${currentDateTime}</text>`;
	xmlbody+=`<feed line="1"/>`;
	xmlbody+=`<cut type="feed"/>`;
	xmlbody+=`</epos-print>`;

	PrintReceipt(xmlbody);
}






function PrintReceipt (xmlbody){
    var soap=`<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>${xmlbody}</s:Body></s:Envelope>`
    var xhr = new XMLHttpRequest();
    var url = 'https://printer.url.here/service.cgi?devid=local_printer&timeout=100000';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
    xhr.setRequestHeader('SOAPAction', '""');
    xhr.send(soap);
}


function GSDPrintStudentAssetLabel(){
	email=$("[ng-show='$ctrl.Data.User.Username'] div").text();
	username=email.replace(/@.*/,'');
	studentid=$("[ng-model='$ctrl.Data.User.SchoolIdNumber']").text();
    var studentassetlabelurl="gsdurl1://printstudentassetlabel?username="+username+"&studentid="+studentid;
    window.open(studentassetlabelurl);
	//window.location=studentassetlabelurl;
}






function CheckAssetOutToTicketReporter(){
	    var ticketForEmail = $("[ng-show='$ctrl.Ticket.For.Email']").text();
		var ticketOwnerEmail = $("[ng-show='$ctrl.Ticket.Owner.Email']").text();
		
		angular.element("[title='Batch Check Out']").triggerHandler('click');
		
		setTimeout( function(){
			angular.element("[placeholder='Student ID / Username / Email']").val(ticketForEmail);
			angular.element("[placeholder='Student ID / Username / Email']").change();
			angular.element("[placeholder='Student ID / Username / Email']").triggerHandler({ type: 'keydown', which: 13 });
		}, 1000 );
			
}



//function AddUserPrimaryAsset(){
//	    var ticketForEmail = $("[ng-show='$ctrl.Ticket.For.Email']").text();
//		var ticketOwnerEmail = $("[ng-show='$ctrl.Ticket.Owner.Email']").text();
//		
//		
//		//interval=setInterval(function(){ alert("Hello"); }, 3000);
//		angular.element("div.for-info a.btn").triggerHandler('click');		
//		
//		
//		setTimeout( function(){
//			var assetTag = $("[ng-bind='$ctrl.Asset.AssetTag']").text();
//			history.go(-3);
//			setTimeout( function(){
//				angular.element("[ng-click='$ctrl.ShowAddDevice()']").triggerHandler('click');
//				angular.element("[ng-model='$asset.AssetTag']").val(assetTag);	
//			}, 1000 );
//			//angular.element("[title='Lookup by Asset Tag']").triggerHandler('click');
//		}, 4000 );
//			
//}



PageChanged();


    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            setTimeout( PageChanged , 0 );
            return pushState.apply(history, arguments);
        };
    })(window.history);

    window.onpopstate = function(event) {
		console.log("Location changed with popstate");
        //alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
		setTimeout( PageChanged , 0 );
    }







