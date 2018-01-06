export function changeTitle(title){
  document.setTitle = function(t) {
    document.title = t;
    var i = document.createElement('iframe');
    i.src = 'https://assets-cdn.github.com/favicon.ico';
    i.style.display = 'none';
    i.onload = function() {
      setTimeout(function(){
        i.remove();
      }, 9)
    }
    document.body.appendChild(i);
  }
  setTimeout(function(){
    document.setTitle(title)
  }, 0);
}
