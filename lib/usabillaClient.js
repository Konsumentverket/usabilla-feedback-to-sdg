
const Usabilla = require('usabilla-api');

const getInpageItems = async function(context, configuration, retry = 5){

    const usabilla = new Usabilla(configuration.publicKey, configuration.secretKey)

    for(var a = 0; a < retry; a++){
        try{
            return await usabilla.websites.inpage.get()
        }
        catch(e){
            context.log(`getInpageItems failed, retry: ${a} message:${e}`)
        }
    }
    throw new Error(`Failed to get InpageItems. Tried ${retry} times`)
}

const getInpageFeedback = async function(context, configuration, id, retry = 15){

    const usabilla = new Usabilla(configuration.publicKey, configuration.secretKey)
    const query = {
        id
    }
    for(let a = 0; a < retry; a++){
        try{
            return await usabilla.websites.inpage.feedback.get(query)
        }
        catch(e){
            context.log(`getInpageFeedback failed, id: ${id} retry: ${a} message:${e}`)
        }
    }
    throw new Error(`Failed to get getInpageFeedback with id: ${id}. Tried ${retry} times`)

}


module.exports = {
    getInpageItems,
    getInpageFeedback
}