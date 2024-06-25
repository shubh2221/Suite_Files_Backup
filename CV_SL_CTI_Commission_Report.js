/**
 *@NApiVersion 2.1
 *@NModuleScope Public
 *@NScriptType Suitelet
 */
define(['N/log', 'N/ui/serverWidget', 'N/record', 'N/search', 'N/file', 'N/runtime', 'N/format'],
    function (log, serverWidget, record, search, file, runtime, format) {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                var start_date = context.request.parameters.start_date;
                var end_date = context.request.parameters.end_date;
                var sales_emp_id = context.request.parameters.sales_emp_id;
                log.debug('start_date || end_date || 13', formatDate(new Date(start_date)) + ' || ' + formatDate(new Date(end_date)) + ' || ' + sales_emp)
                var sales_emp_param = context.request.parameters.sales_emp;
                start_date = start_date ? formatNSDate(new Date(start_date)) : '';
                end_date = end_date ? formatNSDate(new Date(end_date)) : '';
                log.debug('start_date || end_date || sales_emp', start_date + ' || ' + end_date + ' || ' + sales_emp)
                var form = serverWidget.createForm({
                    title: 'MID Commission Report'
                });
                //  var form = serverWidget.createForm({
                //      title: 'MID Realization Report for IPpay'
                //  });
                var fieldgroup = form.addFieldGroup({
                    id: 'filterfieldgroupid',
                    label: 'Filters'
                });
                form.clientScriptModulePath = 'SuiteScripts/CV_CS_IP_Pay_Report.js';
                var start_date_fld = form.addField({
                    id: 'start_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Start Date',
                    container: 'filterfieldgroupid'
                });
                if (start_date) {
                    start_date_fld.defaultValue = start_date;
                }
                //============== Button Field =====================
                var button_html = `<!DOCTYPE html>
                <html>
                <body>
                <button type="button" style="margin-left: 8px; margin-top: 10px;" onclick="submitFunction()">Submit</button>
                <button type="button" style="margin-left: 8px; margin-top: 10px;" onclick="resetFunction()">Reset</button>
                </body>
                </html>`;
                var htmlField = form.addField({
                    id: "custpage_html",
                    label: "html",
                    type: serverWidget.FieldType.INLINEHTML,
                });
                htmlField.defaultValue = button_html;

                var end_date_fld = form.addField({
                    id: 'end_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'End Date',
                    container: 'filterfieldgroupid'
                });
                end_date_fld.updateBreakType({
                    breakType: serverWidget.FieldBreakType.STARTCOL
                });
                var sales_emp = form.addField({
                    id: 'sales_emp',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sales Rep',
                    source: 'employee',
                    container: 'filterfieldgroupid'
                });
                sales_emp_id ? sales_emp.defaultValue = sales_emp_id : '';
                sales_emp.updateBreakType({
                    breakType: serverWidget.FieldBreakType.STARTCOL
                });
                var sublist = form.addSublist({
                    id: 'sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'List'
                });

                var sales_rep = sublist.addField({
                    id: 'sales_rep',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sales rep',
                    align: serverWidget.LayoutJustification.RIGHT
                });

                var sum_revenue = sublist.addField({
                    id: 'sum_revenue',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sum of Revenue',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_cogs = sublist.addField({
                    id: 'sum_cogs',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sum of COGS',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_rebate = sublist.addField({
                    id: 'sum_rebate',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sum of Total Rebate',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_cc_fee = sublist.addField({
                    id: 'sum_cc_fee',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sum of Credit Card Fees',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_shipping = sublist.addField({
                    id: 'sum_shipping',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sum of Shipping Subsidy',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var document_num = sublist.addField({
                    id: 'document_num',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Sales order',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var egm_fld = sublist.addField({
                    id: 'egm_fld',
                    type: serverWidget.FieldType.TEXT,
                    label: 'EGM $$',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var egm_percent = sublist.addField({
                    id: 'egm_percent',
                    type: serverWidget.FieldType.TEXT,
                    label: 'EGM %',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                if (end_date) {
                    end_date_fld.defaultValue = end_date;
                }
                var data_arr = [];
                var data_arr_rep = [];
                var data_arr_final = [];
                var int_id_arr = [];
                var rev_total = 0, rebt_total = 0, cc_total = 0, cogs_total = 0, egm_total = 0, ship_total = 0;
                if (start_date) {
                    const transactionSearchFilters = [
                        ['posting', 'is', 'T'],
                        'AND',
                        ['subsidiary', 'anyof', '2'],
                        'AND',
                        ['trandate', 'within', start_date, end_date],
                        'AND',
                        ['accounttype', 'anyof', 'Income', 'COGS'],
                        'AND',
                        ['item.type', 'anyof', 'InvtPart', 'NonInvtPart', 'OthCharge', 'Service', 'Kit'],
                        'AND',
                        ['createdfrom.type', 'noneof', 'VendAuth']
                    ];

                    const transactionSearchColREPCOGS = search.createColumn({ name: 'formulatext1', formula: 'CASE WHEN {createdfrom.type}=\'Purchase Order\' THEN {createdfrom.custbody_cti_connect_salesrep} ELSE {custbody_cti_connect_salesrep} END' });
                    const transactionSearchColREPSales = search.createColumn({ name: 'salesrep' });
                    const transactionSearchColTranDate = search.createColumn({ name: 'trandate', sort: search.Sort.ASC });
                    const transactionSearchColEntity = search.createColumn({ name: 'entity' });
                    const transactionSearchColType = search.createColumn({ name: 'type' });
                    const transactionSearchColTranId = search.createColumn({ name: 'tranid', sort: search.Sort.ASC });
                    const transactionSearchColCreatedFrom = search.createColumn({ name: 'createdfrom' });
                    const transactionSearchColLegacyLinkedCreatedFrom = search.createColumn({ name: 'formulatext2', formula: 'CASE WHEN {createdfrom.type}=\'Sales Order\' THEN {createdfrom} WHEN {createdfrom.type}=\'Return Authorization\' THEN {createdfrom} WHEN {createdfrom.type}=\'Purchase Order\' THEN {createdfrom.createdfrom} ELSE {custbody10} END' });
                    const transactionSearchColItemManufacturer = search.createColumn({ name: 'manufacturer', join: 'item' });
                    const transactionSearchColItem = search.createColumn({ name: 'item' });
                    const transactionSearchColItemType = search.createColumn({ name: 'type', join: 'item' });
                    const transactionSearchColQuantity = search.createColumn({ name: 'quantity' });
                    const transactionSearchColSPEUnitRebate = search.createColumn({ name: 'custcol_cnvg_rebate_amnt_per_unit' });
                    const transactionSearchColTotalRebate = search.createColumn({ name: 'formulanumeric3', formula: '{custcol_cnvg_rebate_amnt_per_unit}*{quantity}' });
                    const transactionSearchColRevenue = search.createColumn({ name: 'formulacurrency4', formula: 'CASE WHEN {accounttype} = \'Income\' then {grossamount} else 0 end ' });
                    const transactionSearchColCOGS = search.createColumn({ name: 'formulacurrency5', formula: 'CASE WHEN {accounttype} = \'Cost of Goods Sold\' then {grossamount} else 0 end' });
                    const transactionSearchColCostEstimateType = search.createColumn({ name: 'costestimatetype' });
                    const transactionSearchColEstUnitCost = search.createColumn({ name: 'costestimaterate' });
                    const transactionSearchColEstExtendedCostLine = search.createColumn({ name: 'costestimate' });
                    const transactionSearchColEstGrossProfitLine = search.createColumn({ name: 'estgrossprofit' });
                    const transactionSearchColEstGrossProfitPercentLine = search.createColumn({ name: 'estgrossprofitpct' });
                    const transactionSearchColEstGrossProfitCustom = search.createColumn({ name: 'custcol_cnvg_totalgp_postrebate' });
                    const transactionSearchColInternalId = search.createColumn({ name: 'internalid' });

                    const transactionSearch = search.create({
                        type: 'transaction',
                        filters: transactionSearchFilters,
                        columns: [
                            transactionSearchColREPCOGS,
                            transactionSearchColREPSales,
                            transactionSearchColTranDate,
                            transactionSearchColEntity,
                            transactionSearchColType,
                            transactionSearchColTranId,
                            transactionSearchColCreatedFrom,
                            transactionSearchColLegacyLinkedCreatedFrom,
                            transactionSearchColItemManufacturer,
                            transactionSearchColItem,
                            transactionSearchColItemType,
                            transactionSearchColQuantity,
                            transactionSearchColSPEUnitRebate,
                            transactionSearchColTotalRebate,
                            transactionSearchColRevenue,
                            transactionSearchColCOGS,
                            transactionSearchColCostEstimateType,
                            transactionSearchColEstUnitCost,
                            transactionSearchColEstExtendedCostLine,
                            transactionSearchColEstGrossProfitLine,
                            transactionSearchColEstGrossProfitPercentLine,
                            transactionSearchColEstGrossProfitCustom,
                            transactionSearchColInternalId
                        ],
                    });
                    var searchResultCount = transactionSearch.runPaged().count;
                    log.debug("transactionSearchObj result count", searchResultCount);
                    var rev = 0;
                    var resultSet = transactionSearch.run();
                    var currentRange = resultSet.getRange({
                        start: 0,
                        end: 1000
                    });

                    var i = 0;  // iterator for all search results
                    var j = 0;  // iterator for current result range 0..999

                    while (j < currentRange.length) {
                        // .run().each has a limit of 4,000 results
                        var result = currentRange[j];
                        // log.debug("Date", result.getValue(transactionSearchColTranDate) + ' || ' + result.getText(transactionSearchColREPSales));
                        var sales_rep = result.getValue(transactionSearchColREPCOGS) ? result.getValue(transactionSearchColREPCOGS) : result.getText(transactionSearchColREPSales);
                        // log.debug('sales_rep || sales_emp_param 148', sales_rep + ' || ' + sales_emp_param);
                        if (sales_rep) {
                            if (sales_rep == sales_emp_param) {
                                rev += Number(revenue_val);
                                var revenue_val = result.getValue(transactionSearchColRevenue);
                                var trx_type = result.getValue(transactionSearchColType);
                                var cogs_val = result.getValue(transactionSearchColCOGS);
                                // var sales_ord = 
                                var cc_fee = trx_type == 'cashsale' ? (Number(revenue_val) * 0.03) : 0;
                                // var ship_subsidiary = 
                                var rebate_val = result.getValue(transactionSearchColTotalRebate);
                                var doc_num = result.getValue(transactionSearchColLegacyLinkedCreatedFrom) ? result.getValue(transactionSearchColLegacyLinkedCreatedFrom) : (trx_type == 'invoice' || trx_type == 'creditmemo' || trx_type == 'cashsale' || trx_type == 'customerrefund') ? result.getValue(transactionSearchColCreatedFrom) : result.getValue(transactionSearchColTranId);
                                var int_id = result.getValue(transactionSearchColInternalId);
                                var data_obj = {
                                    'sales_rep': sales_rep,
                                    'revenue_val': revenue_val,
                                    'cogs_val': cogs_val,
                                    // 'sales_ord': sales_ord,
                                    'cc_fee': cc_fee,
                                    // 'ship_subsidiary': ship_subsidiary,
                                    'rebate_val': rebate_val,
                                    'doc_num': doc_num,
                                    'int_id': int_id
                                }
                                data_arr_rep.push(data_obj);
                                int_id_arr.push(int_id);
                            } else {
                                rev += Number(revenue_val);
                                var revenue_val = result.getValue(transactionSearchColRevenue);
                                var trx_type = result.getValue(transactionSearchColType);

                                var cogs_val = result.getValue(transactionSearchColCOGS);
                                // var sales_ord = 
                                var cc_fee = (trx_type == 'cashsale') ? (Number(revenue_val) * 0.03) : 0;
                                // var ship_subsidiary = 
                                var rebate_val = result.getValue(transactionSearchColTotalRebate);
                                var doc_num = result.getValue(transactionSearchColLegacyLinkedCreatedFrom) ? result.getValue(transactionSearchColLegacyLinkedCreatedFrom) : (trx_type == 'invoice' || trx_type == 'creditmemo' || trx_type == 'cashsale' || trx_type == 'customerrefund') ? result.getValue(transactionSearchColCreatedFrom) : result.getValue(transactionSearchColTranId);
                                var int_id = result.getValue(transactionSearchColInternalId);
                                var data_obj = {
                                    'sales_rep': sales_rep,
                                    'revenue_val': revenue_val,
                                    'cogs_val': cogs_val,
                                    // 'sales_ord': sales_ord,
                                    'cc_fee': cc_fee,
                                    // 'ship_subsidiary': ship_subsidiary,
                                    'rebate_val': rebate_val,
                                    'doc_num': doc_num,
                                    'int_id': int_id
                                }
                                data_arr.push(data_obj);
                                int_id_arr.push(int_id);
                            }
                        }
                        i++; j++;
                        if (j == 1000) {   // check if it reaches 1000
                            j = 0;          // reset j an reload the next portion
                            currentRange = resultSet.getRange({
                                start: i,
                                end: i + 1000
                            });
                        }
                        // });
                    }

                    if (sales_emp_param) {
                        data_arr_final = data_arr_rep;
                    } else {
                        data_arr_final = data_arr;
                    }
                    log.debug('data_arr_final', data_arr_final);
                    var ship_data_arr = [];
                    const shiptransactionSearchFilters = [
                        ['custbody_cnvg_subsidize_shipping', 'is', 'T'],
                        'AND',
                        ['subsidiary', 'anyof', '2'],
                        'AND',
                        ['mainline', 'is', 'T'],
                        'AND',
                        ['type', 'anyof', 'CustInvc', 'CashSale'],
                        'AND',
                        ['trandate', 'within', start_date, end_date],
                        "AND",
                        ["internalid", "anyof", int_id_arr]
                    ];

                    const shiptransactionSearchColSalesRep = search.createColumn({ name: 'salesrep' });
                    const shiptransactionSearchColTranDate = search.createColumn({ name: 'trandate' });
                    const shiptransactionSearchColEntity = search.createColumn({ name: 'entity' });
                    const shiptransactionSearchColTranId = search.createColumn({ name: 'tranid' });
                    const shiptransactionSearchColCreatedFrom = search.createColumn({ name: 'createdfrom' });
                    const shiptransactionSearchColSalesOrder = search.createColumn({ name: 'salesorder' });
                    const shiptransactionSearchColItem = search.createColumn({ name: 'item' });
                    const shiptransactionSearchColQuantity = search.createColumn({ name: 'quantity' });
                    const shiptransactionSearchColSubsidizedShipping = search.createColumn({ name: 'custbody_cnvg_sub_ship_per' });
                    const shiptransactionSearchColShippingCost = search.createColumn({ name: 'shippingcost' });
                    const shiptransactionSearchColShipVia = search.createColumn({ name: 'shipmethod' });
                    const shiptransactionSearchColInternalId = search.createColumn({ name: 'internalid' });
                    const shiptransactionSearch = search.create({
                        type: 'transaction',
                        filters: shiptransactionSearchFilters,
                        columns: [
                            shiptransactionSearchColSalesRep,
                            shiptransactionSearchColTranDate,
                            shiptransactionSearchColEntity,
                            shiptransactionSearchColTranId,
                            shiptransactionSearchColCreatedFrom,
                            shiptransactionSearchColSalesOrder,
                            shiptransactionSearchColItem,
                            shiptransactionSearchColQuantity,
                            shiptransactionSearchColSubsidizedShipping,
                            shiptransactionSearchColShippingCost,
                            shiptransactionSearchColShipVia,
                            shiptransactionSearchColInternalId
                        ],
                    });

                    shiptransactionSearch.run().each(function (result) {
                        ship_data_arr.push({
                            'int_id': result.getValue(shiptransactionSearchColInternalId),
                            'ship_fee': result.getValue(shiptransactionSearchColShippingCost)
                        })
                    });
                    var concat_arr = data_arr_final.concat(ship_data_arr);
                    let res = {};
                    concat_arr.forEach(a => res[a.int_id] = { ...res[a.int_id], ...a });
                    res = Object.values(res);
                    data_arr_final = res;
                    if (data_arr_final.length > 0) {
                        var sessionObj = runtime.getCurrentSession(); //sessionObj is a runtime.Session object
                        sessionObj.set({
                            name: runtime.getCurrentUser().id,
                            value: JSON.stringify(data_arr_final)
                        });

                        for (var d = 0; d < data_arr_final.length; d++) {
                            var curr_element = data_arr_final[d];
                            // var sales_rep_final = curr_element.sales_rep ? (curr_element.sales_rep) : ' ';
                            var sum_revenue_final = curr_element.revenue_val ? (curr_element.revenue_val) : 0;
                            var sum_cogs_final = curr_element.cogs_val ? (curr_element.cogs_val) : 0;
                            var sum_rebate_final = curr_element.rebate_val ? (curr_element.rebate_val) : 0;
                            var sum_cc_fee_final = curr_element.cc_fee ? (curr_element.cc_fee) : 0;
                            var sum_shipping_final = curr_element.ship_fee ? (curr_element.ship_fee) : 0;
                            var egm_final = (Number(sum_revenue_final) + Number(sum_rebate_final)) - (Number(sum_cogs_final) + Number(sum_cc_fee_final) + Number(sum_shipping_final));
                            log.debug('egm_final', egm_final);
                            sublist.setSublistValue({
                                id: 'sales_rep',
                                line: d,
                                value: curr_element.sales_rep ? (curr_element.sales_rep) : ' '
                            });
                            sublist.setSublistValue({
                                id: 'sum_revenue',
                                line: d,
                                value: sum_revenue_final
                            });
                            sublist.setSublistValue({
                                id: 'sum_cogs',
                                line: d,
                                value: sum_cogs_final
                            });
                            sublist.setSublistValue({
                                id: 'sum_rebate',
                                line: d,
                                value: sum_rebate_final
                            });
                            sublist.setSublistValue({
                                id: 'sum_cc_fee',
                                line: d,
                                value: sum_cc_fee_final
                            });
                            sublist.setSublistValue({
                                id: 'sum_shipping',
                                line: d,
                                value: sum_shipping_final
                            });
                            sublist.setSublistValue({
                                id: 'document_num',
                                line: d,
                                value: curr_element.doc_num ? (curr_element.doc_num) : ' '
                            });
                            sublist.setSublistValue({
                                id: 'egm_fld',
                                line: d,
                                value: (Number(sum_revenue_final) + Number(sum_rebate_final)) - (Number(sum_cogs_final) + Number(sum_cc_fee_final) + Number(sum_shipping_final))
                            });
                            sublist.setSublistValue({
                                id: 'egm_percent',
                                line: d,
                                value: ((egm_final > 0) && isFinite((Number(egm_final) / Number(sum_revenue_final)).toFixed(2) * 100)) ? (Number(egm_final) / Number(sum_revenue_final)).toFixed(2) * 100 + '%' : 0 + '%'
                            });
                            log.debug('(Number(sum_revenue_final) + Number(sum_rebate_final)) - (Number(sum_cogs_final) + Number(sum_cc_fee_final) + Number(sum_shipping_final))', (Number(sum_revenue_final) + Number(sum_rebate_final)) - (Number(sum_cogs_final) + Number(sum_cc_fee_final) + Number(sum_shipping_final)));
                            //========================================== 
                            rev_total = curr_element.revenue_val ? rev_total + Number(curr_element.revenue_val) : rev_total + 0;
                            cc_total = curr_element.cc_fee ? cc_total + Number(curr_element.cc_fee) : cc_total + 0;
                            rebt_total = curr_element.rebate_val ? rebt_total + Number(curr_element.rebate_val) : rebt_total + 0;
                            cogs_total = curr_element.cogs_val ? cogs_total + Number(curr_element.cogs_val) : cogs_total + 0;
                            egm_total += (Number(sum_revenue_final) + Number(sum_rebate_final)) - (Number(sum_cogs_final) + Number(sum_cc_fee_final) + Number(sum_shipping_final));
                            ship_total = curr_element.ship_fee ? ship_total + Number(curr_element.ship_fee) : ship_total + 0;
                        }

                        //---------------- Total line ----------------
                        sublist.setSublistValue({
                            id: 'sales_rep',
                            line: data_arr_final.length,
                            value: 'Total'
                        });
                        sublist.setSublistValue({
                            id: 'sum_revenue',
                            line: data_arr_final.length,
                            value: rev_total.toFixed(2)
                        });
                        sublist.setSublistValue({
                            id: 'sum_cogs',
                            line: data_arr_final.length,
                            value: cogs_total.toFixed(2)
                        });
                        sublist.setSublistValue({
                            id: 'sum_rebate',
                            line: data_arr_final.length,
                            value: rebt_total.toFixed(2)
                        });
                        sublist.setSublistValue({
                            id: 'sum_cc_fee',
                            line: data_arr_final.length,
                            value: cc_total.toFixed(2)
                        });
                        sublist.setSublistValue({
                            id: 'sum_shipping',
                            line: data_arr_final.length,
                            value: ship_total
                        });
                        sublist.setSublistValue({
                            id: 'document_num',
                            line: data_arr_final.length,
                            value: ' '
                        });
                        sublist.setSublistValue({
                            id: 'egm_fld',
                            line: data_arr_final.length,
                            value: Number(egm_total).toFixed(2)
                        });
                        sublist.setSublistValue({
                            id: 'egm_percent',
                            line: data_arr_final.length,
                            value: ((Number(egm_total) / Number(rev_total)).toFixed(2)) * 100 + '%'
                        });
                    }
                }
                // var file_content = 'Sales Rep, Revenue, COGS, Credit Card Fee,	Rebate, Sales Order' + '\n';
                // for (var f = 0; f < data_arr.length; f++) {
                //     var curt_element = data_arr[f];
                //     file_content += curt_element.sales_rep + ',' + curt_element.revenue_val + ',' + curt_element.cogs_val + ',' + curt_element.cc_fee + ',' + curt_element.rebate_val + ',' + curt_element.doc_num + '\n';
                // }
                form.addSubmitButton({
                    label: 'Export'
                });
                context.response.writePage(form);
            } else {
                try {
                    var sessionObj = runtime.getCurrentSession(); //sessionObj is a runtime.Session object
                    var storedUserData = sessionObj.get({ name: runtime.getCurrentUser().id });
                    log.debug('storedUserData', storedUserData);
                    var data_arr = JSON.parse(storedUserData);
                    var file_content = 'Sales Rep, Revenue, COGS, Credit Card Fee,	Rebate, Sales Order , EGM $$, EGM %' + '\n';
                    for (var f = 0; f < data_arr.length; f++) {
                        var curt_element = data_arr[f];
                        var sum_revenue_final = curt_element.revenue_val ? (curt_element.revenue_val) : 0;
                        var sum_cogs_final = curt_element.cogs_val ? (curt_element.cogs_val) : 0;
                        var sum_rebate_final = curt_element.rebate_val ? (curt_element.rebate_val) : 0;
                        var sum_cc_fee_final = curt_element.cc_fee ? (curt_element.cc_fee) : 0;
                        var sum_shipping_final = curt_element.vol_feb ? (curt_element.vol_feb) : 0;
                        var egm_final = (Number(sum_revenue_final) + Number(sum_rebate_final)) - (Number(sum_cogs_final) + Number(sum_cc_fee_final) + Number(sum_shipping_final));
                        var egm_per = ((egm_final > 0) && isFinite((Number(egm_final) / Number(sum_revenue_final)).toFixed(2) * 100)) ? (Number(egm_final) / Number(sum_revenue_final)).toFixed(2) * 100 + '%' : 0 + '%';
                        file_content += curt_element.sales_rep + ',' + curt_element.revenue_val + ',' + curt_element.cogs_val + ',' + curt_element.cc_fee + ',' + curt_element.rebate_val + ',' + curt_element.doc_num + ',' + egm_final + ',' + egm_per + '\n';
                    }

                    var file_obj = file.create({
                        name: 'MID Commission Report.csv',
                        fileType: file.Type.CSV,
                        contents: file_content
                    });

                    context.response.writeFile({
                        file: file_obj,
                        isInline: false
                    });
                    context.response.writeFile(file_obj);
                } catch (error) {
                    log.debug('error post', error);
                }
            }
        }
        function formatDate(date) {
            return format.format({ value: date, type: format.Type.DATE })
        }
        function parsedDate(date) {
            return format.parse({
                value: formatDate(date),
                type: format.Type.DATE
            })
        }
        function zeroPad(num, len) {
            var str = num.toString();
            while (str.length < len) { str = '0' + str; }
            return str;
        }

        // function to format date object into NetSuite's mm/dd/yyyy format.
        function formatNSDate(dateObj) {
            if (dateObj) {
                var nsFormatDate = zeroPad(dateObj.getMonth() + 1, 2) + '/' + zeroPad(dateObj.getDate(), 2) + '/' + dateObj.getFullYear();
                return nsFormatDate;
            }
            return null;
        }
        return {
            onRequest: onRequest
        };
    });