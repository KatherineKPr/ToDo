function addCloseBtn() {
    let closeButton = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    closeButton.className = "closeButton";
    closeButton.append(txt);
    return closeButton;
}
function deleteListItem() {//замечание:если обрабатываются нажатия на список элементов, лучше-event.target
    let list = document.getElementById("list");
    list.addEventListener('click', function (event) {//ul-т.к. будет отслеживание вложенных элементов
        if (event.target.className === "closeButton") {//именно "крестик"
            event.target.parentElement.style.display = "none";
        }
    }, false);
}
function addListItem() {
    let addButton = document.getElementById("addButton");
    let input = document.getElementById("input");
    let list = document.getElementById("list");
    addButton.addEventListener('click', function () {
        if (input.value === "") {
            alert("You should fill the field");
        }
        else {
            let newListItem = document.createElement("LI");
            newListItem.innerHTML = input.value;

            let closeButton = addCloseBtn();
            newListItem.after(closeButton);

            let liBlock = document.createElement("div");
            liBlock.className = "liBlock";

            liBlock.append(newListItem);
            liBlock.append(closeButton);

            list.prepend(liBlock);
            input.value = "";
        }
    }, false);
}
function addCloseBtnToExistingList() {
    let listItems = document.getElementsByTagName("LI");
    let i;
    for (i = 0; i < listItems.length; i++) {
        let closeButton = addCloseBtn();
        listItems[i].after(closeButton);
    }
}
function markCompletedTask() {
    let list = document.getElementById("list");
    list.addEventListener('click', function (event) {//ul-т.к. будет отслеживание вложенных элементов
        // listItems[i].classList.toggle("marked"); так нельзя, событие не обрабатывается, li считается неопределенным
        if (event.target.tagName === "LI") {//именно элемент списка
            event.target.classList.toggle("marked");//есть такой класс-удаляет как remove, нет-добавляет как add
        }
    }, false);
}

addListItem();
addCloseBtnToExistingList();
deleteListItem();
markCompletedTask();






