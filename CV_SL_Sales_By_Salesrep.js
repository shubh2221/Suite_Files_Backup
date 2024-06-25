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
                var form = serverWidget.createForm({
                    title: 'SALES By SALES REP'
                });
                var fieldgroup = form.addFieldGroup({
                    id: 'filterfieldgroupid',
                    label: 'Filters'
                });
                var start_date_fld = form.addField({
                    id: 'start_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Start Date',
                    container: 'filterfieldgroupid'
                });
                if (start_date) {
                    start_date_fld.defaultValue = start_date;
                }
                var end_date_fld = form.addField({
                    id: 'end_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'End Date',
                    container: 'filterfieldgroupid'
                });
                var sales_emp = form.addField({
                    id: 'sales_emp',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Sales Rep',
                    source: 'employee',
                    container: 'filterfieldgroupid'
                });
                // sales_emp_id ? sales_emp.defaultValue = sales_emp_id : '';
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

                var sum_total_amount = sublist.addField({
                    id: 'sum_total_amount',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Total Amount',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_total_cost = sublist.addField({
                    id: 'sum_total_cost',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Total Cost',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_total_rebate = sublist.addField({
                    id: 'sum_total_rebate',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Total Rebate',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_margin = sublist.addField({
                    id: 'sum_margin',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Margin $',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                var sum_margin_percent = sublist.addField({
                    id: 'sum_margin_percent',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Margin %',
                    align: serverWidget.LayoutJustification.RIGHT
                });
                if (end_date) {
                    end_date_fld.defaultValue = end_date;
                }

                // ======================= Saved Search ==========================

                const transactionSearchFilters = [
                    ['type', 'anyof', 'CustCred', 'CustInvc', 'CashSale'],
                    'AND',
                    ['subsidiary', 'anyof', '2'],
                    'AND',
                    ['taxline', 'is', 'F'],
                    'AND',
                    ['cogs', 'is', 'F'],
                    'AND',
                    ['shipping', 'is', 'F'],
                    // 'AND',
                    // ['internalid', 'anyof', '805957'],
                    'AND',
                    ['formulanumeric: CASE WHEN {quantity}*{rate}={amount} THEN 1 ELSE 0 END', 'equalto', '1'],
                ];

                const transactionSearchColSalesRep = search.createColumn({ name: 'salesrep' });
                const transactionSearchColType = search.createColumn({ name: 'type' });
                const transactionSearchColTotalRebate = search.createColumn({ name: 'formulanumeric1', formula: '{custcol_cnvg_rebate_amnt_per_unit}*{quantity}' });
                const transactionSearchColAmount = search.createColumn({ name: 'amount' });
                const transactionSearchColFormulaNumericLFJWK = search.createColumn({ name: 'formulanumeric2', formula: '{total}' });
                const transactionSearchColInternalId = search.createColumn({ name: 'internalid' });

                const transactionSearch = search.create({
                    type: 'transaction',
                    filters: transactionSearchFilters,
                    columns: [
                        transactionSearchColSalesRep,
                        transactionSearchColType,
                        transactionSearchColTotalRebate,
                        transactionSearchColAmount,
                        transactionSearchColFormulaNumericLFJWK,
                        transactionSearchColInternalId
                    ],
                });
                const transactionSearchPagedData = transactionSearch.runPaged({ pageSize: 1000 });
                var resultSet = transactionSearch.run();
                var currentRange = resultSet.getRange({
                    start: 0,
                    end: 1000
                });
                var i = 0;  // iterator for all search results
                var j = 0;  // iterator for current result range 0..999
                var data_arr = [];
                while (j < currentRange.length) {
                    var result = currentRange[j];
                    var data_obj = {
                        int_id: result.getValue(transactionSearchColInternalId),
                        sales_rep: result.getValue(transactionSearchColSalesRep),
                        trx_type: result.getValue(transactionSearchColType),
                        total_amount: result.getValue(transactionSearchColAmount),
                        trx_total: result.getValue(transactionSearchColFormulaNumericLFJWK),
                        total_rebate: result.getValue(transactionSearchColTotalRebate),
                        // margin_amt: 0,
                        // margin_percent: 0
                    }
                    data_arr.push(data_obj);
                    i++; j++;
                    if (j == 1000) {   // check if it reaches 1000
                        j = 0;          // reset j an reload the next portion
                        currentRange = resultSet.getRange({
                            start: i,
                            end: i + 1000
                        });
                    }
                }
                log.debug('data_arr', data_arr);
            };
        }

        return {
            onRequest: onRequest
        };
    });