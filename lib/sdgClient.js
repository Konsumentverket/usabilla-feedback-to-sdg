const axios = require('axios');


const getSdgUniqueId = async function(context,configuration){

    try{
        const response = await axios.get(configuration.endpoints.uniqueIdEndpointUrl,{
            headers:{
                "x-api-key": configuration.sdgApiKey
            }
        })
        return response.data
    }
    catch(e){
        context.log(e)
        throw new Error(`getSdgUniqueId failed: ${e.message}`)
    }
}

const postFeedback = async function(context, configuration, sdgFeedback){
    try{
        const sdgJson = JSON.stringify(sdgFeedback);
        const response = await axios.post(configuration.endpoints.informationServicesFeedbackUrl,
            sdgJson,
            {
                headers:{
                    "x-api-key": configuration.sdgApiKey,
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data
    }
    catch(e){
        context.log(e)
        throw new Error(`postFeedback failed: ${e.message}`)
    }
}
 


module.exports = {
    getSdgUniqueId,
    postFeedback
}