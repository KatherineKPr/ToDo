
function importFile() {

    let importInput = document.getElementById("import");
    importInput.addEventListener('change', function () {
        fileLoaded = false;
        let file = importInput.files[0];// сам файл
        let reader = new FileReader();
        reader.readAsText(file); //для получения строки
        //события
        reader.onload = function () { //файл загружен

            console.log(reader.result);

            let toDoList = getToDoItemsObjects(reader);
            console.log(JSON.stringify(toDoList)); //вывод объектов

            handleTasksListBox(toDoList);

           
        };

        reader.onerror = function () {
            console.log(reader.error);
        };

    }, false)

}
function getToDoItemsObjects(reader) {
    let toDoList = [];
    let fileString;
    fileString = reader.result;
    let stringArray = fileString.split('\n'); //массив из строк файла
    let properties = stringArray[0].split(',');
    for (let i = 1; i < stringArray.length; i++) {
        let values = stringArray[i].split(',');

        let toDoItem = {};
        for (let j = 0; j < properties.length; j++) {
            toDoItem[properties[j].trim()] = values[j].trim();
        }
        toDoList.push(toDoItem); //массив объектов
    }
    return toDoList;
}
function handleTasksListBox(toDoList) {
   
    let ul = document.getElementById("list"); 
       
    for (let i = 0; i < toDoList.length; i++) {
        let li = document.createElement("LI");
        li.innerHTML = toDoList[toDoList.length - 1 - i].text;
        if (toDoList[toDoList.length - 1 - i].completed === "true") {
            li.classList.add("completed");
        }
        ul.prepend(li);
    }

    let loadedListLength = toDoList.length;
    addCloseBtnToExistingList(loadedListLength);

}
function addCloseBtn() {
    let closeButton = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    closeButton.className = "closeButton";
    closeButton.append(txt);
    return closeButton;
}
function addCloseBtnToExistingList(loadedListLength) {
    let listItems = document.getElementsByTagName("LI");
    let i;
    for (i = 0; i < loadedListLength; i++) {
        let closeButton = addCloseBtn();
        listItems[i].append(closeButton);
    }
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
        if (!(input.value === "")) {
            let newListItem = document.createElement("LI");
            newListItem.innerHTML = input.value;

            let closeButton = addCloseBtn();
            newListItem.append(closeButton);

            list.prepend(newListItem);

            input.value = "";
        }
    }, false);
}
function markCompletedTask() {
    let list = document.getElementById("list");
    list.addEventListener('click', function (event) {//ul-т.к. будет отслеживание вложенных элементов
        // listItems[i].classList.toggle("completed"); так нельзя, событие не обрабатывается, li считается неопределенным
        if (event.target.tagName === "LI") {//именно элемент списка
            event.target.classList.toggle("completed");//есть такой класс-удаляет как remove, нет-добавляет как add
        }
    }, false);
}
function switchListItemsState() {
    let listItems = document.getElementsByTagName("LI");
    let off = document.getElementById("off");
    let on = document.getElementById("on");
    let i;
    off.addEventListener('change', function () {
        for (i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove("completed");
        }
    })
    on.addEventListener('change', function () {
        for (i = 0; i < listItems.length; i++) {
            listItems[i].classList.add("completed");
        }
    })
}

importFile();
deleteListItem();
addListItem();
markCompletedTask();
switchListItemsState();




