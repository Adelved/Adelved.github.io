var buttonDiv = document.getElementById('locationButtons')
for(var i = 0; i < buttonDiv.children.length; i++){
    buttonDiv.children[i].style.marginTop = String(i * 50)+"px"
    if(i >= buttonDiv.children.length/2){
        buttonDiv.children[i].style.marginLeft = String(i * 50)+"px"
    }
}