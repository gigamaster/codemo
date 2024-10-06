/*
* Interactive Arms Transfer Visualisation by Bewelge.
* Inspired by Will Geary's (@wgeary) Video - https://vimeo.com/286751571
* SVG Map by AMCharts - https://www.amcharts.com/svg-maps/?map=world
* 
* Dataset retrieved from SIPRI - https://www.sipri.org/databases/armstransfers
* Thanks to Jsvine for this neat trick to download the set as CSV - https://gist.github.com/jsvine/9cb3300588ed402160fe
* Cleaned dataset by removing:
	- All deals where Supplier or Recipient is unknown.
	- All deals which had multiple sellers without specification which. 
	- Deals with the UN, NATO, Regional Security System (RSSS), OSCE & African Union as seller or buyer
* and consolidating the following groups:
	- Amal (Lebanon)* -> Lebanon
	- ANC (South Africa)* -> South Africa
	- Anti-Castro rebels (Cuba)* -> Cuba
	- Armas (Guatemala) -> Guatemala
	- Biafra -> Nigeria
	- contras (Nicaragua)* -> Nicaragua
	- El Salvador (FMLN) -> El Salvador
	- ELF (Ethiopia)* -> Ethiopia
	- FNLA (Angola)* -> Angola
	- GUNT (Chad)* -> Chad
	- Haiti Rebels -> Haiti
	- Hezbollah (Lebanon)* -> Lebanon
	- Huthi rebels (Yemen)* -> Yemen
	- Indonesia Rebels -> Indonesia
	- Khmer Rouge (Cambodia)* -> Cambodia
	- Lebanon Palestinian rebels* -> Lebanon
	- LF (Lebanon)* -> Lebanon
	- libya GNC -> Libya
	- Libya HoR -> Libya
	- LTTE (Sri Lanka)* -> Sri Lanka
	- Macedonia (FYROM) -> Macedonia
	- MTA (Myanmar)* -> Myanmar
	- Mujahedin (Afghanistan)* -> Afghanistan
	- Northern Alliance (Afghanistan)* -> Afghanistan
	- Northern Cyprus -> Cyprus
	- SLA (Lebanon)* -> Lebanon
	- SNA (Somalia)* -> Somalia
	- Southern rebels (Yemen)* -> Yemen
	- Soviet Union -> Russia
	- Syria Rebels -> Syria
	- UIC (Somalia)* -> Somalia
	- Ukraine Rebels* -> Ukraine
	- UNITA (Angola)* -> Angola
	- Viet Cong -> Vietnam
	- Viet Minh -> Vietnam
	- Viet Nam -> Vietnam
	- ZAPU -> Zimbabwe
* Other plugins used: 
	- Color Picker - https://bgrins.github.io/spectrum/ by bgrins
	- jQuery 
*/

var bgCanvas, rightCanvas, leftCanvas, ctx, lctx, rctx, bgCanvas2, ctx2 = null;
var width = 0;
var height = 0;
var windowWidth, windowHeight;
var scale = 1;
var countryLocations;
var leftLongitude = -169.110266;
var topLatitude = 83.63001;
var rightLongitude = 190.480712;
var bottomLatitude = -58.488473;

var mouseDown = false;
var mouseX;
var mouseY;
var lastMouseX = 0;
var lastMouseY = 0;
var mouseAng = 0;
var armsTransfers = {};

var valueDenominator = 1;
var ticksPerYear = 150;
var maxDots = 10000;
var allCountriesByVolume = {};
var allRecipientForCountry = {};
var countryShapes = {};

var byVolume = false;
var byValue = true;

var strokeDots = false;
var fillDots = true;

var showLegend = true;
var hideLegend = false;

var showSideGraphs = true;
var hideSideGraphs = false;

var showBottomGraph = true;
var hideBottomGraph = false;

var colorChosen = true;
var dontColorChosen = false;

var startYear = 1950;
var endYear = 2017

var svgMap = new Image();
var paused = true;
var settingsCollapsed = true;
var chosenCountries = {}

var dotRad = 2.5;
var arcRandomness = 1;
var dotSpeed = 50;

var images = {};
var dots = {}
var ticker = ticksPerYear;
var currentYear = 1949;
var toSpawnThisYear = {};
var totalVolumeValues = {
	sellers: {},
	receivers: {}
};
var currentYearVolumeValues = {
	sellers: {},
	receivers: {}
};
var dotsToSpawnNextTick = 0;
var imageDots = false;
var isMobile = false;
svgMap.src = "worldHigh.svg"
svgMap.onload = function () {
	start();
}

window.mobilecheck = function () {
	var check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};
function start() {

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		isMobile = true;
	}

	isMobile = mobilecheck();
	setDims();
	createCanvases()
	ctx2.drawImage(svgMap, 0, 0, width, height);
	drawTimeline(ctx2);
	loadJSONS(initMenu);

	if (isMobile) {
		document.getElementById("mainTitle").style.fontSize = "14px"
	}
	document.addEventListener("mousemove", handleMouseMove);
}

function setDims() {
	windowWidth = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	windowHeight = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;

	let leftWd = 200;
	if (hideSideGraphs || isMobile) {
		leftWd = 0;
	}
	let bottomHt = 350;
	if (hideBottomGraph || isMobile) {
		bottomHt = 100;
	}
	width = Math.floor(windowWidth - leftWd * 2);
	height = Math.floor(windowHeight - bottomHt);
	let totLong = Math.abs(rightLongitude) + leftLongitude;
	let totLat = Math.abs(bottomLatitude) + topLatitude;


	scale = width / 1009.673;//Math.min(width / 1009.673, height / 665.963);

	width = scale * 1009.673
	height = scale * 665.963

	if (bgCanvas) {
		bgCanvas.width = width;
		bgCanvas.height = height + bottomHt / 2;
		bgCanvas.style.left = (windowWidth - width) / 2 + "px";
	}
	if (bgCanvas2) {
		bgCanvas2.width = width;
		bgCanvas2.height = height + bottomHt / 2;
		bgCanvas2.style.left = (windowWidth - width) / 2 + "px";
	}
	if (rightCanvas) {
		rightCanvas.width = 200;
		rightCanvas.height = height + bottomHt / 2;
	}
	if (leftCanvas) {
		leftCanvas.width = 200;
		leftCanvas.height = height + bottomHt / 2;
	}

	if (bgCanvas2) {
		ctx2.drawImage(svgMap, 0, 0, width, height);
		drawTimeline(ctx2);
	}

	getAllCountryPositions();
}
function createCanvases() {
	//Everything dynamic that is drawn every frame.
	bgCanvas = createCanvas(width, height + 175, 0, 0, "cnv1", "cnv", (windowWidth - width) / 2, 130, true);
	bgCanvas.style.zIndex = 1;
	ctx = bgCanvas.getContext("2d");

	//map is drawn once. Never cleared.
	bgCanvas2 = createCanvas(width, height + 175, 0, 0, "cnv2", "cnv", (windowWidth - width) / 2, 130, true);
	bgCanvas2.style.zIndex = 0;
	ctx2 = bgCanvas2.getContext("2d");

	//right and left canvas for pie and bar charts.
	rightCanvas = createCanvas(200, height + 175, 0, 0, "leftCanvas", "sideCanvas", 0, 130, true)
	leftCanvas = createCanvas(200, height + 175, 0, 0, "leftCanvas", "sideCanvas", windowWidth - 200, 130, true)
	rctx = rightCanvas.getContext("2d");
	lctx = leftCanvas.getContext("2d");


	document.body.appendChild(bgCanvas2);
	document.body.appendChild(bgCanvas);
	document.body.appendChild(rightCanvas);
	document.body.appendChild(leftCanvas);
}
function loadJSONS(callback) {
	$.getJSON("countryLocations.json", function (json1) {
		countryLocations = json1;
		getAllCountryPositions();
		$.getJSON("countryShapes.json", function (json2) {
			countryShapes = json2;
			$.getJSON("armsTransfers.json", function (json3) {

				armsTransfers = json3;

				for (let key in armsTransfers) {
					allCountriesByVolume[key] = 0;
					for (let yr in armsTransfers[key]) {
						for (let cntr2 in armsTransfers[key][yr]) {
							for (let transfer in armsTransfers[key][yr][cntr2]) {
								allCountriesByVolume[key] += parseFloat(armsTransfers[key][yr][cntr2][transfer][1]);
							}
						}
					}
				}
				//draw country names on map. Too cluttery
				/*ctx2.fillStyle="black";
				ctx2.font = "6px Arial black";
				for (let key in allCountriesByVolume) {
					if (key != "Switzerland") continue


					
						let wd = ctx2.measureText(key).width;
						let pos = getPositionByCoordinates(countryLocations[key].long,countryLocations[key].lat)
						ctx2.fillText(key,pos.x-wd/2,pos.y)
						ctx2.fillRect(pos.x-2,pos.y-2,4,4)
					
					
				}*/
				callback();
			})
		})
	})
}

