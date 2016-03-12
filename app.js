/**
 * 
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var restCall=require('restler');
server.listen(80);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

//timeslots configuration
var timeSlots=[
               {'startTime':0,'endTime':180},
               {'startTime':181,'endTime':360},
               {'startTime':361,'endTime':540}
               ];
var flightCount={
		'timeSlot1':{'scheduleCount':0,'plannedCount':0},
		'timeSlot2':{'scheduleCount':0,'plannedCount':0},
		'timeSlot3':{'scheduleCount':0,'plannedCount':0}
}
app.get('/departures',function(req,res){
	restCall.get('http://flightinfo.phlapi.com/direction/departure').on('complete',function(data){
		////console.log("calling response"+JSON.stringify(data));


		var terminals=[
		        {'name':'A-West',
		        'capacity':10,	
		        
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }},	
		    {'name':'A-East',
		    	'capacity':20,
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }},	
		    {'name':'B',
		    	'capacity':15,
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }},	
		    {'name':'C',
		    	'capacity':15,
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }},	
		    {'name':'D',
		    	'capacity':15,
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }},	
		    {'name':'E',
		    	'capacity':20,
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }},	
		    {'name':'F',
		    	'capacity':20,
		         'data':{
		    		'timeSlot0':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot1':{'scheduleCount':0,'plannedCount':0,'color':'white'},
		    		'timeSlot2':{'scheduleCount':0,'plannedCount':0,'color':'white'}
		    }}		    ];


		for(var i in data){
			
			var estimatedDate = new Date(data[i].estimatedDateTime);
			
			var tmpTerminals=data[i].terminal.split('/');
			var todayDate= new Date();
			var diff=((estimatedDate-todayDate)/1000)/60;
			
			for(var timeIndex in timeSlots){
			
				if(diff >= timeSlots[timeIndex].startTime && diff <= timeSlots[timeIndex].endTime){
					var indexVal='timeSlot'+timeIndex;
			
					if(tmpTerminals.length ==1 ){	
						for(var iterm in terminals){
							if(terminals[iterm].name == (data[i].terminal)){
								terminals[iterm].data[indexVal].scheduleCount++;
							}
						}
					}
					
					else{
						
					for(var terms in tmpTerminals){
						for(var iterm in terminals){
							//check if there are two terminals 
							if(terminals[iterm].name == tmpTerminals[terms]){
			
								terminals[iterm].data[indexVal].plannedCount++;
			
							}
						}
						
					}	
						
					}
					
				}
			}
		}	
			
		for(var iterminals in terminals){
			
			var utilizationTimeSlot1=terminals[iterminals].data.timeSlot0.scheduleCount/terminals[iterminals].capacity*100;
			if(utilizationTimeSlot1 < 20)
				terminals[iterminals].data.timeSlot0.color='yellow';
			else if(utilizationTimeSlot1 > 80)
				terminals[iterminals].data.timeSlot0.color='red';
			else
				terminals[iterminals].data.timeSlot0.color='green';
		
			utilizationTimeSlot1=terminals[iterminals].data.timeSlot1.scheduleCount/terminals[iterminals].capacity*100;
			if(utilizationTimeSlot1 < 20)
				terminals[iterminals].data.timeSlot1.color='yellow';
			else if(utilizationTimeSlot1 > 80)
				terminals[iterminals].data.timeSlot1.color='red';
			else
				terminals[iterminals].data.timeSlot1.color='green';
		
			utilizationTimeSlot1=terminals[iterminals].data.timeSlot2.scheduleCount/terminals[iterminals].capacity*100;
			if(utilizationTimeSlot1 < 20)
				terminals[iterminals].data.timeSlot2.color='yellow';
			else if(utilizationTimeSlot1 > 80)
				terminals[iterminals].data.timeSlot2.color='red';
			else
				terminals[iterminals].data.timeSlot2.color='green';
		
		}
		//console.log("Final"+terminals);
		res.send(terminals);
	});


});

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		////console.log(data);
	});
});