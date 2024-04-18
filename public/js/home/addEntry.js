function addEntry(data) {
  fetch('/addEntry', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(data)
  })
  .then((response) => {
    if(response.ok){
      return
    }
  })
}