function initMenu() {

	
	let settingsDiv = createDiv("settingsDiv", "collapse")
	let actionControl = createDiv("actionControl", "flexRow")
	settingsDiv.appendChild(actionControl)

	let collapseSettings = createDiv("settingsCollapser", "collapser", {
		innerHTML: "Collapse Settings",
		onclick: function () {
			if (settingsCollapsed) {
				settingsCollapsed = false
				settingsDiv.style.maxHeight = "48px";
				settingsDiv.style.boxShadow = "none"
			} else {
				settingsCollapsed = true
				settingsDiv.style.maxHeight = "calc(100% - 150px)";
				settingsDiv.style.boxShadow = "0 4px 14px 1px rgba(0, 0, 0, 0.5)";
			}
		}
	})
	actionControl.appendChild(collapseSettings)
	

	let playBut = createDiv("playButton", "button", {
		innerHTML: "Play",
		onclick: function () {
			play(playBut);
		}
	})
	actionControl.appendChild(playBut)

	let resetBut = createDiv("resetButton", "button", {
		innerHTML: "Reset",
		onclick: function () {
			reset();
		}
	})
	actionControl.appendChild(resetBut)

	let speedSlider = createSlider({
		id: "speedSlider",
		min: 1,
		max: 1000,
		step: 1,
		defaultValue: 150,
		lab: "Ticks / Year",
		varName: "ticksPerYear",
		infoTxt: "Into how many ticks each year is split. The speed at which a tick occurs depends entirely on the settings and how quickly your machine can render & update one frame"
	}).div
	let maxDotsSlider = createSlider({
		id: "maxDotsSlider",
		min: 500,
		max: 100000,
		step: 100,
		defaultValue: 10000,
		lab: "Max Dots",
		varName: "maxDots",
		infoTxt: "The maximum amount of dots allowed at once on screen. If it's set low together with a low tick speed, the dots will spawn in bursts."
	}).div
	let valDenomSlider = createSlider({
		id: "valDenomSlider",
		min: 0.1,
		max: 100,
		step: 0.1,
		defaultValue: 1,
		lab: "Value / Dot (M$)",
		varName: "valueDenominator",
		infoTxt: "How much each dot is worth. Note that a transfer worth 0.5 will not be shown if you set the value higher than 0.5. It will not add up over the years. Going lower than 1 will become very laggy though if you include one of the big arms exporters."
	}).div
	let dotSizeSlider = createSlider({
		id: "dotRadSlider",
		min: 0.5,
		max: 10,
		step: 0.1,
		defaultValue: 2.5,
		lab: "Dot Radius",
		varName: "dotRad",
		infoTxt: "The radius of the dots.",
		callback: function () {
			for (let key in chosenCountries) {
				createImage(key, chosenCountries[key])
			}
		}
	}).div

	let arcRandomnessSlider = createSlider({
		id: "arcRandomnessSlider",
		min: 0,
		max: 250,
		step: 1,
		defaultValue: 25,
		lab: "Arc Randomness",
		varName: "arcRandomness",
		infoTxt: "All dots travel on arcs from one country to another. If this value is set to 0, they will all travel on exactly the same line. It gives a nicer visual if there's some randomness.",

	}).div

	let dotSpeedSlider = createSlider({
		id: "dotSpeedSlider",
		min: 10,
		max: 100,
		step: 1,
		defaultValue: 50,
		lab: "Dot Speed",
		varName: "dotSpeed",
		infoTxt: "How quickly the dots travel. Note that it might get crowded and laggy if it's set too low and the tick/year setting is also low.",

	}).div

	let startYrSlider = createSlider({
		id: "startYearSlider",
		min: 1949,
		max: 2017,
		step: 1,
		defaultValue: 1949,
		lab: "Starting Year",
		varName: "startYear",
		infoTxt: "In which year the animation should start.",
		callback: function () {
			if (endYear < startYear) {
				endYear = startYear + 1;
				document.getElementById("endYearSlider").value = endYear;
				document.getElementById("endYearSliderInput").value = endYear;
			}
			ctx2.clearRect(0, height, width, 200)
			drawTimeline(ctx2)
			reset();
		}
	}).div
	let endYrSlider = createSlider({
		id: "endYearSlider",
		min: 1950,
		max: 2018,
		step: 1,
		defaultValue: 2018,
		lab: "Ending Year",
		varName: "endYear",
		infoTxt: "In which year the animation should end.",
		callback: function () {
			if (endYear < startYear + 1) {
				startYear = endYear - 1;
				document.getElementById("startYearSlider").value = startYear;
				document.getElementById("startYearSliderInput").value = startYear;
			}
			ctx2.clearRect(0, height, width, 200)
			drawTimeline(ctx2)
			reset();
		}
	}).div

	let countryContTitle = createDiv("countryContTitle", "countryContTitle", { 
		innerHTML: "Choose countries to display" 
	})
	let countryCont = createDiv("countryCont", "container");

	for (let key in allCountriesByVolume) {
		let div = createDiv("choose" + key, "chooseACountry", {
			innerHTML: key,
			onclick: function () {
				chooseCountry(key)
			}
		})
		div.setAttribute("data-by-value", allCountriesByVolume[key]);
		countryCont.appendChild(div)
	}
	let chosenCountriesCont = createDiv("chosenCountries", "container")

	let byVal = createSwitchClick({
		id: "dotsByWhat",
		label: "Spawn dots...",
		chosen: "byValue",
		infoTxt: "Decides what constitutes a dot. </br> <b>By Volume</b> will spawn one dot for each 'item' delivered. So an Aircraft carrier will look the same as a helicopter or a missile </br> <b>By value</b> means that the amount of dots will depend on the value of the transfer. You can specify the Value / Dot yourself in the settings. The TIV (Trend-Indicator Value) is used for the value of each transfer, which is a figure created by SIPRI that <a href='https://www.sipri.org/databases/armstransfers/background#TIV-tables'>'[...] is based on the known unit production costs of a core set of weapons and is intended to represent the transfer of military resources rather than the financial value of the transfer.'</a>",
		choices: {
			byValue: {
				label: "...by Value",
				callback: function () {
					$(valDenomSlider).show();
				},
				uncallback: function () {
					$(valDenomSlider).hide();
				}
			},
			byVolume: {
				label: "...by Volume"
			}
		}
	})

	let showLegend = createSwitchClick({
		id: "showLegend",
		label: "Legend",
		chosen: "showLegend",
		infoTxt: "Show or Hide the Legend on the top left.",
		choices: {
			showLegend: {
				label: "Show",
				callback: function () {
					$("#legend").fadeIn();
				}
			},
			hideLegend: {
				label: "Hide",
				callback: function () {
					$("#legend").fadeOut();
				}
			}
		}
	})

	let drawSideGraphs = createSwitchClick({
		id: "drawSideGraphs",
		label: "Side Graphs",
		chosen: "showSideGraphs",
		infoTxt: "Show or Hide the Graphs on the left and right. Hiding them might increase performance.",
		choices: {
			showSideGraphs: {
				label: "Show",
				callback: function () {
					setDims();
					//$("#legend").fadeIn();
				}
			},
			hideSideGraphs: {
				label: "Hide",
				callback: function () {
					setDims();
					//$("#legend").fadeOut();
				}
			}
		}
	})

	let drawBottomGraph = createSwitchClick({
		id: "drawBottomGraph",
		label: "Bottom Graph",
		chosen: "showBottomGraph",
		infoTxt: "Show or Hide the bottom Graph. Hiding it might increase performance.",
		choices: {
			showBottomGraph: {
				label: "Show",
				callback: function () {
					setDims();
					//$("#legend").fadeIn();
				}
			},
			hideBottomGraph: {
				label: "Hide",
				callback: function () {
					setDims();
					//$("#legend").fadeOut();
				}
			}
		}
	})

	let fillOrStroke = createSwitchClick({
		id: "drawDots",
		label: "Draw dots...",
		chosen: "fillDots",
		infoTxt: "How the dots are rendered. </br> <b>Fill</b> will simply fill all dots with the respecitve color. This the probably the most performant setting if there are many dots.  </br> <b>Stroke</b> will stroke the dots (drawing outline). Gives a nice visual effect but is less performant than fill. </br> <b>Image</b> will create an image of a dot and use context.drawImage(), which promises to make use of GPU acceleration and allows us to use a nice gradient within the dot. Performance might be better or worse than Fill",
		choices: {
			fillDots: {
				label: "...with Fill"
			},
			strokeDots: {
				label: "...with Stroke"
			},
			imageDots: {
				label: "...with Images"
			}/*,
			flagDots: {
				label: "...with Flags"
			},*/
		}
	})
	let colorChosenOrNot = createSwitchClick({
		id: "colorChosen",
		label: "Color chosen countries",
		chosen: "colorChosen",
		infoTxt: "Whether the country shape of chosen countries should be colored on the map.",
		choices: {
			colorChosen: {
				label: "Yes",
				callback: function () {
					drawAllChosenCountries();
				}
			},
			dontColorChosen: {
				label: "No",
				callback: function () {
					ctx2.clearRect(0, 0, width, height);
					ctx2.drawImage(svgMap, 0, 0, width, height);
				}
			}
		}
	})

	// settingsDiv.appendChild(playBut);
	// settingsDiv.appendChild(resetBut);

	let contCountryCont = createDiv("contCountryCont", "contContainer")
	contCountryCont.appendChild(countryContTitle);
	contCountryCont.appendChild(countryCont);
	contCountryCont.appendChild(chosenCountriesCont);
	settingsDiv.appendChild(contCountryCont)

	settingsDiv.appendChild(byVal)
	settingsDiv.appendChild(fillOrStroke)
	settingsDiv.appendChild(showLegend);
	if (!isMobile) {
		settingsDiv.appendChild(drawSideGraphs);
		settingsDiv.appendChild(drawBottomGraph);
	}
	settingsDiv.appendChild(colorChosenOrNot);
	settingsDiv.appendChild(startYrSlider);
	settingsDiv.appendChild(endYrSlider);
	settingsDiv.appendChild(speedSlider);
	settingsDiv.appendChild(maxDotsSlider);
	settingsDiv.appendChild(dotSizeSlider);
	settingsDiv.appendChild(dotSpeedSlider);
	settingsDiv.appendChild(arcRandomnessSlider);
	settingsDiv.appendChild(valDenomSlider);

	document.body.appendChild(settingsDiv)


	var divList = $(".chooseACountry");
	divList.sort(function (a, b) {
		return $(b).data("by-value") - $(a).data("by-value")
	});
	$(countryCont).html(divList);
}

