var dropdown = document.getElementById('options');
var add = document.getElementById('add');
var fabmo = new FabMoDashboard();

add.onclick = function(){
    dropdown.classList.toggle('is-active');
};


$('.button').click(function(e){
    var that = $(this);
    fabmo.getConfig(function(err, data) {
            if (err){
                console.log(err);
            } else {
                var bitDiam = that.find('.bit').data('val');
                var width = that.data('width') || parseInt(data.machine.envelope.xmax) - parseInt(data.machine.envelope.xmin);
                var height = that.data('height') || parseInt(data.machine.envelope.ymax) - parseInt(data.machine.envelope.ymin);
                var cut = that.find('.cut').data('val');
                var depth = that.find('.depth').data('val');
                var passOver = that.find('.pass-over').data('val');

                $('.modal').addClass('is-active');
                
                if (cut === 'pocket'){}
            }
    });
    
})