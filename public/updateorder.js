function updateOrder(id){
    $.ajax({
        url: '/order/' + id,
        type: 'PUT',
        data: $('#update-order').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};