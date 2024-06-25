/**
*@NApiVersion 2.1
*@NScriptType ClientScript
*/
'use strict';

function submitFunction() {
    // alert('testing');
    require(['N/https', 'N/url', 'N/currentRecord'], function (https, url, currentRecord) {
        try {
            var currentRecord = currentRecord.get();
            var start_date = currentRecord.getValue({
                fieldId: 'start_date'
            });
            console.log(start_date);
            if (start_date) {
                var end_date = currentRecord.getValue({
                    fieldId: 'end_date'
                });
                var sales_emp_id = currentRecord.getValue({
                    fieldId: 'sales_emp'
                });
                if (end_date) {
                    setWindowChanged(window, false);
                    document.location = url.resolveScript({
                        scriptId: 'customscript_cv_sl_cti_commission_report',
                        deploymentId: 'customdeploy_cv_sl_cti_commission_report',
                        params: {
                            'start_date': formatNSDate(start_date),
                            'end_date': formatNSDate(end_date),
                            'sales_emp_id': sales_emp_id
                        }
                    });
                } else {
                    alert('Please! Provide End Date!');
                }
            } else {
                alert('Please! Provide Start Date!');
            }
        } catch (error) {
            log.debug('Error in custom function', error);
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
    });
};
function resetFunction() {
    require(['N/https', 'N/url', 'N/currentRecord'], function (https, url, currentRecord) {
        try {
            setWindowChanged(window, false);
            document.location = url.resolveScript({
                scriptId: 'customscript_cv_sl_cti_commission_report',
                deploymentId: 'customdeploy_cv_sl_cti_commission_report'
            });
        } catch (error) {
            log.debug('Error in custom function', error);
        }
    });
}
define(['N/record', 'N/search', 'N/ui/dialog', 'N/url'], function (record, search, dialog, url) {
    function fieldChanged(context) {
        var currentRecord = context.currentRecord;

        if (context.fieldId == 'custpage_year') {
            var selected_year = currentRecord.getValue({
                fieldId: 'custpage_year'
            });
            if (selected_year) {
                setWindowChanged(window, false);
                document.location = url.resolveScript({
                    scriptId: 'customscript_cv_sl_ip_pay_report',
                    deploymentId: 'customdeploy_cv_sl_ip_pay_report',
                    params: {
                        'yer': selected_year
                    }
                });
            } else {
                alert('Please Select Year!')
            }
        }
        // if (context.fieldId == 'opp_doc') {
        //     var opp_doc = currentRecord.getValue({
        //         fieldId: 'opp_doc'
        //     });
        //     setWindowChanged(window, false);
        //     document.location = url.resolveScript({
        //         scriptId: 'customscript_cv_sl_ip_pay_report',
        //         deploymentId: 'customdeploy_cv_sl_ip_pay_report',
        //         params: {
        //             'opp_doc': opp_doc
        //         }
        //     });
        // }
        // if (context.fieldId == 'summery_fld') {
        //     var selected_year = currentRecord.getValue({
        //         fieldId: 'custpage_year'
        //     });
        //     var summery_fld = currentRecord.getValue({
        //         fieldId: 'summery_fld'
        //     });
        //     if (summery_fld == true) {
        //         if (selected_year) {
        //             setWindowChanged(window, false);
        //             document.location = url.resolveScript({
        //                 scriptId: 'customscript_cv_sl_ip_pay_report',
        //                 deploymentId: 'customdeploy_cv_sl_ip_pay_report',
        //                 params: {
        //                     'yer': selected_year,
        //                     'sum_type': summery_fld
        //                 }
        //             });
        //         } else {
        //             alert('Please Select Year!')
        //         }
        //     } else {
        //         setWindowChanged(window, false);
        //         document.location = url.resolveScript({
        //             scriptId: 'customscript_cv_sl_ip_pay_report',
        //             deploymentId: 'customdeploy_cv_sl_ip_pay_report',
        //             params: {
        //                 'yer': selected_year,
        //                 'sum_type': summery_fld
        //             }
        //         });
        //     }
        // }
        // if (context.fieldId == 'start_date') {
        //     var start_date = currentRecord.getValue({
        //         fieldId: 'start_date'
        //     });
        //     if (start_date) {
        //         var end_date = currentRecord.getValue({
        //             fieldId: 'end_date'
        //         });
        //         var sales_emp_id = currentRecord.getValue({
        //             fieldId: 'sales_emp'
        //         });
        //         if (end_date) {
        //             setWindowChanged(window, false);
        //             document.location = url.resolveScript({
        //                 scriptId: 'customscript_cv_sl_cti_commission_report',
        //                 deploymentId: 'customdeploy_cv_sl_cti_commission_report',
        //                 params: {
        //                     'start_date': formatNSDate(start_date),
        //                     'end_date': formatNSDate(end_date),
        //                     'sales_emp_id': sales_emp_id
        //                 }
        //             });
        //         } else {
        //             alert('Please! Provide End Date Year!');
        //         }
        //     } else {
        //         alert('Please! Provide Start Date Year!');
        //     }
        // }
        // if (context.fieldId == 'end_date') {
        //     var end_date = currentRecord.getValue({
        //         fieldId: 'end_date'
        //     });
        //     if (end_date) {
        //         var start_date = currentRecord.getValue({
        //             fieldId: 'start_date'
        //         });
        //         var sales_emp_id = currentRecord.getValue({
        //             fieldId: 'sales_emp'
        //         });
        //         if (start_date) {
        //             setWindowChanged(window, false);
        //             document.location = url.resolveScript({
        //                 scriptId: 'customscript_cv_sl_cti_commission_report',
        //                 deploymentId: 'customdeploy_cv_sl_cti_commission_report',
        //                 params: {
        //                     'start_date': formatNSDate(start_date),
        //                     'end_date': formatNSDate(end_date),
        //                     'sales_emp_id': sales_emp_id
        //                 }
        //             });
        //         } else {
        //             alert('Please! Provide Start Date Year!');
        //         }
        //     } else {
        //         alert('Please! Provide End Date Year!');
        //     }
        // }
        if (context.fieldId == 'sales_emp_fld') {
            var sales_emp = currentRecord.getText({
                fieldId: 'sales_emp_fld'
            });
            if (sales_emp) {
                var start_date = currentRecord.getValue({
                    fieldId: 'start_date'
                });
                var end_date = currentRecord.getValue({
                    fieldId: 'end_date'
                });
                var sales_emp_id = currentRecord.getValue({
                    fieldId: 'sales_emp_fld'
                });
                setWindowChanged(window, false);
                document.location = url.resolveScript({
                    scriptId: 'customscript_cv_sl_sales_by_salesrep',
                    deploymentId: 'customdeploy_cv_sl_sales_by_salesrep',
                    params: {
                        // 'start_date': formatNSDate(start_date),
                        // 'end_date': formatNSDate(end_date),
                        // 'sales_emp': sales_emp,
                        'sales_emp_id': sales_emp_id
                    }
                });
            } else {
                var start_date = currentRecord.getValue({
                    fieldId: 'start_date'
                });
                var end_date = currentRecord.getValue({
                    fieldId: 'end_date'
                });
                setWindowChanged(window, false);
                document.location = url.resolveScript({
                    scriptId: 'customscript_cv_sl_sales_by_salesrep',
                    deploymentId: 'customdeploy_cv_sl_sales_by_salesrep',
                    params: {
                        // 'start_date': formatNSDate(start_date),
                        // 'end_date': formatNSDate(end_date)
                    }
                });
            }
        }
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
        fieldChanged: fieldChanged
    }

});
