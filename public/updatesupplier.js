function updateSupplier(id){
    $.ajax({
        url: '/supplier/' + id,
        type: 'PUT',
        data: $('#update-supplier').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};