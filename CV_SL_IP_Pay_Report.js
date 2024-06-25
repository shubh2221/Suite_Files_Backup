/**
 *@NApiVersion 2.1
 *@NModuleScope Public
 *@NScriptType Suitelet
 */
define(['N/log', 'N/ui/serverWidget', 'N/record', 'N/search'],
    function (log, serverWidget, record, search) {
        function onRequest(context) {
            if (context.request.method === 'GET') {

                // saved search for volume booked.

                var opportunitySearchObj = search.create({
                    type: "opportunity",
                    filters:
                        [
                            ["subsidiary", "anyof", "4"],
                            "AND",
                            ["salesrep.subsidiary", "anyof", "4"],
                            "AND",
                            ["datecreated", "within", "lastfiscalyear"],
                            "AND",
                            ["custbody14", "anyof", "37"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "subsidiary",
                                join: "salesRep",
                                summary: "GROUP",
                                label: "Subsidiary"
                            }),
                            search.createColumn({
                                name: "salesrep",
                                summary: "GROUP",
                                label: "Sales Rep"
                            }),
                            search.createColumn({
                                name: "tranid",
                                summary: "GROUP",
                                label: "Document Number"
                            }),
                            search.createColumn({
                                name: "projectedtotal",
                                summary: "SUM",
                                label: "Total Est. CC volume"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-01' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-02' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-03' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-04' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-05' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-06' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-07' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-08' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-09' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-10' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-11' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulacurrency",
                                summary: "SUM",
                                formula: "CASE WHEN TO_CHAR({datecreated},'YYYY-MM') = '2023-12' THEN {projectedamount} ELSE NULL END",
                                label: "Formula (Currency)"
                            }),
                            search.createColumn({
                                name: "formulatext",
                                summary: "GROUP",
                                formula: "CASE WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '01' THEN 'Jan' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '02' THEN 'Feb' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '03' THEN 'Mar' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '04' THEN 'Apr' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '05' THEN 'May' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '06' THEN 'Jun' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '07' THEN 'Jul' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '08' THEN 'Aug' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '09' THEN 'Sep' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '10' THEN 'Oct' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '11' THEN 'Nov' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '12' THEN 'Dec' ELSE NULL END",
                                label: "Formula (Text)"
                            })
                        ]
                });
                var searchResultCount = opportunitySearchObj.runPaged().count;
                log.debug("opportunitySearchObj result count", searchResultCount);
                var volume_booked_arr = [];
                opportunitySearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    var volume_booked_obj = {
                        opp_recd: result.getValue({
                            name: "tranid",
                            summary: "GROUP",
                            label: "Document Number"
                        }),
                        opp_vol_booked: result.getValue({
                            name: "projectedtotal",
                            summary: "SUM",
                            label: "Total Est. CC volume"
                        }),
                        opp_vol_month: result.getValue({
                            name: "formulatext",
                            summary: "GROUP",
                            formula: "CASE WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '01' THEN 'Jan' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '02' THEN 'Feb' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '03' THEN 'Mar' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '04' THEN 'Apr' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '05' THEN 'May' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '06' THEN 'Jun' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '07' THEN 'Jul' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '08' THEN 'Aug' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '09' THEN 'Sep' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '10' THEN 'Oct' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '11' THEN 'Nov' WHEN SUBSTR(TO_CHAR({datecreated},'YYYY-MM'), -2) = '12' THEN 'Dec' ELSE NULL END",
                            label: "Formula (Text)"
                        })

                    }
                    volume_booked_arr.push(volume_booked_obj);
                    return true;
                });
                log.debug('volume_booked_arr', volume_booked_arr);
                // saved search for volume and income 

                // var list = serverWidget.createList({
                //     title: 'LEACC - serverWidget.List'
                // });
                // list.addColumn({
                //     id: 'internalid',
                //     type: serverWidget.FieldType.TEXT,
                //     label: 'ID',
                //     align: serverWidget.LayoutJustification.RIGHT
                // });

                // list.addColumn({
                //     id: 'tranid',
                //     type: serverWidget.FieldType.TEXT,
                //     label: 'DOCUMENT NO.',
                //     align: serverWidget.LayoutJustification.RIGHT
                // });
                // list.addColumn({
                //     id: 'trandate',
                //     type: serverWidget.FieldType.TEXT,
                //     label: 'DATE',
                //     align: serverWidget.LayoutJustification.RIGHT
                // });

                // list.addColumn({
                //     id: 'currency',
                //     type: serverWidget.FieldType.TEXT,
                //     label: 'CURRENCY',
                //     align: serverWidget.LayoutJustification.RIGHT
                // });

                // var results = [];

                // //Create Search
                // var objFilter = [{
                //     name: 'mainline',
                //     operator: 'is',
                //     values: ['T']
                // }];
                // var objColumns = [{
                //     name: 'internalid'
                // }, {
                //     name: 'tranid'
                // }, {
                //     name: 'trandate'
                // }, {
                //     name: 'currency'
                // }];

                // var searchObj = search.create({
                //     type: search.Type.SALES_ORDER,
                //     columns: objColumns,
                //     filters: objFilter
                // });

                // searchObj.run().each(function (result) {
                //     var res = {};
                //     res['internalid'] = result.getValue({
                //         name: 'internalid'
                //     });
                //     res['tranid'] = result.getValue({
                //         name: 'tranid'
                //     });
                //     res['trandate'] = result.getValue({
                //         name: 'trandate'
                //     });

                //     res['currency'] = result.getText({
                //         name: 'currency'
                //     });

                //     results.push(res);
                //     return true;
                // });

                // log.debug('results', results);
                // list.addRows({
                //     rows: results
                // });

                context.response.writePage(list);

            }
        }

        return {
            onRequest: onRequest
        };
    });