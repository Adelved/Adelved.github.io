
var foot = document.getElementById("footer");

//Adds logo
var ul = document.createElement('ul')
var li = document.createElement("li");
var img = document.createElement('img')
img.setAttribute('class','logo')
li.appendChild(img)
ul.appendChild(li)
foot.append(ul)

const content = ['Kjøpmannsgata 1', "7013, Trondheim", "info@spisitrondheim.no"]

//Adds footer-text
for (var i = 0; i < content.length; i++) {
  var li = document.createElement("li");
  var a = document.createElement("a");
  a.innerText = content[i];
  li.appendChild(a);
  ul.appendChild(li)
  foot.append(ul)
}
const socialMediaPath = "../resources/images/SoMe/"
const socialMediaNames = ['facebook.svg', "instagram.svg", "twitter.svg"]

for (var i = 0; i < socialMediaNames.length; i++){
  var svg = createSVG(socialMediaPath + socialMediaNames[i], socialMediaNames[i], "location-marker")
  var a = document.createElement('a')
  a.setAttribute('href',"https://".concat(socialMediaNames[i].split(".")[0].concat('.com')))
  a.setAttribute('target', '_blank')
  a.appendChild(svg)
  var li = document.createElement("li");
  li.setAttribute('class', "imageLiElement")
  li.appendChild(a)
  ul.appendChild(li)
  foot.append(ul)
}