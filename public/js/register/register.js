function register() {
  let user = document.getElementById('UsernameBox');
  let pass = document.getElementById('PasswordBox');
  console.log(user.value);
  console.log(pass.value);
  let stuff = {
    username: user.value,
    password: pass.value
  }
  user.value = ''
  pass.value = ''
  fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(stuff)
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Success:', data)
    let responseObj = data
    if (responseObj.signal === true) {
      window.location.href = '/login'
    }
    else{
     let text = document.getElementById('text-area')
     text.innerText = 'Invalid Password or Username' 
    }
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}