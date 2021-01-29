const COMPLETED = "completed"
const TEXT = "text"
const RANDOM_TO_DO_COUNT = 3
const MIN_INDEX = 1;
const MAX_INDEX = 201;
let currentToDoList = [];

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
                clearToDoListsObjects();
            }

            convertFileContentToJSON(reader);
            clearToDoList();
            let toDoList = getSortedList();

            handleTasksListBox(toDoList);

            fillTasksStatusBar();
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
        list.children[0].remove();
    }
}
function clearToDoListsObjects() {
    while (currentToDoList.length > 0) {
        currentToDoList.splice(0, 1);
    }
    console.log(JSON.stringify(currentToDoList));
}
function convertFileContentToJSON(reader) {
    let fileString;
    fileString = reader.result;
    let stringArray = fileString.split('\n'); //массив из строк файла
    let properties = stringArray[0].split(',');
    for (let i = stringArray.length - 1; i >= 1; i--) {
        if (stringArray[i] === "") { //пустая строка
            break;
        }
        let values = stringArray[i].split(',');
        let toDoItem = {};
        for (let j = 0; j < properties.length; j++) {
            toDoItem[properties[j].trim()] = values[j].trim();
        }
        currentToDoList.unshift(toDoItem);
    }

    console.log(JSON.stringify(currentToDoList));
}
function handleTasksListBox(toDoList) {

    let ul = document.getElementById("list");

    for (let i = toDoList.length - 1; i >= 0; i--) {
        let li = document.createElement("LI");
        li.innerHTML = toDoList[i].text;
        if (toDoList[i].completed === "true") {
            li.classList.add(COMPLETED);
        }

        let closeButton = addCloseBtn();
        li.append(closeButton);

        ul.prepend(li);
    }

}
function addCloseBtn() {
    let closeButton = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    closeButton.className = "closeButton";
    closeButton.append(txt);
    return closeButton;
}
function deleteListItem() { //замечание:если обрабатываются нажатия на список элементов, лучше-event.target
    let list = document.getElementById("list");
    list.addEventListener('click', function (event) { //ul-т.к. будет отслеживание вложенных элементов
        if (event.target.className === "closeButton") { //именно "крестик"
            let itemIndexToDelete = Array.from(list.children).indexOf(event.target.parentElement);
            event.target.parentElement.remove(); //не скрыть а удалить

            currentToDoList.splice(itemIndexToDelete, 1);
            console.log(JSON.stringify(currentToDoList));

            fillTasksStatusBar();
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

            let toDoItem = {};
            toDoItem[TEXT] = newListItem.innerHTML;
            toDoItem[COMPLETED] = "false";
            currentToDoList.unshift(toDoItem);
            console.log(JSON.stringify(currentToDoList));

            let closeButton = addCloseBtn();
            newListItem.append(closeButton);

            list.prepend(newListItem);

            input.value = "";

            fillTasksStatusBar();
        }
    }, false);
}
function markCompletedTask() {
    let list = document.getElementById("list");
    list.addEventListener('click', function (event) {//ul-т.к. будет отслеживание вложенных элементов       
        if (event.target.tagName === "LI") {//именно элемент списка
            let itemIndexToMark = Array.from(list.children).indexOf(event.target);
            event.target.classList.toggle(COMPLETED);//есть такой класс-удаляет как remove, нет-добавляет как add

            if (event.target.classList.contains(COMPLETED)) {
                currentToDoList[itemIndexToMark].completed = "true";
                addItemtoCompletedListHead(itemIndexToMark);
            }
            else {
                currentToDoList[itemIndexToMark].completed = "false";
                addItemtoUncompletedListHead(itemIndexToMark);
            }
            console.log(JSON.stringify(currentToDoList));

            fillTasksStatusBar();
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
            listItems[i].classList.remove(COMPLETED);
            currentToDoList[i].completed = "false";
        }
        console.log(JSON.stringify(currentToDoList));
        fillTasksStatusBar();
    })
    on.addEventListener('change', function () {
        for (i = 0; i < listItems.length; i++) {
            listItems[i].classList.add(COMPLETED);
            currentToDoList[i].completed = "true";
        }
        console.log(JSON.stringify(currentToDoList));
        fillTasksStatusBar();
    })
}
function exportFile() {
    let exportButton = document.getElementById("exportButton");
    exportButton.addEventListener('click', function () {

        let fileText = convertJSONToFileText(currentToDoList);
        console.log(fileText);

        let file = writeToFile(fileText);
        exportButton.href = URL.createObjectURL(file); //создает DOMString, содержащий URL с указанием на объект, заданный как параметр
        exportButton.download = file.name; //не переходит по ссылке, а предлагает скачать док

    }, false)

}
function convertJSONToFileText(toDoList) {
    let fileText = [];
    fileText.push(TEXT + ", " + COMPLETED + "\n");
    for (let i = 0; i < toDoList.length; i++) {
        fileText.push(toDoList[i].text + ", " + toDoList[i].completed + "\n");
    }
    return fileText;
}
function writeToFile(fileText) {
    let file = new File(fileText, "toDoList.csv");
    return file;
}
function fillTasksStatusBar() {
    let list = document.getElementById("list");
    let statusBar = document.getElementById("statusBar");
    if (!list.children.length) {
        statusBar.children[0].textContent = "completed:0 uncompleted:0";
    }
    else {
        statusBar.children[0].textContent = `completed:${getCompletedTasksCount()} uncompleted:${list.children.length - getCompletedTasksCount()}`;
    }
}
function getCompletedTasksCount() {
    let list = document.getElementById("list");
    let completedTasksCount = 0;
    for (let i = 0; i < list.children.length; i++) {
        if (list.children[i].classList.contains(COMPLETED)) {
            completedTasksCount++;
        }
    }
    return completedTasksCount;
}
function getSortedList() {
    let completedToDoList = [];
    let uncompletedToDoList = [];
    for (let i = 0; i < currentToDoList.length; i++) {
        if (currentToDoList[i].completed === "true") {
            completedToDoList.push(currentToDoList[i]);
        }
        else {
            uncompletedToDoList.push(currentToDoList[i]);
        }
    }
    let sortedToDoList = uncompletedToDoList.concat(completedToDoList);
    return sortedToDoList;
}
function addItemtoCompletedListHead(itemIndexToMark) {
    let list = document.getElementById("list");
    for (let i = list.children.length - 1; i >= 0; i--) {
        if (!list.children[i].classList.contains(COMPLETED)) {
            list.children[i].after(list.children[itemIndexToMark]); //сразу после последнего невыполненного
            break;
        }
    }
}
function addItemtoUncompletedListHead(itemIndexToMark) {
    let list = document.getElementById("list");
    list.children[0].before(list.children[itemIndexToMark]);
}
function generateThreeRandomToDos() {
    let toDosGeneratingButton = document.getElementById("toDosGeneratingButton");
    toDosGeneratingButton.addEventListener('click', async function () {
        for (let i = 0; i < RANDOM_TO_DO_COUNT; i++) {

            generateRandomNumber(MIN_INDEX, MAX_INDEX);

            let response = await fetch(`https://jsonplaceholder.typicode.com/todos/${randomNumber}`);
            let toDoItem = await response.json();

            let newListItem = {}
            newListItem[TEXT] = toDoItem.title;
            newListItem[COMPLETED] = toDoItem.completed;

            currentToDoList.unshift(newListItem);

            addRandomItemToList(toDoItem);
            
        }
        console.log(JSON.stringify(currentToDoList));
        fillTasksStatusBar();

    }, false);

}
function generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return randomNumber = Math.floor(Math.random() * (max - min)) + min;
}
function addRandomItemToList(toDoItem){
    let ul = document.getElementById("list");
    let li = document.createElement("LI");

    li.innerHTML = toDoItem.title;

    let closeButton = addCloseBtn();
    li.append(closeButton);

    ul.prepend(li);

    if (toDoItem.completed === true) {
        li.classList.add(COMPLETED);
        addItemtoCompletedListHead(0);
    }
}

fillTasksStatusBar();
importFile();
deleteListItem();
addListItem();
markCompletedTask();
switchListItemsState();
exportFile();
generateThreeRandomToDos();



