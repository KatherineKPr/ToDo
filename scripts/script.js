
function importFile() {

    let importInput = document.getElementById("import");
    importInput.addEventListener('change', function () {

        let file = importInput.files[0];// сам файл
        let reader = new FileReader();
        reader.readAsText(file); //для получения строки
        //события
        reader.onload = function () { //файл загружен

            console.log(reader.result);

            let replaceToDos = pollUser();
            if (replaceToDos) {
                clearToDoList();
            }

            let toDoList = convertFileContentToJSON(reader);
            console.log(JSON.stringify(toDoList)); //вывод объектов

            handleTasksListBox(toDoList);


        };

        reader.onerror = function () {
            console.log(reader.error);
        };

    }, false)

}
function pollUser() {
    let replaceToDos = confirm("Do you want replace todos?");
    return replaceToDos;
}
function clearToDoList() {
    let list = document.getElementById("list");
    let listLength = list.children.length;
    for (let i = 0; i < listLength; i++) {
        console.log(list.firstChild);
        list.removeChild(list.firstChild);
    }
}
function convertFileContentToJSON(reader) {
    let toDoList = [];
    let fileString;
    fileString = reader.result;
    let stringArray = fileString.split('\n'); //массив из строк файла
    let properties = stringArray[0].split(',');
    for (let i = 1; i < stringArray.length; i++) {
        if(stringArray[i] === ""){ //пустая строка
            break;
        }
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
function exportFile() {
    let exportButton = document.getElementById("exportButton");
    exportButton.addEventListener('click', function () {
        let toDoList = convertHTMLtoJSON();
        console.log(JSON.stringify(toDoList));

        let fileText = convertJSONToFileText(toDoList);
        console.log(fileText);

        let file = writeToFile(fileText);
        exportButton.href = URL.createObjectURL(file); //создает DOMString, содержащий URL с указанием на объект, заданный как параметр
        exportButton.download = file.name; //не переходит по ссылке, апредлагает скачать док
    }, false)

}
function convertHTMLtoJSON() {
    let toDoList = [];
    let list = document.getElementById("list");
    let properties = ["text", "completed"];
    for (let i = 0; i < list.children.length; i++) {
        let toDoItem = {};
        toDoItem[properties[0]] = list.children[i].textContent.slice(0, -1); //inner html - с тегами, 0-начало, -1-до предпоследнего символа
        if (list.children[i].classList.contains("completed")) {
            toDoItem[properties[1]] = "true";
        }
        else {
            toDoItem[properties[1]] = "false";
        }
        toDoList.push(toDoItem);
    }
    return toDoList;
}
function convertJSONToFileText(toDoList) {
    let fileText = [];
    fileText.push("text, completed\n");
    for (let i = 0; i < toDoList.length; i++) {
        fileText.push(toDoList[i].text + ", " + toDoList[i].completed + "\n");
    }
    return fileText;
}
function writeToFile(fileText) {
    let file = new File(fileText, "toDoList.csv");
    return file;
}

importFile();
deleteListItem();
addListItem();
markCompletedTask();
switchListItemsState();
exportFile();



