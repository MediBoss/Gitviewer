chrome.runtime.onMessage.addListener(
    function(request,sender,senderResponse){
        if(request.msg==="socket"){
            console.log("receive from socket server: "+request.text);
        }
    }
);
