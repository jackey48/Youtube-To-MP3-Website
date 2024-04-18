function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  if (event.keyCode === ENTER_KEY) {
    download();
    return false //don't propogate event
  }
}

//Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  //This function is called after the browser has loaded the web page

  //add listener to buttons

  document.getElementById('submit_url_button').addEventListener('click', download);

  document.getElementById('check_url_button').addEventListener('click', checkVideo);

  document.getElementById('entries_button').addEventListener('click', function(){
    window.location.href = '/entries'
  });



  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)

})
