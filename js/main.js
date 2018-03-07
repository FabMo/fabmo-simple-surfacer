var dropdown = document.getElementById('options');
var add = document.getElementById('add');
var fabmo = new FabMoDashboard();
var lastStat = null;
var jobItems = {};
var buttons = [' <div class="button is-success routine" data-height="" data-width="" data-feedrate="4"><p class="bit" data-val="1.25">1.25"</p><p class="cut" data-val="Pocket">Outside In Pocket</p> <p class="depth" data-val="0.03">@0.03" deep</p><p class="pass-over" data-val="35">&#38; 35% step over</p><div class="actions"><div class="edit"><i id="edit"class="fa fa-pencil" aria-hidden="true"></i></div><div  class="trash"><i id="delete" class="fa fa-times" aria-hidden="true"></i></div></div></div>'];
add.onclick = function(){
    dropdown.classList.toggle('is-active');
    $('.dropdown-item input').val('');
    $('.add').off().html('Add Routine').click(function(){
        var html = makeRoutine();
        buttons.push(html);
        $('.routines').append(html);
        fabmo.setAppConfig({'buttons' : buttons});
        
    });
};

fabmo.getAppConfig(function(err, myConfig) {
    if (err){
        console.log(err);
    } else {
        if (myConfig.buttons) {
            if(myConfig.buttons.length > 0){
                buttons = myConfig.buttons;
            } else {
                 buttons = [' <div class="button is-success routine" data-height="" data-width="" data-feedrate="4"><p class="bit" data-val="1.25">1.25"</p><p class="cut" data-val="Pocket">Outside In Pocket</p> <p class="depth" data-val="0.03">@0.03" deep</p><p class="pass-over" data-val="35">&#38; 35% step over</p><div class="actions"><div class="edit"><i id="edit"class="fa fa-pencil" aria-hidden="true"></i></div><div  class="trash"><i id="delete" class="fa fa-times" aria-hidden="true"></i></div></div></div>'];
            }
            for (var i = 0; i < buttons.length; i++ ){
                $('.routines').append(buttons[i]);
            }
        } else {
           $('.routines').append(buttons[0]);
        }
    }
});		

function onStatus(status) {
    if(status.state == "idle" && lastStat == "running") {
        $('.directions').html('Your tool is zeroed and ready to be surfaced. Would you like to generate surfacing file?');
        fabmo._event_listeners.status = [];
        $('.okay, .cancel').show().off();
        $('.cancel').click(function(){
            $('.okay, .cancel').off();
            $('.modal').removeClass('is-active');
        });

        $('.okay').click(function(){
            makeJob(jobItems);
        });

    } else if (status.state != lastStat) {
        lastStat = status.state;
    }

}
function makeRoutine (){

    dropdown.classList.toggle('is-active');
    var bit = $('.bitInput').val();
    var height = $('.heightInput').val();
    var width = $('.widthInput').val();
    var depth = $('.depthInput').val();
    var step = $('.stepInput').val();
    var surfacetype = $('.surfacetypeInput').val();
    var feedRate = $('.feedrateInput').val();
    if (surfacetype === "Pocket") {
        var surfaceText = 'Outside In Pocket';
    } else {
        var surfaceText = 'Raster';
    }
    var html = '<div class="button is-success routine" data-height="'+height+'" data-width="'+width+'" data-feedrate="'+feedRate +'"><p class="bit" data-val="'+bit+'">'+bit+'"</p><p class="cut" data-val="'+surfacetype+'">'+surfaceText+'</p> <p class="depth" data-val="'+depth+'">@'+depth+'" deep</p><p class="pass-over" data-val="'+step+'">&#38; '+(step)+'% step over</p> <div class="actions"><div class="edit"><i id="edit"class="fa fa-pencil" aria-hidden="true"></i></div><div  class="trash"><i id="delete" class="fa fa-times" aria-hidden="true"></i></div></div></div>';
    return html;
}
$('.add').click(function(){
    var html = makeRoutine();
    buttons.push(html);
    $('.routines').append(html);
    fabmo.setAppConfig({'buttons' : buttons});
    $('.dropdown-item input').val('');
});


