let listItems = document.getElementsByTagName("LI");
let i;
for (i = 0; i < listItems.length; i++) {
    let closeButton = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    closeButton.className = "closeButton";
    closeButton.append(txt);
    listItems[i].append(closeButton);
}

let closeButtonList = document.getElementsByClassName("closeButton");
for (i = 0; i < closeButtonList.length; i++) {
    closeButtonList[i].addEventListener('click', function () {
        this.parentElement.style.display = "none";
    }, false)
}

let addButton = document.getElementById("addButton");
let input = document.getElementById("input");
let list = document.getElementById("list");
addButton.addEventListener('click', function () {
    if(input.value === ""){
        alert("You should fill the field");
    }
    else{
        let newListItem = document.createElement("LI");
        newListItem.innerHTML = input.value;
        list.prepend(newListItem);
        input.value = "";
    }
}, false);

