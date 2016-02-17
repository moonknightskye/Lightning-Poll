var LightningPoll = function () {
	
    var questionElem;
    var questions;
    var prevdatas;
    var pollresults;
    var isSendEmail;
    var QUESTION_NUMBER = 0;
    var ANSWER_USER = 0;
    var ANSWER_RESULT = 1;
    var isTaken;
    var isHideTakenPoll = false;
    var isShowPoll = false;
    var isShowThankYou = false;
    var validUntil;
    var now = new Date();
    
    function init(param){
        //console.log(param);
        questionElem = document.getElementById( 'lightning-poll' + param.id );
        questions = param.questions;
        pollresults = param.pollresults;
        prevdatas = param.prevdatas;
        isSendEmail = param.isSendEmail;
        isTaken = param.isTaken;
        isHideTakenPoll = param.isHideTakenPoll;
        if(isHideTakenPoll && isTaken){
        	return;    
        };
        
        try{
            if(param.validUntil !=''){
                validUntil = new Date(param.validUntil);
                if(validUntil > now) isShowPoll = true;
            }else{
                 isShowPoll = true;
            };
        }catch(Error){
            isShowPoll = false;
        };
        isShowThankYou = param.isShowThankYou;

        constructAnswer(QUESTION_NUMBER);
        
        if(questions[QUESTION_NUMBER].isMultiple){
            var button_vote = questionElem.getElementsByClassName('button_vote')[0];
            button_vote.addEventListener('click', clickSend);
        };
        
        if(isTaken){
            //console.log("ALREADY TAKEN... generate results");
            constructResult(QUESTION_NUMBER, false);
        };
        
        if(isShowPoll){
            questionElem.style.width = param.width;
            console.log(param.width);
            questionElem.classList.remove('preload');
            questionElem.classList.add('loaded');
        };
        
        if(isShowThankYou){
            questionElem.classList.add('thank_you');
        };
    };
    
    function constructResult(number, answers){
        var question = questions[number];
        var pollresult;
        var answer;
        
        if(pollresults.length <= 0 || !pollresults[number]){
            pollresult = {};
            for(key in question){
                if( key.search('choice') > -1){
                    if(question.hasOwnProperty(key)){
                           pollresult[key] = 0;
                    };
                };
            };
        }else{
            pollresult = pollresults[number];
        };

        if(answers){
            answer = answers[0];
            for(key in pollresult){
                if(answer.hasOwnProperty(key)){
					pollresult[key] += answer[key];
                };
            };
        }else{
            answer = prevdatas[number]
        };

        var qAnswer = questionElem.getElementsByClassName('qAnswer')[1];
        var selected = qAnswer.getElementsByClassName('selected')[0];
        var disselected = qAnswer.getElementsByClassName('disselected')[0];
        switch( question.type ){
            case 'check':
            case 'radio':
				selected.appendChild(constructCheckRadioResultChoices(question.type, question, 'selected', answer, pollresult));
                disselected.appendChild(constructCheckRadioResultChoices(question.type, question, 'disselected', answer, pollresult));
                break;
            case 'star':
                selected.appendChild(constructStarResultChoices(question.type, question, 'selected', answer, pollresult));
                selected.appendChild(constructStarChoices('staranswer','answer',question, '', answer, pollresult));
                disselected.appendChild(constructStarResultChoices(question.type, question, 'disselected', answer, pollresult));
                break;
            case 'image':
                selected.appendChild(constructImageResultChoices(question.type, question, 'selected', answer, pollresult));
                disselected.appendChild(constructImageResultChoices(question.type, question, 'disselected', answer, pollresult));
                break;
        };
    };
    
    function constructCheckRadioResultChoices(type, question, section, answer, pollresult){
         return createUL(type,'',question, section, answer, pollresult);
    };
    function constructStarResultChoices(type, question, section, answer, pollresult){
         return createUL(type,'',question, section, answer, pollresult);
    };
    function constructImageResultChoices(type, question, section, answer, pollresult){
         return createUL(type,'',question, section, answer, pollresult);
    };
    
    function constructAnswer(number){
        var question = questions[number];
        
        var qAnswer = questionElem.getElementsByClassName('qAnswer')[0];
        switch( question.type ){
            case 'check':
            case 'radio':
               qAnswer.appendChild(constructCheckRadioChoices(question.type, question));
                break;
            case 'image':
                qAnswer.appendChild(constructImageChoices(question));
                break;
            case 'star':
                qAnswer.appendChild(constructStarChoices('starlabel','label',question));
                qAnswer.appendChild(constructStarChoices('staranswer','answer',question));
                break;
        };
    };
    
    function constructStarChoices(type,className,question, section, answer, pollresult){
    	return createUL(type,className,question, section, answer, pollresult);
    };
    
    function constructImageChoices(question){
        return createUL('image','',question);
    };
    
    function constructCheckRadioChoices(type, question){
        return createUL(type,'',question);
    };
    
    function createUL(type, className, data, section, answer, pollresult){
        var ul = document.createElement("UL");
        if(className) ul.classList.add(className);
        
        if(section){
            switch( section ){
                case 'selected':
                    switch( type ){
                		case 'check':
                		case 'radio':
                        	if(answer.choice_1) ul.appendChild(createLI(type,'',data.choice_1, answer, pollresult.choice_1));
                        	if(answer.choice_2) ul.appendChild(createLI(type,'',data.choice_2, answer, pollresult.choice_2));
                        	if(answer.choice_3) ul.appendChild(createLI(type,'',data.choice_3, answer, pollresult.choice_3));
                        	if(answer.choice_4) ul.appendChild(createLI(type,'',data.choice_4, answer, pollresult.choice_4));
                       		if(answer.choice_5) ul.appendChild(createLI(type,'',data.choice_5, answer, pollresult.choice_5));
                            break;
                        case 'star':
                        case 'image':
                        	if(answer.choice_1) ul.appendChild(createLI(type,'',data.choice_1, answer, pollresult.choice_1));
                        	if(answer.choice_2) ul.appendChild(createLI(type,'',data.choice_2, answer, pollresult.choice_2));
                        	if(answer.choice_3) ul.appendChild(createLI(type,'',data.choice_3, answer, pollresult.choice_3));
                        	if(answer.choice_4) ul.appendChild(createLI(type,'',data.choice_4, answer, pollresult.choice_4));
                       		if(answer.choice_5) ul.appendChild(createLI(type,'',data.choice_5, answer, pollresult.choice_5));
                            break;
                            
                    };
                    break;
				case 'disselected':
                    switch( type ){
                		case 'check':
                		case 'radio':
                        	if(data.choice_1 != '' && answer.choice_1 == 0) ul.appendChild(createLI(type + 'result','',data.choice_1, answer, pollresult.choice_1));
                        	if(data.choice_2 != '' && answer.choice_2 == 0) ul.appendChild(createLI(type + 'result','',data.choice_2, answer, pollresult.choice_2));
                        	if(data.choice_3 != '' && answer.choice_3 == 0) ul.appendChild(createLI(type + 'result','',data.choice_3, answer, pollresult.choice_3));
                        	if(data.choice_4 != '' && answer.choice_4 == 0) ul.appendChild(createLI(type + 'result','',data.choice_4, answer, pollresult.choice_4));
                       		if(data.choice_5 != '' && answer.choice_5 == 0) ul.appendChild(createLI(type + 'result','',data.choice_5, answer, pollresult.choice_5));
                            break;
                        case 'star':
                        case 'image':
                        	if(data.choice_1 != '' && answer.choice_1 == 0) ul.appendChild(createLI(type + 'result','',data.choice_1, answer, pollresult.choice_1));
                        	if(data.choice_2 != '' && answer.choice_2 == 0) ul.appendChild(createLI(type + 'result','',data.choice_2, answer, pollresult.choice_2));
                        	if(data.choice_3 != '' && answer.choice_3 == 0) ul.appendChild(createLI(type + 'result','',data.choice_3, answer, pollresult.choice_3));
                        	if(data.choice_4 != '' && answer.choice_4 == 0) ul.appendChild(createLI(type + 'result','',data.choice_4, answer, pollresult.choice_4));
                       		if(data.choice_5 != '' && answer.choice_5 == 0) ul.appendChild(createLI(type + 'result','',data.choice_5, answer, pollresult.choice_5));
                            break;
                    };
                    break;
            };
        }else{
            switch( type ){
                case 'check':
                case 'radio':
                case 'image':
                case 'starlabel':
                   if(data.choice_1 != '') ul.appendChild(createLI(type,'',data.choice_1));
                   if(data.choice_2 != '') ul.appendChild(createLI(type,'',data.choice_2));
                   if(data.choice_3 != '') ul.appendChild(createLI(type,'',data.choice_3));
                   if(data.choice_4 != '') ul.appendChild(createLI(type,'',data.choice_4));
                   if(data.choice_5 != '') ul.appendChild(createLI(type,'',data.choice_5));
                   break;
                case 'staranswer':
                   if(answer){
                       if(data.choice_1 != '') ul.appendChild(createLI(type,'star-rating',data.choice_1, answer));
                       if(data.choice_2 != '') ul.appendChild(createLI(type,'star-rating',data.choice_2, answer));
                       if(data.choice_3 != '') ul.appendChild(createLI(type,'star-rating',data.choice_3, answer));
                       if(data.choice_4 != '') ul.appendChild(createLI(type,'star-rating',data.choice_4, answer));
                       if(data.choice_5 != '') ul.appendChild(createLI(type,'star-rating',data.choice_5, answer)); 
                   }else{
                       if(data.choice_1 != '') ul.appendChild(createLI(type,'star-rating',data.choice_1));
                       if(data.choice_2 != '') ul.appendChild(createLI(type,'star-rating',data.choice_2));
                       if(data.choice_3 != '') ul.appendChild(createLI(type,'star-rating',data.choice_3));
                       if(data.choice_4 != '') ul.appendChild(createLI(type,'star-rating',data.choice_4));
                       if(data.choice_5 != '') ul.appendChild(createLI(type,'star-rating',data.choice_5)); 
                   };

                   break;
            };
        };

        return ul;
    };
    
    function createLI(type, className,data, answer, pollresult){
        var li = document.createElement("LI");
        if(className) li.classList.add(className);
        if(answer){
            switch( type ){
                case 'star':
            	case 'check':
                case 'radio':
                    li.appendChild(createDIV(type,'counter_holder',data, answer, pollresult));
                    li.appendChild(createDIV(type,'',data));
                    break;
                case 'image':
                case 'imageresult':
                    li.appendChild(createDIV(type,'counter_holder',data, answer, pollresult));
                    li.appendChild(createDIV(type,'img_holder',data));
                    break;
            	case 'checkresult':
                case 'radioresult':
                    li.appendChild(createDIV(type,'countr',data,answer,pollresult));
                    li.appendChild(createDIV(type,'',data));
                    break;
                case 'starresult':
                    li.appendChild(createDIV(type,'countr',data,answer,pollresult));
                    li.appendChild(createDIV(type,'starr',data,answer,pollresult));
                    break;
                case 'staranswer':
                     li.dataset.value = data;
                     li.appendChild(createDIV(type,'icon',''));
                     li.dataset.checked = isStarChecked(data, answer);
                     break;
            };
        }else{
        	switch( type ){
            	case 'check':
                case 'radio':
                     li.appendChild(createDL(type,'',data));
                     break;
                case 'image':
                     li.dataset.value = data;
                     li.appendChild(createDIV(type,'img_holder',data));
                     li.addEventListener('click', toggleImage);
                     break;
                case 'starlabel':
                     li.dataset.value = data;
                     li.innerText = data;
                case 'staranswer':
                     li.dataset.value = data;
                     li.appendChild(createDIV(type,'icon',''));
                     li.addEventListener('mouseout', mouseoutStar);
                     li.addEventListener('mouseover', mouseoverStar);
                     li.addEventListener('click', toggleStar);
                     break;
            };
        };
        return li;
    };
    
    function createDL(type,className,data){
       var dl = document.createElement("DL");
        if(className) dl.classList.add(className);
        dl.dataset.value = data;
        switch( type ){
            case 'radio':
                dl.addEventListener('click', toggleRadio);
                break;
            case 'check':
               dl.addEventListener('click', toggleCheck);
                break;
        };
        var dt = document.createElement("DT");
        var dd = document.createElement("DD");
        dd.innerText = data;
        dl.appendChild(dt);
        dl.appendChild(dd);
        return dl;
    };
    
    function createDIV(type,className,data,answer,pollresult){
    	var div = document.createElement("DIV");
        if(className) div.classList.add(className);
        
        if(className == "counter_holder"){
            if(type != 'imageresult') div.appendChild(createDIV(type,'plusone_1',data,answer,pollresult));
            div.appendChild(createDIV(type,'countr',data,answer,pollresult));
        }else if(className == "plusone_1"){
             div.appendChild(createIcon('you_1', '+1'));
        }else if(className == "countr"){
            var vote = (pollresult > 1) ? ' Votes': ' Vote';
            div.appendChild(createIcon('count_1', pollresult + vote));
        }else if(className == "starr"){
            div.innerHTML = createSpanContent(data, answer);
        }else{
            switch( type ){
                case 'star':
                case 'check':
                case 'radio':
                case 'checkresult':
                case 'radioresult':
                    div.innerText = data;
                    break;
                case 'image':
                case 'imageresult':
                    if(data) div.style.backgroundImage = 'url(' + data + ')';
                    break;
            };
        };

        return div;
    };
    
    function createSpanContent(data, answer){
    	
        var code = createActiveStar(data, answer);
        code += '<BR/>';
        code += '<span>' + data +'</span>'
        return code;
    };
    
    function createActiveStar(data, answer){
        var question = questions[QUESTION_NUMBER];
        
        var star = '&#9733;';
        var yellow = '<span class="yellow">';
        var gray = '<span class="gray">';
        
        var found = true;
        for(key in question){
            if( key.search('choice') > -1){
                if(question.hasOwnProperty(key)){
                    if(question[key] != ''){
                        if(found){
                            yellow += star;
                        }else{
                            gray += star;
                        };
                        if(question[key] == data) found = false;
                    };
                };
            };
        };
        yellow += '</span>';
        gray += '</span>';
        return yellow + gray;
    };
    
    function createIcon(className, data){
        var i = document.createElement("I");
        if(className) i.classList.add(className);
        i.innerText = data;
        return i;
    };
    
    function isStarChecked(data, answer){
        var question = questions[QUESTION_NUMBER];
        var opt = '';
        if(question.choice_1 === data) opt = 'choice_1';
        if(question.choice_2 === data) opt = 'choice_2';
        if(question.choice_3 === data) opt = 'choice_3';
        if(question.choice_4 === data) opt = 'choice_4';
        if(question.choice_5 === data) opt = 'choice_5';

        var value = true;
        for(key in answer){
            if(answer.hasOwnProperty(opt)){
                if(key == opt) break;
                if(answer[key] == 1) value = false;
            };
        };

        return value;
    };
    
    function adjustImgSizeOnWinResize(){console.log('resizing...');};
    
    function toggleRadio(event){
        var element = event.target;
        if(element.tagName != 'DL') 
            element = utility.getParent(element, 'DL');
       
       if(element.dataset.checked == 'true') return;
        
        var radio_buttons = questionElem.getElementsByClassName('radio')[0].getElementsByTagName('DL');
        var i = radio_buttons.length - 1;
        for(; i>=0;i--){
            radio_buttons[i].dataset.checked = 'false';
        };
        element.dataset.checked = 'true';
        
        send('radio');
    };
    
    function toggleCheck(event){
        var element = event.target;
        if(element.tagName != 'DL') 
            element = utility.getParent(element, 'DL');
        
		var parent = utility.getParent(element, 'UL');
        var elements = parent.getElementsByTagName('DL');
        var i = elements.length - 1;
        var disable = true;
        for(;i>=0;i--){
            if(elements[i] != element && elements[i].dataset.checked && elements[i].dataset.checked == 'true'){
                disable = false;
            };
        };
        
         if(element.dataset.checked == 'true'){
             element.dataset.checked = 'false';
         }else{
             element.dataset.checked = 'true';
             disable = false;
         };
         
         disableSend(disable);
    };
    
     function toggleImage(event){
        var element = event.target;
        if(element.tagName != 'LI') 
            element = utility.getParent(element, 'LI');
         
		var parent = utility.getParent(element, 'UL');
         var elements = parent.getElementsByTagName('LI');
         var i = elements.length - 1;
         var disable = true;
         if(!questions[QUESTION_NUMBER].isMultiple){
             for(;i>=0;i--){
                 if(elements[i].dataset.checked) elements[i].dataset.checked = 'false';
             };
         }else{
			for(;i>=0;i--){
                if(elements[i] != element && elements[i].dataset.checked && elements[i].dataset.checked == 'true') disable = false;
             };
         };
       
         if(element.dataset.checked == 'true'){
             element.dataset.checked = 'false';
         }else{
             element.dataset.checked = 'true';
             disable = false;
         };
         
         disableSend(disable);
          if(!questions[QUESTION_NUMBER].isMultiple) send('image');
    };
    
    function disableSend(disable){
        var button_vote = questionElem.getElementsByClassName('button_vote')[0];
        if(disable)  button_vote.classList.add('disable');
        else button_vote.classList.remove('disable');
    };
    
    function mouseoverStar(event){
        var element = event.target;
        if(element.tagName != 'LI') 
            element = utility.getParent(element, 'LI');
        
       var star_buttons = utility.getParent(element, 'UL').getElementsByClassName('star-rating');
       var i = 0, found=false;
        for(; i<star_buttons.length;i++){
            if(found){
                star_buttons[i].classList.remove('mouseover');
            }else{
                  star_buttons[i].classList.add('mouseover');
            }
            if(element == star_buttons[i]){
                found = true;
                displayLabelStar(element.dataset.value);
            };
        };
    };
    
    function mouseoutStar(event){
         var star =  questionElem.getElementsByClassName('mouseover');
         if(star){
         	var i = star.length - 1;
             for(;i>=0;i--){
                 star[i].classList.remove('mouseover');
             };
            var star_buttons = questionElem.getElementsByClassName('star')[0].getElementsByClassName('star-rating');
            var i = star_buttons.length-1, found=false;
            for(; i>=0;i--){
                if(star_buttons[i].dataset.checked == 'true'){
                    displayLabelStar(star_buttons[i].dataset.value);
                    return;
                }
            };
             displayLabelStar(-1);
         };
    };
    
    function toggleStar(event){
         var element = event.target;
        if(element.tagName != 'LI') 
            element = utility.getParent(element, 'LI');
        
        var star_buttons = utility.getParent(element, 'UL').getElementsByClassName('star-rating');
        var i = 0, found=false;
        for(; i<star_buttons.length;i++){
             star_buttons[i].classList.remove('rotate');
            if(found){
                star_buttons[i].dataset.checked = 'false';
            }else{
                star_buttons[i].dataset.checked = 'true';
                (function(e){
                    setTimeout(function(){
                        e.classList.add('rotate');
                    },100);
                })(star_buttons[i]);
            }
            if(element == star_buttons[i]){
                found = true;
               displayLabelStar(element.dataset.value);
            };
        };
        
        if(found) send('star');
    };
    
    function displayLabelStar(value){
         var star =  questionElem.getElementsByClassName('star')[0];
         if(star){
			var labels = star.getElementsByClassName('label')[0].getElementsByTagName('LI');
            var i = labels.length - 1;
             for(;i>=0;i--){
                 if(labels[i].dataset.value == value){
                    labels[i].dataset.selected = 'true';
                 }else{
                	 labels[i].dataset.selected = 'false';
                 };
             };
         };
    };
        
	function clickSend(event){
        if(event.target.classList.contains('disable')) return;
       send("send");
	};
    
    function send(type){
        if(isTaken) console.log('ALREADY TAKEN!!');
        if(questions[QUESTION_NUMBER].user_answer.length > 0 || isTaken) return;
        isTaken = true;
        var question = questions[QUESTION_NUMBER];
        question.user_answer = [];
        var answers = questionElem.querySelectorAll('[data-checked="true"]');
        var answer = {};
        
        for(key in question){
            if( key.search('choice') > -1){
                if(question.hasOwnProperty(key)){
                       answer[key] = 0;
                };
            };
        };

        var i = answers.length-1;
        for(; i>=0;i--){
            for(key in question){
                if( key.search('choice') > -1){
                    if(question.hasOwnProperty(key)){
                           if(question[key] == answers[i].dataset.value) answer[key] = 1;
                    };
                };
            };
            if(!questions[QUESTION_NUMBER].isMultiple) break;
        };
        
        question.user_answer.push(answer);
        constructResult(QUESTION_NUMBER, question.user_answer);
        
        var timeout = 0;
        switch( type ){
            case 'send':
                timeout = 0;
                break;
            case 'radio':
        		timeout = 400;
                break;
            case 'star':
                timeout = 400 + (answers.length * 200);
                break;
            case 'image':
				timeout = 600;
                break;
        };
        
        setTimeout(function(){ sendAnswerToServer(); }, timeout);
    };
    
    function sendAnswerToServer(){
        console.log(questions[QUESTION_NUMBER].user_answer[0]);
        
        utility.fireEvent(questionElem.getElementsByClassName('sendAnswer')[0], 'click');
        if(isSendEmail) utility.fireEvent(questionElem.getElementsByClassName('sendEmail')[0], 'click');
        
        var panel = questionElem.getElementsByClassName('panel')[0];
        panel.classList.add('flip');
    };
    
    function getData(){
        return questions;
    };
    
    function mapPollResult(questions, data){
        var results = [];
        var result = {};
        for (var property in questions[QUESTION_NUMBER]) {
            if (questions[QUESTION_NUMBER].hasOwnProperty(property)) {
                if( property.search('choice') > -1){
                    var _prop = 'expr' + (parseInt(property.replace('choice_','')) - 1);
                    if(data.hasOwnProperty(_prop)){
                        result[property] = data[_prop]
                    };
                };
            };
        };
        return [result];
    };
    
    function mapPrevData(questions, data){
        var prevdats = [];
        var prevdat = {};
        for (var property in questions[QUESTION_NUMBER]) {
            if (questions[QUESTION_NUMBER].hasOwnProperty(property)) {
                if( property.search('choice') > -1){
                    var _prop = 'answer_' + (QUESTION_NUMBER + 1) + '_' + parseInt(property.replace('choice_','')) + '__c';
                    if(data[QUESTION_NUMBER].hasOwnProperty(_prop)){
                        prevdat[property] = data[QUESTION_NUMBER][_prop]
                    };
                };
            };
        };
        return [prevdat];
    };
    
    return{
        init: init,
        getData: getData,
        adjustImgSizeOnWinResize: adjustImgSizeOnWinResize,
        mapPollResult: mapPollResult,
        mapPrevData: mapPrevData
    };
};