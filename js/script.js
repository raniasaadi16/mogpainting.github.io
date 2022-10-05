if(document.querySelector('#contactForm')){
    $(document).ready(function() {
        var form = $('#contactForm'); // contact form
        var submit = $('#submit-btn'); // submit button
    
        // form submit event
        form.on('submit', function(e) {
            e.preventDefault(); 
    
            $.ajax({
                url: 'js/contact_process.php', 
                type: 'POST', 
                dataType: 'html', 
                data: form.serialize(), 
               // crossDomain: true,
                beforeSend: function() {
                    submit.html('Sending....'); // change submit button text
                },
                success: function(data) {
                    $('.modal-body').html(data).css('color', 'green');
                    $('.modal').modal('show') // you need bootstrap
                    form.trigger('reset'); // reset form
                    submit.html('Send');  // reset submit button text
                },
                error: function(e) {
                    $('.modal-body').html('error!, please try again').css('color', 'red');
                    $('.modal').modal('show')
                    submit.html('Send'); 
                }
            });
        });
    });
}