function reset() {

	let playBut = document.getElementById("playButton");
	playBut.innerHTML = "Play"
	playBut.onclick = function () {
		play(playBut)
	}
	paused = true;
	currentYear = startYear;
	dots = {};
	ctx.clearRect(0, 0, width, height)
}

function play(but) {
	paused = false;
	but.innerHTML = "Pause"
	tick();
	if (settingsCollapsed) {
		settingsCollapsed = false
		settingsDiv.style.maxHeight = "48px";
		settingsDiv.style.boxShadow = "none"
	}
	but.onclick = function () {
		pause(but);
	}
}

function pause(but) {
	paused = true;
	but.innerHTML = "Play"
	but.onclick = function () {
		play(but);
	}
}

function tick() {
	//only tick if not too many dots
	if (dotSum() <= maxDots - dotsToSpawnNextTick) {
		dotsToSpawnNextTick = 0;
		if (currentYear < endYear) {
			ticker++;
		}
		for (let cntr1 in toSpawnThisYear) {
			for (let cntr2 in toSpawnThisYear[cntr1]) {
				let dif = Math.ceil(ticker / ticksPerYear * toSpawnThisYear[cntr1][cntr2].toSpawn) - toSpawnThisYear[cntr1][cntr2].spawned;
				//retrieve dots due next tick.
				dotsToSpawnNextTick += Math.ceil((ticker + 1) / ticksPerYear * toSpawnThisYear[cntr1][cntr2].toSpawn) - toSpawnThisYear[cntr1][cntr2].spawned;
				if (dif > 0) {
					toSpawnThisYear[cntr1][cntr2].spawned += dif
					for (let i = 0; i < dif; i++) {
						spawnDot(cntr1, cntr2)
					}
				}
			}
		}
		if (ticker >= ticksPerYear) {
			toSpawnThisYear = {}
			if (currentYear < endYear) {
				currentYear++;

				ticker = 0;
				if (byVolume) {
					getSpawnsByVolume();
				} else if (byValue) {
					getSpawnsByValue();
				}

			}
		}
	} else if (dotSum() == 0) {
		//if too many dots are to be spawned, slow it down appropriately.
		let dif = (maxDots / 5) / dotsToSpawnNextTick;
		ticker += dif;
		dotsToSpawnNextTick *= dif
	}
	draw();
	if (currentYear == endYear && dotSum() == 0) {
		reset();
	} else if ((currentYear < endYear + 1 || dotSum() > 0) && !paused) {
		window.requestAnimationFrame(tick);
	}
}

function getAllCountryPositions() {
	for (let cntr in countryLocations) {
		let pos = getPositionByCoordinates(countryLocations[cntr].long, countryLocations[cntr].lat)
		countryLocations[cntr].x = pos.x;
		countryLocations[cntr].y = pos.y;
	}
}

function chooseCountry(country) {
	let col = getCountryColor()
	chosenCountries[country] = col
	document.getElementById("choose" + country).remove()


	createChosenCountryDivs(country, col);

	createImage(country, col);

	//init all values per year now to free up some power for when the animation actually runs.
	getAllVolumeValues(country);



	getAllRecipientsForCountry(country);

	getAllArcsForCountry(country);

	if (colorChosen) {
		drawSingleCountry(country);
	}
}

function getAllVolumeValues(country) {
	for (let i = startYear; i < endYear; i++) {
		for (let cntr2 in armsTransfers[country][i]) {
			for (let transfer in armsTransfers[country][i][cntr2]) {
				updateVolumeValues(country, cntr2, transfer, i);

			}
		}
	}
}
function getAllRecipientsForCountry(country) {
	allRecipientForCountry[country] = {};
	for (let yr in armsTransfers[country]) {
		for (let recip in armsTransfers[country][yr]) {
			if (!allRecipientForCountry[country].hasOwnProperty(recip)) {
				allRecipientForCountry[country][recip] = { volume: 0, value: 0 };
			}
			for (let trans in armsTransfers[country][yr][recip]) {
				let vol = parseFloat(armsTransfers[country][yr][recip][trans][0]);
				let val = parseFloat(armsTransfers[country][yr][recip][trans][1]);
				if (!isNaN(vol)) {
					allRecipientForCountry[country][recip].volume += vol;
				}
				if (!isNaN(val)) {
					allRecipientForCountry[country][recip].value += val;

				}
			}
		}
	}

	for (let recip in allRecipientForCountry[country]) {
		if (allRecipientForCountry[country][recip].volume + allRecipientForCountry[country][recip].value == 0) {
			delete allRecipientForCountry[country][recip];
		}
	}
}

function getAllArcsForCountry(country) {
	let takenPositions = [];
	for (let recip in allRecipientForCountry[country]) {
		let pos1 = { x: countryLocations[country].x, y: countryLocations[country].y };
		let pos2 = { x: countryLocations[recip].x, y: countryLocations[recip].y };
		let x2 = (pos1.x + pos2.x) / 2;
		let y2 = (pos1.y + pos2.y) / 2;
		let ang = angle(pos1.x, pos1.y, pos2.x, pos2.y);
		let dis = Distance(pos1.x, pos1.y, pos2.x, pos2.y);

		let rnd = Math.random();

		// will change upward/downward arc depending on whether: its left/right of screen middle, cntr1 is left/right of cntr2 and cntr1 is upwards/downwards of cntr2.
		let angDiff = (Math.abs(width / 2 - pos1.x) / (width / 2 - pos1.x)) * (Math.abs(pos1.x - pos2.x) / (pos1.x - pos2.x)) * (Math.abs(pos1.y - pos2.y) / (pos1.y - pos2.y)) * Math.PI * 0.5


		let arcPos = {
			x: x2 + Math.cos(ang + angDiff) * (20 + dis * (0.2 + 0.4 * Math.random())),
			y: y2 + Math.sin(ang + angDiff) * (20 + dis * (0.2 + 0.4 * Math.random())),
		}

		//attempt to automaticaly even out arcs. Doesn't work very well...
		/*let dis1 = 100000;
		for (let key in allRecipientForCountry[country]) {
			if (key != recip && allRecipientForCountry[country][key].hasOwnProperty("arcX")) {
				let dis2 = Distance(allRecipientForCountry[country][key].arcX,allRecipientForCountry[country][key].arcY,pos1.x,pos1.y) 
				if (dis1 > dis2) {
					dis1 = dis2; 
					
				}
			}
		}
		while (dis1 < 25) {
			angDiff*= (Math.random() - Math.random())
			arcPos.x+= (Math.random() - Math.random()) * 10;
			arcPos.y+= (Math.random() - Math.random()) * 10;

			for (let key in allRecipientForCountry[country]) {
				if (key != recip && allRecipientForCountry[country][key].hasOwnProperty("arcX")) {
					let dis2 = Distance(allRecipientForCountry[country][key].arcX,allRecipientForCountry[country][key].arcY,pos1.x,pos1.y) 
					if (dis1 > dis2) {
						dis1 = dis2; 
						
					}
				}
			}
		}*/


		allRecipientForCountry[country][recip].arcX = arcPos.x;
		allRecipientForCountry[country][recip].arcY = arcPos.y;

	}

	//drawArcs(country);
}
function drawAllChosenCountries() {
	for (let cntr in chosenCountries) {
		drawSingleCountry(cntr);
	}
}
function drawSingleCountry(country, col) {
	ctx2.save();
	ctx2.scale(scale, scale);
	ctx2.fillStyle = chosenCountries[country];
	let p = new Path2D(countryShapes[country].d);
	ctx2.fill(p);
	ctx2.restore();
}
function drawArcs(country) {
	for (let recip in allRecipientForCountry[country]) {
		let pos1 = { x: countryLocations[country].x, y: countryLocations[country].y };
		let pos2 = { x: countryLocations[recip].x, y: countryLocations[recip].y };

		let cPos = { x: allRecipientForCountry[country][recip].arcX, y: allRecipientForCountry[country][recip].arcY };

		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.quadraticCurveTo(cPos.x, cPos.y, pos2.x, pos2.y);
		ctx.stroke();
		ctx.closePath();
	}
}
//creates legend and chosenCountryDiv(+ remove button + color picker)
function createChosenCountryDivs(country, col) {
	let newEl = createDiv("chosen" + country, "chosenCountry", {
		innerHTML: country
	})
	newEl.style.backgroundColor = col;
	let newLegend = createDiv("legend" + country, "legendCountry", {
		innerHTML: country
	});
	newLegend.style.border = "2px solid " + col;
	newLegend.style.backgroundColor = col;
	let colPick = document.createElement("input");
	colPick.value = col;
	colPick.type = "color";
	colPick.name = country + "Color";
	newEl.appendChild(colPick)
	$(colPick).spectrum({
		color: col,
		showAlpha: true,
		change: function (e) {
			newEl.style.backgroundColor = e.toRgbString();
			newLegend.style.backgroundColor = e.toRgbString();
			newLegend.style.border = "2px solid " + e.toRgbString();
			chosenCountries[country] = e.toRgbString();
			createImage(country, e.toRgbString())
		}
	});
	let remCountry = createDiv("remove" + country, "removeCountry", {
		innerHTML: "X",
		onclick: function () {
			removeCountry(country)
		}
	});
	newEl.appendChild(remCountry);
	document.getElementById("legend").appendChild(newLegend);
	document.getElementById("chosenCountries").appendChild(newEl)
}

