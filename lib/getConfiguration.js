const getEndpoints = require("./getEndpoints")

/**
 * getConfiguration reads configuration from the environment and formats it. It reads configurations that starts with GTM_
 * @param  {object} context The Azure function context object
 * @return {Array} Array of Configurations objects
 */
module.exports = function (context) {
    const publicKey = process.env["USABILLA_PUBLIC_KEY"]
    const secretKey = process.env["USABILLA_SECRET_KEY"]
    const sdgApiKey = process.env["SDG_API_KEY"]
    const inpageItemsToUse = process.env["INPAGE_TO_USE"].split(",")
    const useAcceptence = process.env["USE_SDG_ACCEPTENCE"] == "true"
    const endpoints = getEndpoints(context,useAcceptence);

    return {
        publicKey,
        secretKey,
        inpageItemsToUse,
        useAcceptence,
        endpoints,
        sdgApiKey
        
    }

}