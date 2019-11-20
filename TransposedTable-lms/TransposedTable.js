define(["jquery"], function($) {
    var qscPaintCounter = 0;
    var qscStyleCounter = 0;
    if (!qscPaintCounter) {
        $("<style>").html("/* Pivot/Transpose Table Embedded Styles */ \
		tr {height:1.2em} \
		.thead {padding-top:10px; padding-bottom:10px; text-align:center; ;} \
		.label {text-align:left; white-space:nowrap} \
		.value {text-align:right; padding-right:5px; padding-top:1px; padding-bottom:1px;} \
		.thead_b {border:1px solid silver;padding-top:10px; padding-bottom:10px; text-align:center; ;} \
		.label_b {border:1px solid silver;text-align:left; white-space:nowrap} \
		.value_b {border:1px solid silver;text-align:right; padding-right:5px; padding-top:1px; padding-bottom:1px;} \
        ").appendTo("head");
    }
    return {
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 100,
                    qHeight: 100
                }],
                title: "/title"
            },
            chartType: "BarChart"
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1,
                    max: 4
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 80,
					items: {
						indentLevel: {
							type: "string",
							component: "dropdown",
							label: "Indent Level",
							ref: "qDef.myOptions.indentLevel",
							defaultValue: "0",
							options: [{
								value: "0",
								label: "0",
								tooltip: "Zero"
							}, {
								value: "1",
								label: "1",
								tooltip: "One"
							}, {
								value: "2",
								label: "2",
								tooltip: "Two"
							}, {
								value: "3",
								label: "3",
								tooltip: "Three"
							}, {
								value: "4",
								label: "4",
								tooltip: "Four"
							}]
						},
						showBold: {
							type: "boolean",
							label: "Bold text",
							ref: "qDef.myOptions.showBold",
							defaultValue: !1
						},
						showItalic: {
							type: "boolean",
							label: "Italic text",
							ref: "qDef.myOptions.showItalic",
							defaultValue: !1
						},
						backColor: {
							type: "string",
							ref: "qDef.myOptions.backColor",
							label: "Background color",
							expression: "always",
							defaultValue: "#ffffff"
						}
					}
                },
                sorting: {
                    uses: "sorting"
                },
				settings: {
					uses: "settings",
					items: {
						Venn: {
							type: "items",
							label: "Display formatting",
							items: {
								labelColHead: {
									type: "string",
									ref: "labelColHead",
									label: "Label column header",
									expression: "always",
									defaultValue: "Description"
								},
								headBackColor: {
									type: "string",
									ref: "headBackColor",
									label: "Header background color",
									expression: "always",
									defaultValue: "#1a5482"
								},
								headTextColor: {
									type: "string",
									ref: "headTextColor",
									label: "Header text color",
									expression: "always",
									defaultValue: "#ffffff"
								},
								formatAll: {
									type: "string",
									component: "dropdown",
									label: "Format all values",
									ref: "formatAll",
									defaultValue: "0",
									options: [{
										value: "0",
										label: "None",
										tooltip: "No global formatting"
									}, {
										value: "1",
										label: "Comma",
										tooltip: "Comma format values"
									}]
								},
								hideDecimals: {
									type: "string",
									component: "dropdown",
									label: "Hide Decimals",
									ref: "hideDecimals",
									defaultValue: "0",
									options: [{
										value: "0",
										label: "Decimals displayed",
										tooltip: "Decimals displayed"
									}, {
										value: "1",
										label: "Decimals rounded",
										tooltip: "Decimals hidden (rounded)"
									}]
								},
								posTextColor: {
									type: "string",
									ref: "posTextColor",
									label: "Positive value color",
									expression: "always",
									defaultValue: "#333333"
								},
								negTextColor: {
									type: "string",
									ref: "negTextColor",
									label: "Negative value color",
									expression: "always",
									defaultValue: "#333333"
								},
								showBorder: {
									type: "boolean",
									label: "Show table borders",
									ref: "qBorderOn",
									defaultValue: false
								},
								qTotals: {
									type: "boolean",
									label: "Totals *Note: disabled in code*",
									ref: "qTotalOn",
									defaultValue: false
								}
							}
						}
					}
				}
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },

        paint: function($element, layout) {
			//output contents of JSON returned by Qlik to the console for debugging
			//console.log(layout)

			var stored = {};
            var currentTableQvid = layout.qInfo.qId;
            if ($("#qsc-pivot-table-body-" + currentTableQvid + "").length) {
                var pliableTable = null;
                var tempMasterArray = null; //Master temp array
                var measureCount = null;
                var dimensionTitle = null;
                $('body').off('resize', stored.sizeTableWrapper);
            }
            $element.hide();
            $('table').hide();
            $element.html('');

            $element.html('<table id="qsc-table-' + currentTableQvid + '" class="qsc-pivot-table responsive" ><tbody id="qsc-pivot-table-body-' + currentTableQvid + '"></tbody></table>');
            var pliableTable = document.getElementById("qsc-pivot-table-body-" + currentTableQvid + "");
            var transposeThisTable = layout.qTransposeTable;
            var tempMasterArray = [];
            var measureCount = this.backendApi.getMeasureInfos().length;
            var dimensionTitle = this.backendApi.getDimensionInfos()[0].qFallbackTitle;
			//determine whether to display border styles
			if (layout.qBorderOn){
				border = '_b'
			}
			else{
				border = ''
			}

			//function to format numbers as comma separated
            var commaSeparate = function(totsTikr) {
                if (totsTikr < 0) {
                    totsTikr = totsTikr * -1;
                    putInParens = true;
                } else {
                    putInParens = false;
                }
                while (/(\d+)(\d{3})/.test(totsTikr.toString())) {
                    totsTikr = totsTikr.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                }
                if (putInParens) {
                    return ("(" + totsTikr + ")");
                } else {
                    return totsTikr;
                }
            };

			//Function to round values to a given precision
			var roundNum = function round(value, precision) {
				var multiplier = Math.pow(10, precision || 0);
				value = Math.round(value * multiplier) / multiplier;
				return value.toFixed(precision);
			};


			var dimTitle = "";
            var innerArrayCntr = this.backendApi.getMeasureInfos().length + 1;

            //Build arrays of labels for first column of table
			//----------------------------------------------------------------------------------------------------------
            for (var addPlaceHolders = 0; addPlaceHolders < innerArrayCntr; addPlaceHolders++) {
                tempMasterArray.push(new Array());
				//Dimension Row  - use the configured value for first column header
				if (addPlaceHolders == 0) {
					tempMasterArray[addPlaceHolders].push(layout.labelColHead);
				}
				//Measure Row
				else {
					tempMasterArray[addPlaceHolders].push(this.backendApi.getMeasureInfos()[(addPlaceHolders - 1)].qFallbackTitle);
				}
            }

            //Build temp arrays, each array corresponds to one measure and will be used to make html table rows
			//----------------------------------------------------------------------------------------------------------
            this.backendApi.eachDataRow(function(key, row) {
                qscCellCnt = 0;
                for (var qscCells = row.length; qscCellCnt < qscCells; qscCellCnt++) {
					if (qscCellCnt == 0) {
						tempMasterArray[qscCellCnt].push((dimTitle + " " + row[qscCellCnt].qText)); //Dimension values + titles as first temp array
					} else {
						//get formatting for the expression so we can skip formatting for ratios
						try {
							fmt = layout.qHyperCube.qMeasureInfo[qscCellCnt-1].qNumFormat.qFmt;
						}
						catch(err){
							//do nothing
						}
						//check for no format or Auto (Auto seems to be 14 hash character)
						if(typeof(fmt)=='undefined' || fmt=='##############'){
							fmt=''
						}

						//if no number returned then put a blank in the array
						if(row[qscCellCnt].qNum=='NaN'){
							cellValue = ""
						}
						//check for a calculated ratio column based on % in title and dont format those
						else if (row[0].qText.indexOf('%') >= 0){
							cellValue = roundNum(parseFloat(row[qscCellCnt].qText)*100, 1)
							cellValue = commaSeparate(cellValue) + '%'
						}
						//if a format is given then skip formatting
						else if(fmt.length>0){
							cellValue = row[qscCellCnt].qText
						}
						//apply the global formatting based on chart config
						else{
							//rounding logic
							if (layout.hideDecimals==1){
								cellValue = roundNum(parseFloat(row[qscCellCnt].qText), 0)
							}
							else{
								cellValue = row[qscCellCnt].qText
							}
							//formatting logic
							if (layout.formatAll==1){
								cellValue = commaSeparate(cellValue)
							}
						}
						//push the final value into the array
						tempMasterArray[qscCellCnt].push(cellValue);
					}
                }
            });
            var totalsArr = [];
            var sumItAllUp = 0;
            var summer = 0;
            var putInParens = false;

            stored.sizeTableWrapper = function() {
                var tableHeight = $('.qsc-pivot-table').outerHeight();
                $('#table-on-bottom').css({
                    'height': tableHeight + 26,
                });

                if ($('#table-on-bottom').outerWidth() < $('#qsc-table-' + currentTableQvid + '').outerWidth()) {
                    $('#table-on-bottom').css({
                        'overflow-x': 'scroll'
                    });
                } else {
                    $('#table-on-bottom').css({
                        'overflow-x': 'visible'
                    });
                }
            };

            var makeHeader = false; //option to disable table header

			//Build each row of the table from the matrix data created from Sense Hypercube columns
			//----------------------------------------------------------------------------------------
            for (var bldraLen = tempMasterArray.length, bldra = 0; bldra < bldraLen; bldra++) {
                //Make html table row
                var qscRowHtml = document.createElement('tr');
                for (var bldrbLen = tempMasterArray[bldra].length, bldrb = 0; bldrb < bldrbLen; bldrb++) {
                    var qscCellHtml = document.createElement('td');

                    //Make html table column
                    qscCellHtml.innerHTML = tempMasterArray[bldra][bldrb];
					if(bldra==0){
						if(bldrb==0){
							qscCellHtml.className = "label"+border;
							qscCellHtml.style.paddingLeft = "5px";
						}
						else{
							qscCellHtml.className = "thead"+border;
						}
					}
					else {
 						//set indentation only for first column
						if (bldrb==0){
							qscCellHtml.className = "label"+border;
							//changes made below for stupid IE11 compatibility
							qscCellHtml.style.paddingRight = "3px";
							qscCellHtml.style.paddingLeft = parseInt(parseInt(layout.qHyperCube.qMeasureInfo[bldra-1].myOptions.indentLevel * 10) + parseInt(5)) + "px";
						}
						else{
							qscCellHtml.className = "value"+border;
							qscCellHtml.style.paddingRight = "2px";
							qscCellHtml.style.paddingLeft = "5px";
						}
                        //Issue #9 set font color
                        qscCellHtml.style.color = layout.posTextColor;
                        if(tempMasterArray[bldra][bldrb].substring(0, 1) == '(' || tempMasterArray[bldra][bldrb].substring(0, 1) == '-'){
                            qscCellHtml.style.color = layout.negTextColor;
                        }
					}
                    qscRowHtml.appendChild(qscCellHtml);
                }
                qscCellHtml = null;

				//no idea what the next bit is checking for.....
                if (typeof pliableTable === "undefined" || pliableTable == null) {
                    return;
                }

				//Set the table row formatting based on measure configuration
				//----------------------------------------------------------------------
				if(bldra==0){
					qscRowHtml.className = "thead";
					//changes made below for stupid IE11 compatibility
					qscRowHtml.style.backgroundColor = layout.headBackColor
					qscRowHtml.style.color = layout.headTextColor
					qscRowHtml.style.fontWeight = 'bold'
				}
				else{
					qscRowHtml.className = "qsc-tbl-row-" + bldra;
					//set bold text or not
					if(layout.qHyperCube.qMeasureInfo[bldra-1].myOptions.showBold){
						fontWeight = 'bold'
					}
					else{
						fontWeight = 'normal'
					}
					//set italic text or not
					if(layout.qHyperCube.qMeasureInfo[bldra-1].myOptions.showItalic){
						fontStyle = 'italic'
					}
					else{
						fontStyle = 'normal'
					}
					rowColor = layout.qHyperCube.qMeasureInfo[bldra-1].myOptions.backColor;
					//changes made below for stupid IE11 compatibility
					qscRowHtml.style.backgroundColor = rowColor
					qscRowHtml.style.fontWeight = fontWeight
					qscRowHtml.style.fontStyle = fontStyle
				}

                pliableTable.appendChild(qscRowHtml);
            }
            tempMasterArray = null;
            qscRowHtml = null;
            pliableTable = null;
            qscPaintCounter++;

            $element.show();
            $('table').show();

            var suffix = " - Qlik Sense",
                weAreInSense = document.title.indexOf(suffix, document.title.length - suffix.length) !== -1;
            if (weAreInSense) {
                $element[0].style.overflowX = "scroll";
                $element[0].style.overflowY = "scroll";
            } else {
                stored.sizeTableWrapper();
                $('body').on('resize', stored.sizeTableWrapper);
            }

			console.log($element[0].innerHTML)
        }
    };
});