function createImage(country, color) {
	let cn = createCanvas(dotRad * 2, dotRad * 2);
	let ct = cn.getContext("2d");
	let rgr = ct.createRadialGradient(dotRad, dotRad, 0, dotRad, dotRad, dotRad);
	rgr.addColorStop(0, color);
	rgr.addColorStop(1, "rgba(255,255,255,1)");
	ct.fillStyle = rgr;
	ct.beginPath();
	ct.arc(dotRad, dotRad, dotRad, 0, Math.PI * 2, 0);
	ct.fill();
	ct.closePath();
	images[country] = cn;
}

function removeCountry(country) {
	document.getElementById("chosen" + country).remove();
	document.getElementById("legend" + country).remove();
	drawSingleCountry(country, "rgba(0,0,0,0)");
	if (chosenCountries.hasOwnProperty(country)) {
		delete chosenCountries[country];
	}
	let newEl = createDiv("choose" + country, "chooseACountry", {
		innerHTML: country,
		onclick: function () {
			chooseCountry(country)
		}
	})

	ctx2.clearRect(0, 0, width, height);
	ctx2.drawImage(svgMap, 0, 0, width, height);
	if (colorChosen) {
		drawAllChosenCountries()
	}
	document.getElementById("countryCont").appendChild(newEl)
}

function spawnDot(country1, country2) {
	try {

		let pos1 = { x: countryLocations[country1].x, y: countryLocations[country1].y };//getPositionByCoordinates(countryLocations[country1].long, countryLocations[country1].lat)
		let pos2 = { x: countryLocations[country2].x, y: countryLocations[country2].y };//getPositionByCoordinates(countryLocations[country2].long, countryLocations[country2].lat)

		let ang = angle(pos1.x, pos1.y, pos2.x, pos2.y)
		let dis = Distance(pos1.x, pos1.y, pos2.x, pos2.y)

		let x2 = allRecipientForCountry[country1][country2].arcX /*(pos1.x + pos2.x) / 2*/
		let y2 = allRecipientForCountry[country1][country2].arcY /*(pos1.y + pos2.y) / 2*/

		if (pos1.x < pos2.x) {
			x2 += Math.cos(ang - Math.PI * 0.5) * (arcRandomness * Math.random())
			y2 += Math.sin(ang - Math.PI * 0.5) * (arcRandomness * Math.random())
		} else {
			x2 += Math.cos(ang + Math.PI * 0.5) * (arcRandomness * Math.random())
			y2 += Math.sin(ang + Math.PI * 0.5) * (arcRandomness * Math.random())
		}

		if (!dots.hasOwnProperty(country1)) {
			dots[country1] = [];
		}
		dots[country1].push([chosenCountries[country1], 0, dis, pos1.x, pos1.y, pos2.x, pos2.y, x2, y2, (dotRad)])
	} catch (e) {
		console.log(e, country1, country2)
	}
}

function getXFromLongitude(longit) {
	return width / (rightLongitude + Math.abs(leftLongitude)) * (longit + Math.abs(leftLongitude));
}

function getPositionByCoordinates(longit, lat) {

	let mapLonDelta = Math.abs(leftLongitude) + rightLongitude;

	let mapLatBottomDegree = bottomLatitude * Math.PI / 180;



	let x = (longit - leftLongitude) * (width / mapLonDelta);

	let latRad = lat * Math.PI / 180;
	let worldMapWidth = ((width / mapLonDelta) * 360) / (2 * Math.PI);
	let mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(mapLatBottomDegree)) / (1 - Math.sin(mapLatBottomDegree))));
	let y = height - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad)))) - mapOffsetY);


	return {
		x: x,
		y: y
	}
}


/*var countryPositions={}
function createMap(json) {
	let svg = document.getElementById("worldMap")
	let rect = svg.getBoundingClientRect();
	let top = rect.top;
	let left = rect.left;
	let ct = document.getElementById("worldMapCanvas").getContext("2d");

	for (let key in json) {
		let path = makeSVGElement("path", {
			id: json[key].id,
			d: json[key].d 
		})

		svg.appendChild(path)
		countryPositions[key] = path.getBoundingClientRect();
		path.addEventListener("mouseenter", function() {
			
		})
		
	}


	for (let key in armsTransfers) {

	}
}*/


function updateVolumeValues(key, cntr2, transfer, year) {
	if (!totalVolumeValues.receivers.hasOwnProperty(cntr2)) {
		totalVolumeValues.receivers[cntr2] = {
			volume: 0,
			value: 0
		};
	}
	if (!totalVolumeValues.sellers.hasOwnProperty(key)) {
		totalVolumeValues.sellers[key] = {
			volume: 0,
			value: 0
		};
	}
	if (!currentYearVolumeValues.receivers.hasOwnProperty(year)) {
		currentYearVolumeValues.receivers[year] = {};
	}
	if (!currentYearVolumeValues.receivers[year].hasOwnProperty(cntr2)) {
		currentYearVolumeValues.receivers[year][cntr2] = {
			volume: 0,
			value: 0
		};
	}
	if (!currentYearVolumeValues.sellers.hasOwnProperty(year)) {
		currentYearVolumeValues.sellers[year] = {};
	}
	if (!currentYearVolumeValues.sellers[year].hasOwnProperty(key)) {
		currentYearVolumeValues.sellers[year][key] = {
			volume: 0,
			value: 0
		};
	}

	currentYearVolumeValues.receivers[year][cntr2].volume += parseInt(armsTransfers[key][year][cntr2][transfer][0])
	currentYearVolumeValues.receivers[year][cntr2].value += parseInt(armsTransfers[key][year][cntr2][transfer][1])

	currentYearVolumeValues.sellers[year][key].volume += parseInt(armsTransfers[key][year][cntr2][transfer][0])
	currentYearVolumeValues.sellers[year][key].value += parseInt(armsTransfers[key][year][cntr2][transfer][1])

	totalVolumeValues.receivers[cntr2].volume += parseInt(armsTransfers[key][year][cntr2][transfer][0])
	totalVolumeValues.receivers[cntr2].value += parseInt(armsTransfers[key][year][cntr2][transfer][1])

	totalVolumeValues.sellers[key].volume += parseInt(armsTransfers[key][year][cntr2][transfer][0])
	totalVolumeValues.sellers[key].value += parseInt(armsTransfers[key][year][cntr2][transfer][1])
}

//Get sum of all dots.
function dotSum() {
	let sum = 0;
	for (let key in dots) {
		sum += dots[key].length;
	}
	return sum;
}

