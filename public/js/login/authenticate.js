function authenticate() {
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
  fetch('/authenticate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(stuff)
  })
  .then((response) => {
    console.log('Success:', response)
    if (response.ok) {
      window.location.href = '/home'
    }
    else{ //Currently doesn't work
      let text = document.getElementById('text-area')
      text.innerText = 'Invalid Password or Username' 
    }
  })
}