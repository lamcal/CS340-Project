function updateOrder_product(id){
    $.ajax({
        url: '/order_product/' + id,
        type: 'PUT',
        data: $('#update-order_product').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};  