let LogMessages = {
  log: function(type,where,what,api_call){
    var errorObj = {
      "date":new Date().toLocaleString(),
      "type": type,
      "env": process.env.ENVIRONMENT_NAME,
      "where": where, 
      "what": what
    }
  
    if(api_call){
      errorObj.api_call = api_call;
    }
  
    console.log(JSON.stringify(errorObj));
  }
}

module.exports = LogMessages;