//retrieve dots to spawn in new year - by volume
function getSpawnsByVolume() {
	for (let key in chosenCountries) {
		if (armsTransfers[key].hasOwnProperty(currentYear)) {
			toSpawnThisYear[key] = {}
			for (let cntr2 in armsTransfers[key][currentYear]) {
				toSpawnThisYear[key][cntr2] = {
					spawned: 0,
					toSpawn: 0
				}
				for (let transfer in armsTransfers[key][currentYear][cntr2]) {
					toSpawnThisYear[key][cntr2].toSpawn += parseInt(armsTransfers[key][currentYear][cntr2][transfer][0])
				}
			}
		}
	}
}

//retrieve dots to spawn in new year - by value
function getSpawnsByValue() {
	for (let key in chosenCountries) {
		if (armsTransfers[key].hasOwnProperty(currentYear)) {
			toSpawnThisYear[key] = {}
			for (let cntr2 in armsTransfers[key][currentYear]) {
				toSpawnThisYear[key][cntr2] = {
					spawned: 0,
					toSpawn: 0
				}
				for (let transfer in armsTransfers[key][currentYear][cntr2]) {
					toSpawnThisYear[key][cntr2].toSpawn += parseInt(armsTransfers[key][currentYear][cntr2][transfer][1]) / valueDenominator
				}
			}
		}
	}
}

function sortByValue(a, b) {
	return b[2] - a[2];
}

//Gets max export in M$ for years between startYear and currentYear
function getMax() {
	let max = 0;
	for (let key in currentYearVolumeValues.sellers) {

		for (let kei in currentYearVolumeValues.sellers[key]) {
			if (parseInt(key) < currentYear) {
				if (currentYearVolumeValues.sellers[key][kei].value > max) {
					max = currentYearVolumeValues.sellers[key][kei].value;
				}
			} else if (currentYearVolumeValues.sellers.hasOwnProperty(currentYear - 1) && currentYearVolumeValues.sellers.hasOwnProperty(currentYear)) {
				if (currentYearVolumeValues.sellers[currentYear - 1].hasOwnProperty(kei) && currentYearVolumeValues.sellers[currentYear].hasOwnProperty(kei)) {
					let val = currentYearVolumeValues.sellers[currentYear - 1][kei].value || 0;
					let nextVal = currentYearVolumeValues.sellers[currentYear][kei].value || 0;
					let current = val + ticker / ticksPerYear * (nextVal - val)
					if (current > max) {
						max = current
					}
				}

			}
		}
	}
	return max;
}

//retrieves top 5 receivers for current year
function getTop5(data, variable) {
	let obj = {};
	let top5 = {};
	loop1:
	for (let key in data) {
		if (Object.keys(top5).length < 5) {
			top5[key] = {
				value: data[key][variable]
			}
			continue;
		}
		loop2:
		for (let top in top5) {
			if (data[key][variable] > top5[top].value) {
				top5[key] = {
					value: data[key][variable]
				};
				delete top5[top]
				continue loop1;
			}
		}
	}
	return top5;
}

//Main draw function. Also updates/moves/deletes dots.
function draw() {


	ctx.clearRect(0, 0, width, height + 200)
	rctx.clearRect(0, 0, 200, height + 200);
	lctx.clearRect(0, 0, 200, height + 200);
	drawCurrentYear(ctx);

	if (showSideGraphs && !isMobile) {
		drawBarCharts()
	}
	if (showBottomGraph && !isMobile) {
		drawBottomChart();
	}


	//for each country
	loop1:
	for (let key in dots) {
		if (dots[key].length == 0) continue
		if (!imageDots) {
			ctx.fillStyle = dots[key][0][0];
			ctx.strokeStyle = dots[key][0][0];
			ctx.lineWidth = 1;
			ctx.beginPath();
		}
		//each dot of each country
		for (let kei = dots[key].length - 1; kei >= 0; kei--) {
			let d = dots[key][kei];

			//increase distance traveled
			d[1] += Math.max(3, (d[2] - d[1]) / 50) * dotSpeed / 50;

			//target reached
			if (d[1] > d[2]) {
				dots[key].splice(kei, 1);
				if (dots[key].length <= 0) {
					delete dots[key];
					continue loop1;
				}
			} else {


				//calculate pos on arc.
				let t = d[1] / d[2];
				let t2 = t * t;
				let ti2 = (1 - t) * (1 - t);
				let tit2 = (1 - t) * 2 * t;
				let x = Math.floor(ti2 * d[3] + tit2 * d[7] + t2 * d[5]);
				let y = Math.floor(ti2 * d[4] + tit2 * d[8] + t2 * d[6]);

				if (imageDots) {
					ctx.drawImage(images[key], x - 5, y - 5);
				} else {
					ctx.moveTo(x, y);
					ctx.arc(x, y, d[9], 0, Math.PI * 2, 0);
				}
			}

		}
		if (!imageDots) {
			if (fillDots) {
				ctx.fill();
			}
			if (strokeDots) {
				ctx.stroke();
			}

			ctx.closePath();
		}
	}
}

//draws a pie chart
function drawPie(ct, x, y, rad, slices, variable, unit, title, drawNames) {
	let tot = 0;
	for (let key in slices) {
		tot += slices[key][variable];
	}
	let sl = [];
	for (let key in slices) {
		sl.push([key, chosenCountries[key], slices[key][variable] / tot, nFormatter(slices[key][variable], 1) + unit])
		if (drawNames) {
			sl[sl.length - 1][3] += " " + key;
		}
		if (!chosenCountries.hasOwnProperty(key)) {
			sl[sl.length - 1][1] = "rgba(0,0,0,0.4)";
		}
	}

	let ang = 0;
	for (let key in sl) {
		let s = sl[key];
		ct.fillStyle = s[1]
		ct.beginPath();
		ct.moveTo(x, y);
		ct.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad)
		ct.arc(x, y, rad, ang, ang + Math.PI * 2 * s[2]);
		ang += Math.PI * 2 * s[2];
		ct.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad);
		ct.closePath();
		ct.fill();

		ct.save();
		/*ct.translate(x+Math.cos(ang - Math.PI*s[2])*rad*1.5,y+Math.sin(ang - Math.PI*s[2])*rad*1.5);
		ct.rotate(Math.abs((ang - Math.PI*s[2]+Math.PI*0.5 +Math.PI*2) % Math.PI));*/

		if (s[2] > 0.05) {

			ct.font = "11px Arial black";
			let wd = ct.measureText(s[3]).width
			ct.strokeStyle = "rgba(0,0,0,0.5)";
			ct.lineWidth = 0.5;
			ct.fillText(s[3], x + Math.cos(ang - Math.PI * s[2]) * rad * 1.6 - wd / 2, y + Math.sin(ang - Math.PI * s[2]) * rad * 1.6)
			ct.strokeText(s[3], x + Math.cos(ang - Math.PI * s[2]) * rad * 1.6 - wd / 2, y + Math.sin(ang - Math.PI * s[2]) * rad * 1.6)
			ct.restore();
		}
	}
	if (title) {
		ct.font = "12px Arial black";
		ct.fillStyle = "rgba(0,0,0,0.8)"
		let wd = ct.measureText(title).width;
		ct.fillText(title, x - wd / 2, y - rad * 2.5)
	}
}

function drawBottomChart() {
	let totYears = endYear - startYear;
	let yearWd = (width - 40 - 40) / totYears;

	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.font = "13px Arial black";
	let wd = ctx.measureText("Export in M$ per year").width
	ctx.fillText("Export in M$ per year", width * 0.5 - wd / 2, height + 100 - 2);


	//horizontal axis
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.moveTo(40, height + 100);
	ctx.lineTo(width - 40, height + 100);

	//vertical axis
	ctx.moveTo(width - 40, height + 100)
	ctx.lineTo(width - 40, height)

	//min and max data ticks
	ctx.moveTo(width - 45, height + 100);
	ctx.lineTo(width - 35, height + 100);
	ctx.moveTo(width - 45, height);
	ctx.lineTo(width - 35, height);

	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 2;
	let max = Math.max(1000, getMax())

	ctx.font = "8px Arial black";
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillText(Math.round(max), width - 30, height)
	ctx.fillText(0, width - 30, height + 100);
	ctx.beginPath();

	//dataticks
	for (let i = 1; i < max / 10000; i++) {
		ctx.moveTo(width - 44, height + 100 - i * 100 / (max / 10000))
		ctx.lineTo(width - 36, height + 100 - i * 100 / (max / 10000))
	}
	for (let i = 1; i < max / 1000; i++) {
		ctx.moveTo(width - 42, height + 100 - i * 100 / (max / 1000))
		ctx.lineTo(width - 38, height + 100 - i * 100 / (max / 1000))
	}
	ctx.stroke();
	ctx.closePath();


	let mHt = 100 / max;
	try {

		for (let key in chosenCountries) {
			let current = 0;
			if (currentYear > startYear - 1) {
				let val2 = 0
				if (currentYearVolumeValues.sellers.hasOwnProperty(currentYear - 1) && currentYearVolumeValues.sellers[currentYear - 1].hasOwnProperty(key)) {
					val2 = currentYearVolumeValues.sellers[currentYear - 1][key].value;
				}
				let nextVal = 0;
				if (currentYearVolumeValues.sellers.hasOwnProperty(currentYear) && currentYearVolumeValues.sellers[currentYear].hasOwnProperty(key)) {
					nextVal = currentYearVolumeValues.sellers[currentYear][key].value
				}

				current = val2 + ticker / ticksPerYear * (nextVal - val2)

				if (current > max) {
					max = current;
					mHt = 100 / max;
				}
			}

			ctx.strokeStyle = chosenCountries[key];
			ctx.beginPath();
			let val = 0;
			if (currentYearVolumeValues.sellers.hasOwnProperty(startYear + 1) && currentYearVolumeValues.sellers[startYear + 1].hasOwnProperty(key)) {
				val = currentYearVolumeValues.sellers[startYear + 1][key].value;
			}
			ctx.moveTo(40, height + 100)
			for (let i = startYear + 2; i < currentYear && i < endYear; i++) {
				if (currentYearVolumeValues.sellers.hasOwnProperty(i) && currentYearVolumeValues.sellers[i].hasOwnProperty(key)) {
					val = currentYearVolumeValues.sellers[i][key].value || 0;
					ctx.lineTo(40 + (i - startYear) * yearWd, height + 100 - val * mHt)

				}
			}

			ctx.lineTo(40 + (currentYear - startYear - 1) * yearWd + ticker / ticksPerYear * yearWd, height + 100 - current * mHt)
			ctx.stroke();

		}
	} catch (e) {
		console.log(e)
		//this is so ugly...
	}
}

