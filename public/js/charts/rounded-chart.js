(function ($) {
 "use strict";
 
	 /*----------------------------------------*/
	/*  1.  pie Chart
	/*----------------------------------------*/
	var ctx1 = document.getElementById("piechart-1");
	var piechart1 = new Chart(ctx1, {
		type: 'pie',
		data: {
			labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
			datasets: [{
				label: 'pie Chart',
                backgroundColor: [
					'#303030',
					'#933EC5',
					'#65b12d',
					'#D80027',
					'#006DF0'
				],
				data: [10, 20, 30, 40, 60]
            }]
		},
		options: {
			responsive: true
		}
	});
	var ctx2 = document.getElementById("piechart-2");
	var piechart2 = new Chart(ctx2, {
		type: 'pie',
		data: {
			labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
			datasets: [{
				label: 'pie Chart',
                backgroundColor: [
					'#303030',
					'#933EC5',
					'#65b12d',
					'#D80027',
					'#006DF0'
				],
				data: [10, 20, 30, 40, 60]
            }]
		},
		options: {
			responsive: true
		}
	});

	 
		
})(jQuery); 