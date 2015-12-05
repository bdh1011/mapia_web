function register(){
    var register_id = $('#register_id').val();
    var register_pw = $('#register_pw').val();
    var register_name = $('#register_name').val();
    console.log(register_id);
    console.log(register_pw);
    console.log(register_name);

    $.ajax({
        type: 'POST',
        url: 'http://mapsns.com/api/users/register',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        headers:
            {
              "Authorization": "Basic 1"
            },
        data: JSON.stringify({'id': register_id,
                              'pw': register_pw,
                              'name': register_name}),
        success: function(data){
          console.log(data);
          console.log("success");
        },
        failure: function(errMsg){
          alert(errMsg);
          console.log(failure);
        }
    })
}

$(document).ready(function(){
    $('.signup').click(function(){register()});
    $('.nickname.box').keypress(function(key){
        if (key.which == 13) register();
    })
  }
)