//draws a bar chart
//todo: make width/height as input and dont hardcode the dims
function drawBarChart(ct, x, y, rad, slices, variable, unit, title, drawNames) {
	let tot = 0;
	for (let key in slices) {
		if (slices[key][variable] > tot)
			tot = slices[key][variable];
	}
	let sl = [];
	for (let key in slices) {
		sl.push([key, chosenCountries[key], slices[key][variable] / tot, nFormatter(slices[key][variable], 1) + unit])
		if (drawNames) {
			sl[sl.length - 1][3] += " " + key;
		}
		if (!chosenCountries.hasOwnProperty(key)) {
			sl[sl.length - 1][1] = "rgba(0,0,0,0.4)";
		}
	}
	sl.sort(sortByValue)
	let ang = 0;
	for (let key in sl) {
		let s = sl[key];
		ct.fillStyle = s[1];
		ct.fillRect(x, y + 20 + key * 15, s[2] * 100, 14);



		ct.fillStyle = "black";
		ct.font = "10px Arial black";
		let wd = ct.measureText(s[3]).width
		ct.strokeStyle = "rgba(0,0,0,0.5)";
		ct.lineWidth = 0.5;
		ct.fillText(s[3], x, y + key * 15 + 27)
		ct.strokeText(s[3], x, y + key * 15 + 27)


	}
	if (title) {
		ct.font = "12px Arial black";
		ct.fillStyle = "rgba(0,0,0,0.8)"
		let wd = ct.measureText(title).width;
		ct.fillText(title, x + 50 - wd / 2, y)
	}
}

//draws the empty timeline from startYear to endYear
function drawTimeline(ct) {
	ct.lineCap = "round"
	ct.strokeStyle = "rgba(0,0,0,0.4)";
	ct.lineWidth = 4;
	ct.font = "10px Arial black";
	let ht = 40;
	if (showBottomGraph) {
		ht += 100;
	}
	let wd = ct.measureText(1999).width;
	ct.beginPath();
	ct.moveTo(40, height + ht);
	ct.lineTo(width - 40, height + ht);

	ct.moveTo(40, height + (ht - 8));
	ct.lineTo(40, height + (ht + 8));

	ct.fillText(startYear, 40 - 1.5 * wd, height + (ht + 5))

	ct.moveTo(width - 40, height + (ht - 8));
	ct.lineTo(width - 40, height + (ht + 8));

	ct.fillText(endYear, width - 40 + 0.5 * wd, height + (ht + 5))

	let totYears = endYear - startYear;
	let yearWd = (width - 40 - 40) / totYears;

	for (let i = startYear + 1; i < endYear; i++) {
		if (i % 5 == 0) {
			ct.moveTo(40 + (i - startYear) * yearWd, height + (ht - 5));
			ct.lineTo(40 + (i - startYear) * yearWd, height + (ht + 5));
			if (wd < yearWd * 5) {
				ct.fillText(i, 40 + (i - startYear) * yearWd - wd / 2, height + (ht + 20))
			}
		} else {
			ct.moveTo(40 + (i - startYear) * yearWd, height + (ht - 2));
			ct.lineTo(40 + (i - startYear) * yearWd, height + (ht + 2));
		}
	}

	ct.stroke();
}

//draws all bar/pie charts
function drawBarCharts() {
	rctx.textBaseline = "middle";
	lctx.textBaseline = "middle";

	rctx.strokeRect(10, 10, 180, (height + 150) * 0.45)
	rctx.save();
	rctx.translate(30, (height + 150) * 0.25)
	rctx.rotate(-Math.PI * 0.5);
	rctx.fillStyle = "rgba(0,0,0,0.8)";
	rctx.font = "13px Arial black";
	let wd = rctx.measureText("Suppliers").width;
	rctx.fillText("Suppliers", -wd / 2, 0);
	rctx.restore();

	drawPie(rctx, 100, (height + 150) * 0.15, 20, totalVolumeValues.sellers, "value", "", "Total M$ since " + startYear)
	drawPie(rctx, 100, (height + 150) * 0.35, 20, currentYearVolumeValues.sellers[currentYear], "value", "", "M$ in " + currentYear)

	rctx.strokeRect(10, (height + 150) * 0.5 + 10, 180, (height + 150) * 0.45)
	rctx.save();
	rctx.translate(30, (height + 150) * 0.5 + 10 + 0.5 * (height + 150) * 0.45)
	rctx.rotate(-Math.PI * 0.5);
	rctx.fillStyle = "rgba(0,0,0,0.8)";
	rctx.font = "13px Arial black";
	wd = rctx.measureText("Receivers").width;
	rctx.fillText("Receivers", -wd / 2, 0);
	rctx.restore();

	drawBarChart(rctx, 50, (height + 150) * 0.5 + 20, 20, getTop5(totalVolumeValues.receivers, "value"), "value", "", "Total M$ since " + startYear, true)
	drawBarChart(rctx, 50, (height + 150) * 0.75, 20, getTop5(currentYearVolumeValues.receivers[currentYear], "value"), "value", "", "M$ in " + currentYear, true)



	lctx.strokeRect(10, 10, 180, (height + 150) * 0.45)
	lctx.save();
	lctx.translate(200 - 30, (height + 150) * 0.25)
	lctx.rotate(Math.PI * 0.5);
	lctx.fillStyle = "rgba(0,0,0,0.8)";
	lctx.font = "13px Arial black";
	let wd2 = rctx.measureText("Suppliers").width;
	lctx.fillText("Suppliers", -wd2 / 2, 0);
	lctx.restore();


	drawPie(lctx, 100, (height + 150) * 0.15, 20, totalVolumeValues.sellers, "volume", "", "Total vol. since " + startYear)
	drawPie(lctx, 100, (height + 150) * 0.35, 20, currentYearVolumeValues.sellers[currentYear], "volume", "", "Vol. in " + currentYear)


	lctx.strokeRect(10, (height + 150) * 0.5 + 10, 180, (height + 150) * 0.45)
	lctx.save();
	lctx.translate(200 - 30, (height + 150) * 0.5 + 10 + 0.5 * (height + 150) * 0.45)
	lctx.rotate(Math.PI * 0.5);
	lctx.fillStyle = "rgba(0,0,0,0.8)";
	lctx.font = "13px Arial black";
	wd = lctx.measureText("Receivers").width;
	lctx.fillText("Receivers", -wd / 2, 0);
	lctx.restore();

	drawBarChart(lctx, 50, (height + 150) * 0.5 + 20, 20, getTop5(totalVolumeValues.receivers, "volume"), "value", "", "Total vol. since " + startYear, true)
	drawBarChart(lctx, 50, (height + 150) * 0.75, 20, getTop5(currentYearVolumeValues.receivers[currentYear], "volume"), "value", "", "Vol. in " + currentYear, true)
}

//draw the currentYear pointer over timeline.
function drawCurrentYear(ct) {
	if (endYear > currentYear) {
		let ht = 0;
		if (showBottomGraph) {
			ht += 100;
		}
		let totYears = endYear - startYear;
		let yearWd = (width - 40 - 40) / totYears;
		let x = 40 + (currentYear - startYear - 1) * yearWd + yearWd * ticker / ticksPerYear


		ct.font = "15px Arial black";
		ct.fillStyle = "black";
		let wd = ct.measureText(currentYear).width;
		ct.fillText(currentYear, x - wd / 2, height + (ht + 15))
		drawPointer(ct, x, height + (ht + 25));
	}
}

