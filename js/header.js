const pages = [["home", "Home","./index.html"],
  ["contact", "Contact us", "./contact.html"],
  ["about", "About us", "./about.html"],
  ["restaurant","Find Restaurant", "./find-restaurant.html"]];

var currentPage = document.getElementsByTagName("html")[0].id;
var nav = document.getElementById("navbar");

//Adds logo
var li = document.createElement("li");
var img = document.createElement('img')
img.setAttribute('class','logo')
li.appendChild(img)
nav.appendChild(li)


//Adds page-buttons
for (var i = 0; i < pages.length; i++) {
  var li = document.createElement("li");
  var a = document.createElement("a");
  if (pages[i][0]==currentPage){
      a.classList.add("active")
  }
  a.innerText = pages[i][1];
  a.setAttribute("href", pages[i][2]);
  li.appendChild(a);
  nav.appendChild(li)
}