$('.routines').on('click', '.routine', function(e){
   
    var that = $(this);
    var index = $('.routine').index(this); 
    console.log(that); 
    var currentHTMl = this.toString();
    fabmo.getConfig(function(err, data) {
            if (err){
                console.log(err);
            } else {
                    jobItems.bitDiam = that.find('.bit').data('val');
                    jobItems.width = that.data('width') || parseInt(data.machine.envelope.xmax) - parseInt(data.machine.envelope.xmin);
                    jobItems.height = that.data('height') || parseInt(data.machine.envelope.ymax) - parseInt(data.machine.envelope.ymin);
                    jobItems.feedrate = that.data('feedrate');
                    jobItems.cut = that.find('.cut').data('val');
                    jobItems.depth = that.find('.depth').data('val');
                    jobItems.passOver = that.find('.pass-over').data('val');
                if (e.target.id === 'edit') {
                    dropdown.classList.toggle('is-active');
                    $('.bitInput').val(jobItems.bitDiam);
                    $('.heightInput').val(jobItems.height);
                    $('.widthInput').val(jobItems.width);
                    $('.depthInput').val(jobItems.depth);
                    $('.stepInput').val(jobItems.passOver);
                    $('.surfacetypeInput').val(jobItems.cut);
                    $('.feedrateInput').val(jobItems.feedrate);
                    $('.add').off().html('Save').click(function(){
                       
                        var html = makeRoutine();
                        that.replaceWith(html);
                        $('.add').off().html('Add Routine').click(function(){
                            var html = makeRoutine();
                            buttons.push(html);
                            $('.routines').append(html);
                            fabmo.setAppConfig({'buttons' : buttons});
                            $('.dropdown-item input').val('');
                        });
                        
                        buttons[index] = html;
                        fabmo.setAppConfig({'buttons' : buttons});
                    });
                
                } else if (e.target.id === 'delete'){
                    that.remove();
                    buttons.splice(index, 1);
                } else  { 
                  
                $('.okay, .cancel').show().off();
                $('.okay').html('Yes');
                $('.cancel').html('No');
                $('.directions').html('Is your Z-Axis correctly zeroed to the surface of your table?');
                $('.modal').addClass('is-active');
                
                $('.okay').click(function(){
                    $('.okay, .cancel').off();
                    $('.directions').html('Great, would you like to run the zeroing routine for your X & Y axes?');
                    $('.okay').click(function(){
                        $('.okay, .cancel').hide().off();
                        fabmo.runSBP('C#,3');
                        $('.directions').html('Please wait while your tool zeroes');
                        fabmo.on('status', onStatus);
                    });
                    $('.cancel').click(function(){
                        $('.okay, .cancel').off();
                        $('.directions').html('Would you like to generate the surfacing file?');
                        $('.cancel').click(function(){
                            $('.okay, .cancel').off();
                            $('.modal').removeClass('is-active');
                        });

                        $('.okay').click(function(){
                            makeJob(jobItems);
                        });
                    })
                })

                $('.cancel').click(function(){
                    $('.okay, .cancel').off();
                    $('.directions').html('Please go zero Z-Axis and then return to surface');
                    $('.cancel').hide();
                    $('.okay').html('Okay');
                    $('.okay').click(function(){
                        $('.modal').removeClass('is-active');
                    });
                });
            }
            }
    });
    
});

makeJob = function(jobItems){
    var y = jobItems.height;
    var x = jobItems.width;
    var b = jobItems.bitDiam;
    var po = (jobItems.passOver/100);
    var depth = jobItems.depth;
    var fr = (jobItems.feedrate*60);

    var passes = Math.ceil(depth/0.03); //known safe pass depth
    var passDepth = parseFloat((depth/passes).toFixed(4));

    g="";
    g+='g20\n'
    g+='m4\n'
    g+='g4p2\n'
    g+='g0z1\n'
    g+='g1f'+fr+'\n'

    if( jobItems.cut === "Pocket"){
        for (var i = 1; i < (passes+1); i++){
            g+='g0x0y0\n'
            g+='g1z-'+(passDepth * i)+'\n'
            g+='g1y'+y+'\n'
            g+='g1x'+x+'\n'
            g+='g1y'+(y-y)+'\n'

            if (x > y) {
                var j = x;
                for (var h = y; h > (y/2);) {
                    j = j - (b * po);
                    h = h - (b * po);
                    g+='g1x'+(x-j)+'\n'
                    j = j - (b * po);
                    g+='g1y'+(h)+'\n'
                    h = h - (b * po);
                    g+='g1x'+(j)+'\n'
                    g+='g1y'+(y - h)+'\n'
                }
            } else {
                var h = y;
                for (var j = x; j > (x/2);) {
                    j = j - (b * po);
                    h = h - (b * po);
                    g+='g1x'+(x-j)+'\n'
                    j = j - (b * po);
                    g+='g1y'+(h)+'\n'
                    h = h - (b * po);
                    g+='g1x'+(j)+'\n'
                    g+='g1y'+(y - h)+'\n'

             }
            }  
            g+="G10 L20 P2 Z0\n" 
            g+="g0z1\n"
            g+="m5\n"
            g+="m30\n"
        }
        
        fabmo.submitJob({
            file : g,
            filename : "surface.nc",
            name : "Outside in pocketing routine",
            description : "Bit : "+b+", Depth : " + depth +", Step over : " + (po*100)+'%'
	    });


    } else {
         for (var i = 1; i < (passes+1); i++){
             g+='g0x0y0\n'
             g+='g1z-'+(passDepth * i)+'\n'
             if (x < y){
                for (var j = x; j > 0; ){
                    g+='g1x'+(x-j)+'\n'
                    g+='g1y'+(y)+'\n'
                    j = j - (b * po);
                    g+='g1x'+(x-j)+'\n'
                    g+='g1y0\n'
                    j = j - (b * po);
                }
             } else {
                 for (var h = y; h > 0; ){
                    g+='g1y'+(y-h)+'\n'
                    g+='g1x'+(x)+'\n'
                    h = h - (b * po);
                    g+='g1y'+(y-h)+'\n'
                    g+='g1x0\n'
                    h = h - (b * po);
                }
             }
         }
            g+="G10 L20 P2 Z0\n" 
            g+="g0z1\n"
            g+="m5\n"
            g+="m30\n"  
         fabmo.submitJob({
            file : g,
            filename : "surface.nc",
            name : "Raster surfacing routine",
            description : "Bit : "+b+", Depth : " + depth +", Step over : " + (po*100)+'%'
	    });
    }
}