function drawPointer(ct, x, y) {
	ct.beginPath();
	ct.arc(x, y, 7, Math.PI, Math.PI * 2, 0);
	ct.moveTo(x - 7, y);
	ct.lineTo(x, y + 14);
	ct.lineTo(x + 7, y);
	ct.lineTo(x - 7, y);
	ct.closePath();
	ct.fill();
}

function handleMouseMove(e) {
	let rect = bgCanvas.getBoundingClientRect();

	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
	mouseAng = angle(mouseX, mouseY, lastMouseX, lastMouseY);


	lastMouseX = mouseX;
	lastMouseY = mouseY;

	if (!paused) {
		if (mouseX > 50 && mouseX < width - 100) {
			if (mouseY > height + 130 && mouseY < height + 170) {
				ctx.fillStyle = "rgba(0,0,0,0.5)";
				ctx.fillRect(mouseX - 5, height + 135, 10, 10)
			}
		}
	}
}

function nFormatter(num, digits) {
	var si = [{
		value: 1E100,
		symbol: "It's Enough"
	}, {
		value: 1E93,
		symbol: "Tg"
	}, {
		value: 1E90,
		symbol: "NVt"
	}, {
		value: 1E87,
		symbol: "OVt"
	}, {
		value: 1E84,
		symbol: "SVt"
	}, {
		value: 1E81,
		symbol: "sVt"
	}, {
		value: 1E78,
		symbol: "QVt"
	}, {
		value: 1E75,
		symbol: "qVt"
	}, {
		value: 1E72,
		symbol: "TVt"
	}, {
		value: 1E69,
		symbol: "DVt"
	}, {
		value: 1E66,
		symbol: "UVt"
	}, {
		value: 1E63,
		symbol: "Vt"
	}, {
		value: 1E60,
		symbol: "ND"
	}, {
		value: 1E57,
		symbol: "OD"
	}, {
		value: 1E54,
		symbol: "SD"
	}, {
		value: 1E51,
		symbol: "sD"
	}, {
		value: 1E48,
		symbol: "QD"
	}, {
		value: 1E45,
		symbol: "qD"
	}, {
		value: 1E42,
		symbol: "TD"
	}, {
		value: 1E39,
		symbol: "DD"
	}, {
		value: 1E36,
		symbol: "UD"
	}, {
		value: 1E33,
		symbol: "D"
	}, {
		value: 1E30,
		symbol: "N"
	}, {
		value: 1E27,
		symbol: "O"
	}, {
		value: 1E24,
		symbol: "S"
	}, {
		value: 1E21,
		symbol: "s"
	}, {
		value: 1E18,
		symbol: "Q"
	}, {
		value: 1E15,
		symbol: "q"
	}, {
		value: 1E12,
		symbol: "T"
	}, {
		value: 1E9,
		symbol: "B"
	}, {
		value: 1E6,
		symbol: "M"
	}, {
		value: 1E3,
		symbol: "k"
	}],
		i;
	if (num < 0) {
		return "-" + nFormatter((-1 * num), digits);
	}
	for (i = 0; i < si.length; i++) {
		if (num >= si[i].value) {
			if (i == 0) {
				return "It's Enough...";
			}
			if (!digits) {
				return Math.floor(num / si[i].value) + si[i].symbol
			}
			return Math.floor(Math.pow(10, digits) * num / si[i].value) / Math.pow(10, digits) + si[i].symbol;
			//(num / si[i].value).toFixed(digits).replace(/\.?0+$/, "") + si[i].symbol;
		};
	};
	return num;
}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

	let tmpCnv = document.createElement("canvas");
	tmpCnv.id = id;
	tmpCnv.className = className;
	tmpCnv.width = w;
	tmpCnv.height = h;
	tmpCnv.style.marginTop = mT + "px";
	tmpCnv.style.marginLeft = mL + "px";
	tmpCnv.style.left = L + "px";
	tmpCnv.style.top = T + "px";
	if (abs) {
		tmpCnv.style.position = "absolute";
	}
	return tmpCnv;
}

function createDiv(id, className, attrs) {
	let but = document.createElement("div");
	but.id = id;
	but.className = className;

	for (let key in attrs) {
		but[key] = attrs[key];
	}


	return but;
}


function angle(p1x, p1y, p2x, p2y) {

	return Math.atan2(p2y - p1y, p2x - p1x);
}

function Distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}


/*Function from @Scelesto from https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans*/
var generateRandomColors = function (number) {
	if (typeof (arguments[1]) != 'undefined' && arguments[1].constructor == Array && arguments[1][0] && arguments[1][0].constructor != Array) {
		for (var i = 0; i < arguments[1].length; i++) {
			var vals = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(arguments[1][i]);
			arguments[1][i] = [parseInt(vals[1], 16), parseInt(vals[2], 16), parseInt(vals[3], 16)];
		}
	}
	var loadedColors = typeof (arguments[1]) == 'undefined' ? [] : arguments[1],
		number = number + loadedColors.length,
		lastLoadedReduction = Math.floor(Math.random() * 3),
		rgbToHSL = function (rgb) {
			var r = rgb[0],
				g = rgb[1],
				b = rgb[2],
				cMax = Math.max(r, g, b),
				cMin = Math.min(r, g, b),
				delta = cMax - cMin,
				l = (cMax + cMin) / 2,
				h = 0,
				s = 0;
			if (delta == 0) h = 0;
			else if (cMax == r) h = 60 * ((g - b) / delta % 6);
			else if (cMax == g) h = 60 * ((b - r) / delta + 2);
			else h = 60 * ((r - g) / delta + 4);
			if (delta == 0) s = 0;
			else s = delta / (1 - Math.abs(2 * l - 1));
			return [h, s, l]
		},
		hslToRGB = function (hsl) {
			var h = hsl[0],
				s = hsl[1],
				l = hsl[2],
				c = (1 - Math.abs(2 * l - 1)) * s,
				x = c * (1 - Math.abs(h / 60 % 2 - 1)),
				m = l - c / 2,
				r, g, b;
			if (h < 60) {
				r = c;
				g = x;
				b = 0
			} else if (h < 120) {
				r = x;
				g = c;
				b = 0
			} else if (h < 180) {
				r = 0;
				g = c;
				b = x
			} else if (h < 240) {
				r = 0;
				g = x;
				b = c
			} else if (h < 300) {
				r = x;
				g = 0;
				b = c
			} else {
				r = c;
				g = 0;
				b = x
			}
			return [r, g, b]
		},
		shiftHue = function (rgb, degree) {
			var hsl = rgbToHSL(rgb);
			hsl[0] += degree;
			if (hsl[0] > 360) {
				hsl[0] -= 360
			} else if (hsl[0] < 0) {
				hsl[0] += 360
			}
			return hslToRGB(hsl);
		},
		differenceRecursions = {
			differences: [],
			values: []
		},
		fixDifference = function (color) {
			if (differenceRecursions.values.length > 23) {

				var ret = differenceRecursions.values[differenceRecursions.differences.indexOf(Math.max.apply(null, differenceRecursions.differences))];
				differenceRecursions = {
					differences: [],
					values: []
				};
				return ret;
			}
			var differences = [];
			for (var i = 0; i < loadedColors.length; i++) {
				var difference = loadedColors[i].map(function (value, index) {
					return Math.abs(value - color[index])
				}),
					sumFunction = function (sum, value) {
						return sum + value
					},
					sumDifference = difference.reduce(sumFunction),
					loadedColorLuminosity = loadedColors[i].reduce(sumFunction),
					currentColorLuminosity = color.reduce(sumFunction),
					lumDifference = Math.abs(loadedColorLuminosity - currentColorLuminosity),

					differenceRange = Math.max.apply(null, difference) - Math.min.apply(null, difference),
					luminosityFactor = 50,
					rangeFactor = 75;
				if (luminosityFactor / (lumDifference + 1) * rangeFactor / (differenceRange + 1) > 1) {

					differences.push(Math.min(differenceRange + lumDifference, sumDifference));
				}
				differences.push(sumDifference);
			}
			var breakdownAt = 64,
				breakdownFactor = 25,
				shiftByDegrees = 15,
				acceptableDifference = 250,
				breakVal = loadedColors.length / number * (number - breakdownAt),
				totalDifference = Math.min.apply(null, differences);
			if (totalDifference > acceptableDifference - (breakVal < 0 ? 0 : breakVal) * breakdownFactor) {
				differenceRecursions = {
					differences: [],
					values: []
				}
				return color;
			}

			differenceRecursions.differences.push(totalDifference);
			differenceRecursions.values.push(color);
			color = shiftHue(color, shiftByDegrees);
			return fixDifference(color);
		},
		color = function () {
			var scale = function (x) {
				return x * 210 + 300
			},
				randVal = function () {
					return Math.floor(scale(Math.random()))
				},
				luminosity = randVal(),
				red = randVal(),
				green = randVal(),
				blue = randVal(),
				rescale,
				thisColor = [red, green, blue],


				valueToReduce = Math.floor(lastLoadedReduction + 1 + Math.random() * 2.3) % 3,

				valueToIncrease = Math.floor(valueToIncrease + 1 + Math.random() * 2) % 3,
				increaseBy = Math.random() + 1;
			lastLoadedReduction = valueToReduce;
			thisColor[valueToReduce] = Math.floor(thisColor[valueToReduce] / 16);
			thisColor[valueToIncrease] = Math.ceil(thisColor[valueToIncrease] * increaseBy)
			rescale = function (x) {
				return x * luminosity / thisColor.reduce(function (a, b) {
					return a + b
				})
			};
			thisColor = fixDifference(thisColor.map(function (a) {
				return rescale(a)
			}));
			if (Math.max.apply(null, thisColor) > 255) {
				rescale = function (x) {
					return x * 255 / Math.max.apply(null, thisColor)
				}
				thisColor = thisColor.map(function (a) {
					return rescale(a)
				});
			}
			return thisColor;
		};
	for (var i = loadedColors.length; i < number; i++) {
		loadedColors.push(color().map(function (value) {
			return Math.round(value)
		}));
	}

	return loadedColors.map(function (color) {
		var hx = function (c) {
			var h = c.toString(16);
			return h.length < 2 ? '0' + h : h
		}
		return "#" + hx(color[0]) + hx(color[1]) + hx(color[2]);
	});
}

