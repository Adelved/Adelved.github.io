const pages = [["home", "Hjem","./index.html"],
  ["contact", "Kontakt oss", "./contact.html"],
  ["about", "Om oss", "./about.html"],
  ["restaurant","Finn Restaurant", "./find-restaurant.html"]];

var currentPage = document.getElementsByTagName("html")[0].id;
var nav = document.getElementById("navbar");

//Adds logo with link to home
var li = document.createElement("li");
var img = document.createElement('img')
var a = document.createElement("a")
a.setAttribute("href","./index.html")
a.setAttribute('class','logo')
a.appendChild(img)
li.appendChild(a)
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
