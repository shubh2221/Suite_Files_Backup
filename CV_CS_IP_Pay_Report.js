/**
*@NApiVersion 2.1
*@NScriptType ClientScript
*/
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
                    scriptId: 'custom_script',
                    deploymentId: 'custom_script_deployment',
                    params: {
                        'yer': selected_year
                    }
                });
            } else {
                alert('Please Select Year!')
            }
        }
    }

    return {
        fieldChanged: fieldChanged
    }

});