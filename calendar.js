var Calendar = Calendar || {
    version: 1.0,
    lunarPhaseSize: 15,
    lunarPhasesImage: 'https://s3.amazonaws.com/files.d20.io/images/4277527/CJJWBbiHx3jHglPdccPx3A/max.png?1401939451',
    clearImage: 'https://s3.amazonaws.com/files.d20.io/images/4277467/iQYjFOsYC5JsuOPUCI9RGA/max.png?1401938659',

    _Ordinal: function(num) {
        var ones=(num%10);
        var tens=((num%100)-ones);
        switch(ones)
        {
            case 1: return ((10 == tens) ? 'th' : 'st');
            case 2: return ((10 == tens) ? 'th' : 'nd');
            case 3: return ((10 == tens) ? 'th' : 'rd');
            default: return 'th';
        }
    },
    
    _GetOptionsFromTokens: function (tokens) {
        var options={};
        var switches=_.filter(tokens, function(tok){
            return null != tok.match(/^--/);
        });
        _.each(switches,function(s){
            switch(s)
            {
                case '--lunar': options.showLunarPhases=true; break;
                case '--nolunar': options.showLunarPhases=false; break;
                
            }
        });
        
       return options;
    },

    CheckInstall: function() {
        if( ! state.hasOwnProperty('Calendar') || state.Calendar.version != Calendar.version)
        {
            /* Default Settings stored in the state. */
            state.Calendar = {
                version: Calendar.version,
                now: {
                    year: 1001,
                    month: 1,
                    day: 4,
                    season: 'Spring'
                },
                setting: {
                    daysOfTheWeek: [
                        'Lunadain',
                        'Gromdain',
                        'Tserdain',
                        'Moldain',
                        'Nytdain',
                        'Loshdain',
                        'Soladain'],
                    weeksOfTheMonth: [1,2,3,4],
                    monthsOfTheYear: [
                        'Hammer',
                        'Alturiak',
                        'Ches',
                        'Tarsakh',
                        'Mirtul',
                        'Kythorn',
                        'Flamerule',
                        'Eleasis',
                        'Eleint',
                        'Marpenoth',
                        'Uktar',
                        'Nightal'],
                    seasonOfTheYear: [
                        'Spring',
                        'Summer',
                        'Fall',
                        'Winter'],
                    springWeather: [
                    	'test1',
                    	'test2',
                    	'test3',
                    	'test4',
                    	'test5',
                    	'test6',
                    	'test7',
                    	'test8',
                    	'test9',
                    	'test10'],
                    summerWeather: [
                    	'test1',
                    	'test2',
                    	'test3',
                    	'test4',
                    	'test5',
                    	'test6',
                    	'test7',
                    	'test8',
                    	'test9',
                    	'test10'],
                    fallWeather: [
                    	'test1',
                    	'test2',
                    	'test3',
                    	'test4',
                    	'test5',
                    	'test6',
                    	'test7',
                    	'test8',
                    	'test9',
                    	'test10'
                    ],
                    winterWeather: [
                    	'test1',
                    	'test2',
                    	'test3',
                    	'test4',
                    	'test5',
                    	'test6',
                    	'test7',
                    	'test8',
                    	'test9',
                    	'test10'
                    ],
                    yearPrefix: 'DR '
                }
            }
        }
    },
    
    AdvanceDays: function(days){
        var y=Math.floor(days/336);
        days-=(y*336);
        var m = Math.floor(days/28);
        days-=(m*28);
        
        var n = state.Calendar.now;
        
        n.day+=days;
        var _m=Math.floor((n.day-1)/28);
        n.day-=(_m*28);
        m+=_m;
        
        n.month+=m;
        var _y=Math.floor((n.month-1)/12);
        n.month-=(_y*12);
        y+=_y;
        
        n.year+=y;
        
        state.Calendar.now=n;
    },
    
    RemoveDays: function(days){
        var y=Math.floor(days/336);
        days-=(y*336);
        var m = Math.floor(days/28);
        days-=(m*28);
        
        var n = state.Calendar.now;
        
        n.day-=days;
        var _m=((n.day>0)?(0):(1));
        n.day+=(_m*28);
        m+=_m;
        
        n.month-=m;
        var _y=((n.month>0)?(0):(1));
        n.month+=(_y*12);
        y+=_y;
        
        n.year-=y;
        
        state.Calendar.now=n;
    },

    _GetSeasonOfYear: function(){

        var s = state.Calendar.setting;
        var n = state.Calendar.now;
        
        if(n.month == 1 || n.month == 2 || n.month == 3){

            n.season = 'Spring';
            return s.seasonOfTheYear[0];

        }else if (n.month == 4 || n.month == 5 || n.month == 6){
            
            n.season = 'Summer';
            return s.seasonOfTheYear[1];

        }else if (n.month == 7 || n.month == 8 || n.month == 9){
            
            n.season = 'Fall';
            return s.seasonOfTheYear[2];

        }
        else{
            n.season = 'Winter';
            return s.seasonOfTheYear[3];
        }
    },

    _GetWeather: function(d){

        var s=state.Calendar.now.season;
        var w=state.Calendar.setting;
        var m=Math.floor(Math.random() * 10);
        
        if(d.season == 'Spring'){
            return w.springWeather[m];
        }else if (d.season == 'Summer'){
            return w.summerWeather[m];
        }else if (d.season == 'Fall'){
            return w.fallWeather[m];
        }else{
            return w.winterWeather[m];
        }
    },
    
    _GetPhaseForDate: function(d,options){
        var opt=_.defaults((options||{}),{
            showLunarPhases: true
        });
        return ((opt.showLunarPhases)?(
        '<img src="'
            +Calendar.clearImage
            +'" style="width: '+Calendar.lunarPhaseSize+'px; height: '+Calendar.lunarPhaseSize+'px; background:url('
            +Calendar.lunarPhasesImage
            +') -'+((d.day-1)%7)*Calendar.lunarPhaseSize+'px -'+Math.floor((d.day-1)/7)*Calendar.lunarPhaseSize+'px;">'
            ):('')); 
    },
    
    _GetDayForDate: function(d,options){
        var opt=_.defaults((options||{}),{
        });
        
        var n=state.Calendar.now;
        var img = Calendar._GetPhaseForDate(d,opt)
        
        if(d.year == n.year && d.month == n.month && d.day == n.day)
        {
            return '<div style="white-space: nowrap;">'
                    +'<span style="font-weight: bold; color: #990000;">'
                        +d.day
                    +'</span>'
                    +img
                +'</div>';
        }
        else if( (d.year < n.year) 
        || ( (d.year <= n.year) && (d.month<n.month)) 
        || ( (d.year <= n.year) && (d.month<=n.month) && (d.day<n.day)) )
        {
            return '<div style="white-space: nowrap;">'
                    +'<strike style="color:red; font-weight: bold;">'
                        +'<span style="font-weight:bold; color:#999999;">'
                            +d.day
                        +'</span>'
                    +img
                    +'</strike>'
                +'</div>';
        }
        else
        {
            return '<div style="white-space: nowrap;">'
                    +'<span style="font-weight: bold; color: #000099;">'
                        +d.day
                    +'</span>'
                    +img
                +'</div>';
        }
    },
    
    _GetMonthForDate: function(d,options){
        var opt=_.defaults((options||{}),{
            showYear: true,
            showMonthNumber: false
        });
        
        var s=state.Calendar.setting;
        var daysHeader='';
        _.each(s.daysOfTheWeek,function(d){
            daysHeader+='<th><div style="width: 25px;margin: 0px auto;">'+d.substring(0,2)+'</div></th>';
        });
        
        var mday=_.clone(d);
        var weeks='';
        mday.day=1;
        _.each(s.weeksOfTheMonth,function(w){
            weeks+='<tr>';
            _.each(s.daysOfTheWeek,function(d){
                weeks+='<td style="vertical-align: middle; text-align:right;">';
                weeks+=Calendar._GetDayForDate(mday,opt);
                weeks+='</td>';
                mday.day++;
            });
            weeks+='</tr>';
        });
        
        return '<table style="border:1px solid black;background-color:#eeffee;">'
        +'<tr><th colspan="'+s.daysOfTheWeek.length+'">'
            +((opt.showMonthNumber)?('<div style="float:right; padding: 0px 3px;">'+d.month+'</div>'):(''))
            +s.monthsOfTheYear[d.month-1]
            +((opt.showYear)?(' '+d.year):(''))
        +'</th></tr>'
        +'<tr style="border-bottom: 1px solid #aaaaaa;">'+daysHeader+'</tr>'
        +weeks
        +'</table>';
    },
    
    _GetYearForDate: function(d,options){
        var opt=_.defaults((options||{}),{
            showLunarPhases: false,
            showYear: false,
            showMonthNumber: true
        });
        var s=state.Calendar.setting;
        var yday=_.clone(d);
        yday.day=1;
        yday.month=1;
        var months='';
        _.each([1,2,3,4],function(r){
            _.each([1,2,3],function(c){
                months+='<div style="float:left;padding: 2px 2px;">';
                months+=Calendar._GetMonthForDate(yday,opt);
                months+='</div>';
                yday.month++;
            });
        });
        
        return '<div style="background-color: #DEB887; border: 3px solid #8B4513; padding: 3px 3px;">'
        +'<div style="border-bottom: 2px solid #8B0000;margin: 3px 3px;font-weight: bold; font-size: 130%; text-align: center;">'+s.yearPrefix+d.year+'</div>'
        +months
        +'<div style="clear:both;"></div></div>';
    },
    
    _GetDateAsString: function(date){
        var s=state.Calendar.setting;
        return s.monthsOfTheYear[date.month-1]+' '+date.day+Calendar._Ordinal(date.day)+', '+s.yearPrefix +date.year;
    },
    
    ShowDate: function(d,options) {
        var opt=_.defaults((options||{}),{
            showLunarPhases: true
        });
        sendChat('','/direct '
            +'<div style=\''
                    +'color: white;'
                    +'padding: 5px 5px;'
                    +'background-color: #000033;'
                    +'font-weight: bold;'
                    +'font-family: Baskerville, "Baskerville Old Face", "Goudy Old Style", Garamond, "Times New Roman", serif;'
                    +'border: 3px solid #999999;'
                    +'text-align: center;'
                    +'\'>'
                +Calendar._GetDateAsString(d,opt)
                +' '
                +Calendar._GetPhaseForDate(d,opt)
            +'</div>'
            );
    },

    ShowSeason: function(d,options) {
        var opt=_.defaults((options||{}),{
            showLunarPhases: true
        });
        sendChat('','/direct '
            +'<div style=\''
                    +'color: white;'
                    +'padding: 5px 5px;'
                    +'background-color: #0F0;'
                    +'font-weight: bold;'
                    +'font-family: Baskerville, "Baskerville Old Face", "Goudy Old Style", Garamond, "Times New Roman", serif;'
                    +'border: 3px solid #999999;'
                    +'text-align: center;'
                    +'\'>'
                +Calendar._GetSeasonOfYear()
            +'</div>'
            );
    },

    ShowWeather: function(d,options) {
        var opt=_.defaults((options||{}),{
            showLunarPhases: true
        });
        sendChat('','/direct '
            +'<div style=\''
                    +'color: white;'
                    +'padding: 5px 5px;'
                    +'background-color: #FFA500;'
                    +'font-weight: bold;'
                    +'font-family: Baskerville, "Baskerville Old Face", "Goudy Old Style", Garamond, "Times New Roman", serif;'
                    +'border: 3px solid #999999;'
                    +'text-align: center;'
                    +'\'>'
                +Calendar._GetWeather(d)
            +'</div>'
            );
    },
    
    ShowMonth: function(d,options){
        var opt=_.defaults((options||{}),{
        });
        sendChat('','/direct '+Calendar._GetMonthForDate(d,opt));
    },
    
    ShowYear: function(d,options){
        var opt=_.defaults((options||{}),{
            showYear: false
        });
        sendChat('','/direct '+Calendar._GetYearForDate(d,opt));
    },
    
    HandleInput: function(tokens){ 
        var options = Calendar._GetOptionsFromTokens(tokens);        
        tokens=_.filter(tokens, function(tok){
            return null == tok.match(/^--/);
        });
        var cmd = tokens[0] || 'month';
        switch (cmd)
        {
            case 'month': 
                Calendar.ShowMonth(state.Calendar.now,options);
                break;
            
            case 'year':
                Calendar.ShowYear(state.Calendar.now,options);
                break;
                
            case 'today':
                Calendar.ShowDate(state.Calendar.now,options);
                break;
                
            case 'next':
                var days=tokens[1] || 1;
                Calendar.AdvanceDays(days);
                Calendar.ShowDate(state.Calendar.now,options);
                break;
            
            case 'prev':
                var days=tokens[1] || 1;
                Calendar.RemoveDays(days);
                Calendar.ShowDate(state.Calendar.now,options);
                break;

            case 'season':
                Calendar.ShowSeason(state.Calendar.now,options);
                break;

            case 'weather':
                Calendar.ShowWeather(state.Calendar.now,options);
                break;
            
        }
    },
    
    RegisterEventHandlers: function() {
        on("chat:message", function (msg) {
            /* Exit if not an api command */
            if (msg.type != "api") return;
            
            /* clean up message bits. */
            msg.who = msg.who.replace(" (GM)", "");
            msg.content = msg.content.replace("(GM) ", "");

            var tokenized = msg.content.split(" ");
            var command = tokenized[0];

            switch(command)
            {
                case "!cal":
                case "!calendar":
                {
                    Calendar.HandleInput(_.rest(tokenized));
                }
                break;
                
                case "!s":
                {
                    sendChat('',
                        '/direct <div style="border: 2px solid red;"><b>state.Calendar</b><br><pre>'
                        +JSON.stringify(state.Calendar,undefined,"   ").replace(/\n/g,'<br>')
                        +"</pre></div>" );
                }
                break;
            }
        });
    }  
};

on("ready",function(){
    Calendar.CheckInstall(); 
    Calendar.RegisterEventHandlers();
});