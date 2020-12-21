const moment = require("moment");

const foundInformationTransform = function(feedback){

    if(feedback.data.hasOwnProperty("commentyes"))
        return "Yes"

    if(feedback.data.hasOwnProperty("commentnopartly"))
        return "Partly"

    return "No"
}

module.exports = function (context,feedbacks,uniqueId,period) {
    
    const transferData = moment().format('YYYY-MM-DDT00:00:00');

    const baseObj = {
        "uniqueId": uniqueId,
        "referencePeriod": {
            "startDate": period.startData,
            "endDate": period.endDate
        },
        "transferDate": transferData,
        "transferType": "API",
        "nbEntries": feedbacks.length,
        "feedbacks": []
    }

    feedbacks.forEach(f => {
        baseObj.feedbacks.push({
            "category": "Information",
            "rating": f.data["How_satisfied_are_you"],
            "source": f.url,
            "foundInformation": foundInformationTransform(f),
            "helpUsImprove": f.comment
        })
    })



    return baseObj
}