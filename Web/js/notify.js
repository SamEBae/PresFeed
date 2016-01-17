// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe() {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var options = {
      sound: 'audio/alert.mp3',
      icon: 'images/presfeed.png',
      body: "Hey there! Your audience is struggling!"
    }

    var notification = new Notification('Notification title', options);

    var sound = notification.sound;

    notification.onclick = function () {
      notification.sound    
    };
  }

}