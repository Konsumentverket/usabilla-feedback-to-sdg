const extractSdgFeedback = require('../lib/extractSdgFeedback');
const getConfiguration = require('../lib/getConfiguration');
const usabillaClient = require('../lib/usabillaClient');
const moment = require('moment');
const feedbackToSdgFormat = require('../lib/feedbackToSdgFormat');
const { getSdgUniqueId, postFeedback } = require('../lib/sdgClient');

module.exports = async function (context, req) {
    const configuration = getConfiguration(context)
    const period = {
        startData: moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    }


    const inpageItems = await usabillaClient.getInpageItems(context,configuration)
    const filteredInpageItems = inpageItems.filter(x => configuration.inpageItemsToUse.some(y => y == x.name ))
 
    const feedbacks = {}

    for (let index = 0; index < filteredInpageItems.length; index++) {
        const feedback = await usabillaClient.getInpageFeedback(context,configuration,filteredInpageItems[index].id)
        feedbacks[filteredInpageItems[index].id] = feedback
    }

    const sdgFeedback = extractSdgFeedback(context,feedbacks,period)
    const sdgUniqueId = await getSdgUniqueId(context,configuration)
    const sdgFormatedFeedback = feedbackToSdgFormat(context,sdgFeedback,sdgUniqueId,period)

    const sdgPostResponse = await postFeedback(context,configuration,sdgFormatedFeedback)

    context.log(sdgFormatedFeedback)
    context.res = {
        body: JSON.stringify(sdgPostResponse)
    };

}