// function download() {
//   let urlbox = document.getElementById('URLBox');
//   console.log(urlbox.value);
//   let stuff = {
//     url: urlbox.value
//   }
//   urlbox.value = ''
//   fetch('/download', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json',},
//     body: JSON.stringify(stuff)
//   })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Success:', data);
//     responseObj = JSON.parse(data);
//     window.open(responseObj.downloadUrl);
//     let object = {
//       url: urlbox.value,
//       title: responseObj.title
//     }
//     addEntry(object);
//   })
//   .catch((error) => {
//     console.error('Error:', error)
//   })
// }

function download(){
  let urlbox = document.getElementById('UrlBox');
  console.log(urlbox.value);
  let url = urlbox.value;
  urlbox.value = '';
  if(urlbox == ''){
    console.log('No Input');
    return;
  }
  let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log("RECEIVED");
          let response = JSON.parse(xhr.responseText);
          console.log(response);
          console.log(response.link);
          window.open(response.link);
          let object = {
            url: url,
            title: response.title
          }
          addEntry(object)
      }
      console.log(xhr.readyState);
      console.log(xhr.status);
    }
    xhr.open('GET', `/download?` + url, true)
    xhr.send()
}


  // console.log('https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/?url=https%3A%2F%2F' + url);
  // fetch('/download?' + url, {
  //   method: 'get',
  //   headers: {
  //       'X-RapidAPI-Key': '3e5eb8d741msh21486d440770961p15b4d4jsn89fe17c29233',
  //       'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
  //   },
  // })
  // .then(response => {
  //     console.log("RESPONSE RECEIVED");
  //     if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //     }
  //     return response.json(); // assuming the response is JSON
  // })
  // .then(data => {
  //   console.log('Success:', data);
  //   responseObj = JSON.parse(data);
  //   window.open(responseObj.link);
  //   let object = {
  //     url: urlbox.value,
  //     title: responseObj.title
  //   }
  //   addEntry(object);
  // })
  // .catch(error => {
  //     console.error('There was a problem with the fetch operation:', error);
  // });