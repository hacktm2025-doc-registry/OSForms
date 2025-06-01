// Replace this with your own form URL from Form.io
const baseUrl = 'http://localhost:3000/';

const sendPetition = "send-petition.json";
const answerPetition = "answer-petition.json";
const approveOrRejectPetition = "approve-or-reject.json";
const finishPetition = "finalize-petition.json";

const formsByRole = {
	"citizen": sendPetition,
	"clerk": answerPetition,
	"secretary": approveOrRejectPetition,
	"mayor": finishPetition
}

/*
- on user selector, keep user role in cookie
- on non-citizen, ask for petition id, ask for petition data, ask for form, fill data into form
 */

let role = getRole();
if (getRole() != "citizen") {
	const petitionId = prompt("Introduceți numărl petiției");
}
const formToUse = formsByRole[role];
loadData(petitionId);

function getRole() {
    const cookieArr = document.cookie.split(";");

    for (let cookie of cookieArr) {
        cookie = cookie.trim();
        if (cookie.startsWith(role + "=")) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function renderForm(data) {}
	formUrl = baseUrl + formToUse;
	Formio.createForm(document.getElementById('formio'), formUrl)
	.then(form => {
		form.submission = data;
		form.on('submit', submission => {
			;
		});
	})
	.catch(err => {
		console.error('Error loading the form:', err);
	});
}

function loadData(petitionId) {
	var dataUrl = `?petitionid=${petitionId}`;
	var xhr = new XMLHttpRequest();

	xhr.open('GET', dataUrl, true); // true = asynchronous

	xhr.onreadystatechange = function () {
	if (xhr.readyState === 4) { // DONE
		if (xhr.status === 200) {
		var responseData = JSON.parse(xhr.responseText);
		renderForm(responseData);
		} else {
		console.error('XHR error: ' + xhr.status);
		alert("Error loading data.");
		}
	}
	};

	xhr.send(); // Send the request
}


/*
 user roles:
	- citizen
	- clerk
	- secretary
	- mayor
 */

/*
 * states:
	- new
	- submitted
	- answered
	- rejected
	- approved
	- notified
	- finalized
 */

/* generic implementations:
	- every doc in every state has:
		- assigned to either user or group
		- status
		- owning org unit
	- after each workflow step it is reassigned:
		- find what association exists with role - group or user
		- if user, find if user available, otherwise find placeholder
		- if group, assign to group - not to set of users in group!
	- role is role within org unit

	- send email
		- hidden email fields on form - to, cc, bcc, body template ref, subject template ref

	- set fields to custom values from actions
		- extensions to tasks of all kinds specify fields to be set as field name and JSONata expression

	- extension call:
		- extension name comes from extensions to BPMN elements
		- message is JSON in which values get replaced by JSONata evaluation of values that are in place to begin with
		- message bus can be hazelcast
 */