var countryColors = generateRandomColors(20);

for (let i in countryColors) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(countryColors[i]);

	let r = parseInt(result[1], 16);
	let g = parseInt(result[2], 16);
	let b = parseInt(result[3], 16);

	countryColors[i] = "rgba(" + r + "," + g + "," + b + "," + 0.5 + ")";
}

function getCountryColor() {
	let taken = true;
	let color = countryColors[Math.floor(Math.random() * countryColors.length)];
	while (taken) {
		color = countryColors[Math.floor(Math.random() * countryColors.length)];
		taken = false
		for (let key in chosenCountries) {
			if (chosenCountries[key] == color) {
				taken = true;
			}
		}
		if (Object.keys(chosenCountries).length >= countryColors.length) {
			taken = false;
			color = getRandomCountryColor();
		}
	}
	return color;
}

function getRandomCountryColor() {
	return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",0.5)";
}

function openDescription() {
	$("#descriptionDiv").fadeIn();
}
function closeDescription() {
	$("#descriptionDiv").fadeOut();
}

function createSlider(opts) {
	// id, min, max, step, defaultValue, lab, varName, callback
	let id = opts.id;
	let min = opts.min;
	let max = opts.max;
	let step = opts.step;
	let defaultValue = opts.defaultValue;
	let lab = opts.lab;
	let varName = opts.varName;
	let callback = opts.callback || function () { }
	let infoTxt = opts.infoTxt;
	let cont = document.createElement("div");
	cont.className = "sliderDiv";
	let el = document.createElement("input");
	window[varName] = defaultValue;
	el.id = id;
	el.name = id;
	el.type = "range";
	el.min = min;
	el.max = max;
	el.step = step
	el.defaultValue = defaultValue || (min + max) / 2;
	el.setAttribute("list", id + "ticks");
	let label = document.createElement("div");
	label.className = "label"
	label.innerHTML = lab;

	if (infoTxt) {
		let infoDiv = document.getElementById("infoDiv");
		let infoBut = createDiv("infoBut" + id, "infoBut");
		infoBut.innerHTML = "i";
		//let infoSpan = createDiv("infoSpan" + id, "infoSpan");
		//infoSpan.innerHTML = infoTxt

		infoBut.addEventListener("mouseenter", function () {
			infoDiv.innerHTML = opts.infoTxt;
			infoDiv.style.opacity = 1;
		})
		infoBut.addEventListener("mouseleave", function () {
			infoDiv.innerHTML = opts.infoTxt;
			infoDiv.style.opacity = 0;
		})
		//cont.appendChild(infoSpan);
		cont.appendChild(infoBut);
	}

	let dl = document.createElement("datalist");
	dl.id = id + "ticks";

	let opt1 = document.createElement("option");
	opt1.value = min;
	opt1.label = min;
	let opt2 = document.createElement("option");
	opt2.value = (min + max) / 2;
	opt2.label = (min + max) / 2;
	let opt3 = document.createElement("option");
	opt3.value = max;
	opt3.label = max;
	let thumbBubble = document.createElement("div");
	thumbBubble.className = "thumbBubble";
	//thumbBubble.innerHTML = defaultValue;
	thumbBubble.style.width = "100%";
	thumbBubble.style.textAlign = "center";
	let bubSpan = document.createElement("span");
	bubSpan.innerHTML = defaultValue;
	let bubInp = document.createElement("input");
	bubInp.id = id + "Input"
	bubInp.className = "sliderTxtInput"
	bubInp.type = "number";
	bubInp.value = defaultValue;
	bubInp.min = min;
	bubInp.max = max;
	bubInp.step = step;
	bubInp.defaultValue = defaultValue;
	thumbBubble.appendChild(bubSpan)
	thumbBubble.appendChild(bubInp)
	thumbBubble.addEventListener("mouseenter", function () {
		$(thumbBubble).addClass("hovered");
	})
	thumbBubble.addEventListener("mouseleave", function () {
		$(thumbBubble).removeClass("hovered");
	})
	dl.appendChild(opt1);
	dl.appendChild(opt2);
	dl.appendChild(opt3);
	el.onchange = function () {
		bubSpan.innerHTML = parseFloat(el.value)
		window[varName] = parseFloat(el.value);
		bubInp.value = el.value;
		try {
			callback();
		} catch (e) {
			console.log(e)
		}
	}
	el.oninput = function () {
		bubSpan.innerHTML = parseFloat(el.value)
		window[varName] = parseFloat(el.value);
		bubInp.value = el.value;
		try {
			callback();
		} catch (e) {
			console.log(e)
		}
	}
	bubInp.onchange = function () {
		bubSpan.innerHTML = parseFloat(bubInp.value)
		window[varName] = parseFloat(bubInp.value);
		el.value = bubInp.value
		try {
			callback();
		} catch (e) {
			console.log(e)
		}
	}
	bubInp.oninput = function () {
		bubSpan.innerHTML = parseFloat(bubInp.value)
		window[varName] = parseFloat(bubInp.value);
		el.value = bubInp.value
		try {
			callback();
		} catch (e) {
			console.log(e)
		}
	}
	let resetBut = document.createElement("div");
	resetBut.innerHTML = "Reset";
	resetBut.className = "resetBut";
	resetBut.onclick = function () {
		el.value = defaultValue;
		window[varName] = defaultValue;
		bubInp.value = defaultValue
	}
	cont.appendChild(label)
	cont.appendChild(el)
	cont.appendChild(thumbBubble);
	cont.appendChild(dl)
	cont.appendChild(resetBut)
	return {
		div: cont,
		func: function () {
			bubSpan.innerHTML = parseFloat(window[varName])
			el.value = parseFloat(window[varName])
		}
	};
}

function createToggleClick(opts) { //id, label, 

}
function createSwitchClick(opts) { // id, label, choices, chosen, infoTxt
	let cont = createDiv(opts.id, "switchCont")
	let contTitle = createDiv(opts.id + "Title", "contTitle", {
		innerHTML: opts.label
	})
	cont.appendChild(contTitle)
	let choices = [];
	if (opts.infoTxt) {
		let infoDiv = document.getElementById("infoDiv");
		let infoBut = createDiv("infoBut" + opts.id, "infoBut");
		infoBut.innerHTML = "i";
		//let infoSpan = createDiv("infoSpan" + opts.id, "infoSpan");
		//infoSpan.innerHTML = opts.infoTxt

		infoBut.addEventListener("mouseenter", function () {
			infoDiv.innerHTML = opts.infoTxt;
			infoDiv.style.opacity = 1;

		})
		infoBut.addEventListener("mouseleave", function () {
			infoDiv.innerHTML = opts.infoTxt;
			infoDiv.style.opacity = 0;
		})
		//cont.appendChild(infoSpan);
		cont.appendChild(infoBut);
	}
	for (let key in opts.choices) {
		let choice = createDiv(opts.id + key, "switchChoice", {
			innerHTML: opts.choices[key].label,
			onclick: function () {
				for (let kei in opts.choices) {
					window[kei] = false;
					if ($("#" + opts.id + kei).hasClass("chosen")) {
						$("#" + opts.id + kei).removeClass("chosen");
						if (opts.choices[kei].hasOwnProperty("uncallback")) {
							opts.choices[kei].uncallback();
						}
					}
				}
				window[key] = true;
				$(choice).addClass("chosen");
				if (opts.choices[key].hasOwnProperty("callback")) {
					opts.choices[key].callback();
				}
			}
		})

		if (key == opts.chosen) {
			$(choice).addClass("chosen");
		}
		cont.appendChild(choice);
	}

	return cont;
}
