/** 
 * @NApiVersion 2.x 
 * @NScriptType MapReduceScript
 */

define(['N/file', 'N/search'], function (file, search) {

    function getInputData(context) {
        return search.load({
            id: 'customsearch4657'
        });;
    }
    function map(context) {
        log.debug('context.value || context.key', context.value + ' || ' + context.key)
        // for (var i = 0; context.value && i < context.value.length; i++) {
        //     if (context.value[i] !== ' ' && !PUNCTUATION_REGEXP.test(context.value[i])) {
        // context.write({
        //     key: context.value[i],
        //     value: 1
        // });


    }

    function reduce(context) {
        context.write({
            key: context.key,
            value: context.values.length
        });
    }

    function summarize(context) {
        // Log details about the script's execution. 
        // log.audit({
        //     title: 'Usage units consumed',
        //     details: context.usage
        // });

        // log.audit({
        //     title: 'Concurrency',
        //     details: context.concurrency
        // });

        // log.audit({

        //     title: 'Number of yields',

        //     details: context.yields

        // });

        // // Use the context object's output iterator to gather the key/value pairs saved at the end of the reduce stage. Also, tabulate the number of key/value pairs 

        // // that were saved. This number represents the total number of unique letters used in the original string. 

        // var text = '';

        // var totalKeysSaved = 0;

        // context.output.iterator().each(function (key, value) {

        //     text += (key + ' ' + value + '\n');

        //     totalKeysSaved++;

        //     return true;

        // });

        // // Log details about the total number of pairs saved. 

        // log.audit({

        //     title: 'Unique number of letters used in string',

        //     details: totalKeysSaved

        // });

        // Use the N/file module to create a file that stores the reduce stage output, which you gathered by using the output iterator. 

        // var fileObj = file.create({

        //     name: 'letter_count_result.txt',

        //     fileType: file.Type.PLAINTEXT,

        //     contents: text

        // });

        // fileObj.folder = -15;

        // var fileId = fileObj.save();

        // log.audit({

        //     title: 'Id of new file record',

        //     details: fileId

        // });

    }

    // Link each entry point to the appropriate function. 

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };

}); 