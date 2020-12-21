const moment = require('moment');

module.exports = function (context,feedbacks,period) {

    const validFeedbacks = []
    const keys = Object.keys(feedbacks)

    keys.forEach(key => {
        const feedback = feedbacks[key]
        if(feedback == null || feedback.length == 0) return
        feedback.forEach(f => {
            if(f.customData == null || f.customData.sdg == null) return;
            const date = moment(f.date)
            const isInRange = date.isSameOrAfter(period.startData)
            if(!isInRange) return
            if(f.data["How_satisfied_are_you"] == null) return
            validFeedbacks.push(f)
        })

    })

    return validFeedbacks;


}