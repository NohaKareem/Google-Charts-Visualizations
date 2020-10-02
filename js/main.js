// convert days to milliseconds	https://youtu.be/b0KmEn0UX80 
function daysToMills(days) {
	return days * 24 * 60 * 1000;
}

const LIGHT_BLUE = '#61ECFF';

google.charts.load('current'); 
google.charts.setOnLoadCallback(drawVisualization);

function drawVisualization() {
	// Gantt Chart
	var ganttData = new google.visualization.DataTable();
	ganttData.addColumn('string', 'Task Id');
	ganttData.addColumn('string', 'Title');
	ganttData.addColumn('date', 'Start Date');
	ganttData.addColumn('date', 'End Date');
	ganttData.addColumn('number', 'Duration');//~
	ganttData.addColumn('number', 'Percent Complete');
	ganttData.addColumn('string', 'Dependencies');

	ganttData.addRows([
		['6007.1', 'Read ch. 7', new Date(2020, 9, 21), new Date(2020, 9, 28), null, 100, null],
		['5012.1', 'Sketch logo ideas', new Date(2020, 9, 23), new Date(2020, 9, 30), null, 100, null],
		['6007.2', 'Write paper', new Date(2020, 9, 28), new Date(2020, 10, 5), null, 10, '6007.1'],
		['GenEd.1', 'Write willpower challenge plan', new Date(2020, 9, 21), new Date(2020, 10, 3), null, 15, null],
		['5010.1.0', 'Explore Google Charts API', new Date(2020, 9, 23), new Date(2020, 9, 27), null, 100, null],
		['5010.1', 'Google Charts API', new Date(2020, 9, 26), new Date(2020, 10, 2), null, 65, '5010.1.0'],
		['5012.2', 'Illustrate logo', new Date(2020, 10, 1), new Date(2020, 10, 8), null, 0, '5012.1'],
		['5011.1', 'Explore Kepler.gl', new Date(2020, 9, 24), new Date(2020, 10, 1), null, 100, null],
		['5011.2', 'Explore Kepler.gl using formatted data', new Date(2020, 10, 1), new Date(2020, 10, 8), null, 0, '5011.1'],
		['5009.1', 'Setup Raspberry Pi', new Date(2020, 9, 21), new Date(2020, 9, 22), null, 100, null],
		['5009.2', 'Setup Arduino + Johnny Five', new Date(2020, 9, 22), new Date(2020, 9, 29), null, 50, '5009.1'],
		['5009.3', 'Connect P5.js', new Date(2020, 9, 29), new Date(2020, 10, 6), null, 50, '5009.2']
	]);

	var wrapper2 = new google.visualization.ChartWrapper({
		chartType: 'Gantt',
		dataTable: ganttData,
		options: { 
			// animation: {"startup": true},
			'title': 'Gantt Chart', 
			'height': 900,

			gantt: {
				arrow: {
					angle: 125, 
					width: 3, 
					color: LIGHT_BLUE,
					radius: 30
				},
				criticalPathEnabled: true, 
				criticalPathStyle: {
					stroke: '#ff0055',
					strokeWidth: 3.5
				}
			},
			// animation:{
			//  "startup": true,
			//   duration: 3000,
			//   easing: 'out'
			// }
			}, 
		containerId: 'ganttVis'//~
	});
  	wrapper2.draw();
	
	// Sankey Diagram
	let colors = [];//; = ['#89FC20', '#FF9FBF', '#01396B'];//#B934D4 #61ECFF
  
	var sankeyData = new google.visualization.DataTable();
	sankeyData.addColumn('string', 'Category');
	sankeyData.addColumn('string', 'Subcategory');
	sankeyData.addColumn('number', 'Hours');
	sankeyData.addColumn({'type': 'string', 'role': 'tooltip', 'p': { 'html': 'true' }});

	// weights reflect hours per week
	sankeyData.addRows([
		['Build','Study',6, generateToolTip('Build','Study',6)],
		['Build','Organize',2, generateToolTip('Build','Organize',2)],
		['Build','Class',18, generateToolTip('Build','Class',18)],
		['Build','Work',5, generateToolTip('Build','Work',5)],
		['Build','Research',3, generateToolTip('Build','Research',3)],
		['Home','Cook',5, generateToolTip('Home','Cook',5)],
		['Home','Clean',5, generateToolTip('Home','Clean',5)],
		['Home','Organize',5, generateToolTip('Home','Organize',5)],
		['Explore','YouTube',5, generateToolTip('Explore','YouTube',5)],
		['Explore','Reading',5, generateToolTip('Explore','Reading',5)],
		['Explore','Online Class',5, generateToolTip('','Online Class',5)],
		['Study','5007',6, generateToolTip('Study','5007',6)],
		['Study','5008',2, generateToolTip('Study','5008',2)],
		['Study','5009',3, generateToolTip('Study','5009',3)],
		['Study','5010',4, generateToolTip('Study','5010',4)],
		['Study','5011',5, generateToolTip('Study','5011',5)],
		['Study','5012',3, generateToolTip('Study','5012',3)],	
		['Class','5007',3, generateToolTip('Class','5007',3)],
		['Class','5008',3, generateToolTip('Class','5008',3)],
		['Class','5009',3, generateToolTip('Class','5009',3)],
		['Class','5010',3, generateToolTip('Class','5010',3)],
		['Class','5011',3, generateToolTip('Class','5011',3)],
		['Class','5012',3, generateToolTip('Class','5012',3)]
	]);
	// console.log(sankeyData.fg)
	// console.log(sankeyData.fg[20].c[0].v)

	// generate html tooltip
	function generateToolTip(category, subCategory, hours) {
		return `<div class="tooltip"><span class="bold">${category}</span> - ${subCategory}: ${hours} hours</div>`;
	}

	// color code sankey based on category
	sankeyData.fg.forEach(node => {
		let fromNode = node.c[0].v;
		let toNode = node.c[1].v;
		switch(fromNode) {
			case ('Build'):
			case ('Class'):
			case ('Study'):
				if(toNode[0] === '5') {
					// color code subcategories
					switch(toNode) {
						case '5007':
							colors.push('#d9d2e9');
							break;
						case '5008':
							colors.push('#fce8b2');
							break;
						case '5009':
							colors.push('#d5a6bd');
							break;
						case '5010':
							colors.push('#4285f4');
							break;
						case '5011':
							colors.push('#46bdc6');
							break;
						case '5012':
							colors.push('#fce8b2');
							break;
					}
				} else { colors.push(LIGHT_BLUE); } //#01396B
				break;
			case ('Home'):
				colors.push('#89FC20');
				break;
			case ('Explore'):
				colors.push('#FF9FBF');
				break;
		}
	});
	// sankey wrapper
	var sankeyWrapper = new google.visualization.ChartWrapper({
		chartType: 'Sankey',
		dataTable: sankeyData,
		options: { 
			tooltip: { isHtml: true },
			// height: 500,
			sankey: {
				node: {
					// interactivity: true,
					nodePadding: 4,
					// labelPadding: 10,
					// fontName: 'Quicksand',
					// width: 10,
					colors: colors
				}, 
				link: {
					colorMode: 'gradient',
					colors: colors

				}
			} 
		},
		containerId: 'sankeyVis'
	});
	sankeyWrapper.draw();
}