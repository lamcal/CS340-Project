function searchCustomerByEmail() {
    //get the first name 
    var email_search_string  = document.getElementById('email_search_string').value
    //construct the URL and redirect to it
    window.location = '/customer/search/' + encodeURI(email_search_string)
}
