({
	doInit : function(component, event, helper) {
        var id = (new Date()).getTime( );
        component.set( "v.id", id );

        var typeselect = component.get( "v.question_1_selection");
        switch( typeselect ){
            case 'Star Rating':
                component.set( 'v.question_1_type','star');
                component.set( 'v.question_1_multiple', false); 
                break;
            case 'Radio Button':
                component.set( 'v.question_1_type','radio');
                component.set( 'v.question_1_multiple', false); 
                break;
            case 'Checkbox':
                component.set( 'v.question_1_type','check');
                component.set( 'v.question_1_multiple', true); 
                break;
            case 'Image':
                component.set( 'v.question_1_type','image');
                component.set( 'v.question_1_multiple', false);
                break;
            case 'Multiple Image Selection':
                component.set( 'v.question_1_type','image');
                component.set( 'v.question_1_multiple', true); 
                break;
            default:
                component.set( 'v.question_1_type','star');
                component.set( 'v.question_1_multiple', false);
        };
        
        if(  component.get( 'v.question_1_multiple') == false ){
             component.set( "v.question_1_multiple_class", "nobutton" );
        };
	},
    afterScriptsLoaded : function(component, event, helper) { 
        $A[ 'lightning-poll' + component.get( "v.id") ] = new LightningPoll();
        var lightningpoll = $A[ 'lightning-poll' + component.get( "v.id") ] ;
        var data = {
            id: component.get( 'v.id'),
            isSendEmail: (component.get( 'v.emailRecipient') !=''),
            isHideTakenPoll: component.get('v.question_1_hideTakenPoll'),
            isShowThankYou: component.get( 'v.question_1_showThankYou'),
            validUntil: component.get( 'v.question_1_validUntil'),
            width: component.get( 'v.width'),
            questions:[{
                    type: component.get( 'v.question_1_type'),
                    isMultiple: component.get( 'v.question_1_multiple'),
                    text: component.get( 'v.question_1_text'),
                    choice_1:  component.get( 'v.choice_1_1'),
                    choice_2:  component.get( 'v.choice_1_2'),
                    choice_3:  component.get( 'v.choice_1_3'),
                    choice_4:  component.get( 'v.choice_1_4'),
                    choice_5:  component.get( 'v.choice_1_5'),
                    correct_answer: [],
                    user_answer: []
                }]
        };
        
        var timer;
        var action1_finished = false, action2_finished = false;
        
        var action = component.get("c.GetData");
        action.setParams({
            PollId: component.get( 'v.PollId'),
        });
        action.setCallback(this, function(response){
            data.prevdatas = [];
            if(response.getState() === "SUCCESS"){
                if(response.getReturnValue().length > 0){
               		data.isTaken = true;
                	data.prevdatas = lightningpoll.mapPrevData(data.questions, response.getReturnValue());
                }else
                    data.isTaken = false;
            }else{
                data.isTaken = false;
        	};
            component.set( "v.question_1_isTaken", data.isTaken );
            if(  component.get( 'v.question_1_isTaken') == true ){
                 component.set( "v.question_1_taken_class", "taken" );
            };
            action1_finished = true;
        });
        $A.enqueueAction(action);
        
        var action2 = component.get("c.GetAvarage");
        action2.setParams({
            PollId: component.get( 'v.PollId'),
        });
        action2.setCallback(this, function(response){
            data.pollresults = [];
            if(response.getState() === "SUCCESS"){
                var result = response.getReturnValue();
                if(result.expr0 != null){
                   data.pollresults = lightningpoll.mapPollResult(data.questions, result);
                };
            };
            action2_finished = true;
        });
        $A.enqueueAction(action2);
        
        timer = setInterval(function(){ 
            if(action1_finished && action2_finished){
                lightningpoll.init( data );
                clearInterval(timer);
            };
        },300);
        
        (function(self){
           utility.onPageLoad( function(){
                utility.onWindowResize(  self.adjustImgSizeOnWinResize );
            });
        })(lightningpoll);

        utility.init( );
    },
    sendEmail: function(component, event, helper){
        var data = $A[ 'lightning-poll' + component.get( "v.id") ].getData()[0];
        var title = "【Lightning Poll Result】 ID#" + component.get( 'v.PollId') +  " " + data.text;
        var content = 'Answer: <BR/>';
        var choices = '';
        for(key in data){
			if( key.search('choice') > -1){
                choices += data[key] + '<BR/>'
                if(data.user_answer [0].hasOwnProperty(key)){
                       if(data.user_answer [0][key] == 1) content += data[key] + '<BR/>'
                };
            };
        };
        
        content += '<BR/><BR/>Poll Details:<BR/>';
        content += 'ID: ' + component.get( 'v.PollId') + '<BR/>';
        content += 'Question: ' + data.text + '<BR/>';
        content += 'Question Type: ' + data.type  + '<BR/>';
        content += 'Multiple Choice: ' + data.isMultiple   + '<BR/>';
        content += 'Choices:<BR/>' + choices;
        
        var action = component.get("c.SendEmailNow");
        action.setParams({
            recipient: component.get( 'v.emailRecipient'),
            title: title,
            content: content
        });
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
               console.log( "EMAIL SENT" ); 
            }else{
                console.log("ERROR SENDING EMAIL TO " + component.get( 'v.emailRecipient'));
        	};
        });
        $A.enqueueAction(action);
    },
    sendAnswer : function(component, event, helper) { 
        var data = $A[ 'lightning-poll' + component.get( "v.id") ].getData()[0];
        var sendData = [{
            PollId__c: component.get( 'v.PollId'),
            answer_1_1__c: data.user_answer [0].choice_1,
            answer_1_2__c: data.user_answer [0].choice_2,
            answer_1_3__c: data.user_answer [0].choice_3,
            answer_1_4__c: data.user_answer [0].choice_4,
            answer_1_5__c: data.user_answer [0].choice_5
        }];
        
        var action = component.get("c.SaveData");
        action.setParams({
            sendData: JSON.stringify(sendData),
        });
        action.setCallback(this, function(response){
            if(response.getState() === "SUCCESS"){
               console.log( "DATA SAVED ON DB" ); 
            }else {
                console.log("ERROR  SAVING DATA ON DB");
        	};
        });
        $A.enqueueAction(action);
    }
})