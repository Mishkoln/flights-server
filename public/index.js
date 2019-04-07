'use strict'

class Flight {
	constructor(data) {
		this.id = data.id;
		this.from = data.from;
		this.to = data.to;
		this.departure = data.departure;
		this.arrival = data.arrival;
		this.airline = data.by;
	}
}

const timetable = [];

window.onload = function() {
	getFlights();

	// handle sort by on button click
	let departureOrder = -1;
	let arrivalOrder = -1;
	const departureBtn = document.querySelector('#departure');
	const arrivalBtn = document.querySelector('#arrival');
	departureBtn.onclick = function() {
		timetable.sort(sortFlights('departure', departureOrder *= -1));
		showFlights();
	};
	arrivalBtn.onclick = function() {
		timetable.sort(sortFlights('arrival', arrivalOrder *= -1));
		showFlights();
	};
} 

function getFlights() {
	fetch('flights.json')
		.then(res => res.json())
		.then(flights => {
			flights.forEach((flight) => {
				addFlight(flight)
			});
			showFlights();
		});
}

function addFlight(data) {
	timetable.push(new Flight(data));
}

function showFlights() {
	const content = document.querySelector('.content');

	// reset
	let rowsHtml = '';
	content.innerHTML = rowsHtml;

	// build
	timetable.forEach(flight => {
		const rowHtml =
			`<div class="rows">
				<div class="cell row">${flight.id}</div>
				<div class="cell double row">${flight.from}</div>
				<div class="cell double row">${flight.to}</div>
				<div class="cell row">${flight.departure}</div>
				<div class="cell row">${flight.arrival}</div>
				<div class="cell double row">${flight.airline}</div>
			</div>`;
		rowsHtml += rowHtml;
	});

	// display
	content.innerHTML = rowsHtml;
}

function sortFlights(field, order) {
	return function (a,b) {
		var result = (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0;
		return result * order;
	}
}


