function updateProduct(id){
    $.ajax({
        url: '/product/' + id,
        type: 'PUT',
        data: $('#update-product').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};