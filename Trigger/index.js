
const extractSdgFeedback = require('../lib/extractSdgFeedback');
const getConfiguration = require('../lib/getConfiguration');
const usabillaClient = require('../lib/usabillaClient');
const moment = require('moment');
const feedbackToSdgFormat = require('../lib/feedbackToSdgFormat');
const { getSdgUniqueId, postFeedback } = require('../lib/sdgClient');
const sendFailedNotification = require('../lib/sendFailedNotification');

module.exports = async function (context, timer) {
    let useAcceptence;
    try{
        const configuration = getConfiguration(context)
        useAcceptence = configuration.useAcceptence
        const period = {
            startData: moment(timer.ScheduleStatus.Last),
            endDate: moment()
        }


        const inpageItems = await usabillaClient.getInpageItems(context,configuration)
        const filteredInpageItems = inpageItems.filter(x => configuration.inpageItemsToUse.some(y => y == x.name ))
    
        const feedbacks = {}

        for (let index = 0; index < filteredInpageItems.length; index++) {
            const feedback = await usabillaClient.getInpageFeedback(context,configuration,filteredInpageItems[index].id)
            feedbacks[filteredInpageItems[index].id] = feedback
        }

        const sdgFeedback = extractSdgFeedback(context,feedbacks,period)
        if(sdgFeedback.length == 0){
            context.bindings.sdgDeliveryLogItem = JSON.stringify({
                id: moment().format('YYYY-MM-DD hh:mm:ss'),
                message: "no SDG tagged feedback found in period",
                success: true,
                isPastDue: timer.isPastDue,
                acceptence: useAcceptence,
            });
            return; 
        }
        const sdgUniqueId = await getSdgUniqueId(context,configuration)
        const sdgFormatedFeedback = feedbackToSdgFormat(context,sdgFeedback,sdgUniqueId,period)
        const sdgPostResponse = await postFeedback(context,configuration,sdgFormatedFeedback)

                
        context.bindings.sdgDeliveryLogItem = JSON.stringify({
            id: moment().format('YYYY-MM-DD hh:mm:ss'),
            success: true,
            sdgUniqueId: sdgUniqueId,
            isPastDue: timer.isPastDue,
            sdgResponse: sdgPostResponse,
            acceptence: useAcceptence,
            sdgFeedback: sdgFeedback,
            sdgFormatedFeedback: sdgFormatedFeedback
            
        });
    }
    catch(err){
        const id = moment().format('YYYY-MM-DD hh:mm:ss')
        const notificationSent = await sendFailedNotification(context,err,useAcceptence,id)
        context.log("Request failed!",err)
        context.bindings.sdgDeliveryLogItem = JSON.stringify({
            id: id,
            notificationSent: notificationSent,
            success: false,
            message: JSON.stringify(err, Object.getOwnPropertyNames(err)),
            isPastDue: timer.isPastDue,
            sdgResponse: null,
            acceptence: useAcceptence
        });
    }

}