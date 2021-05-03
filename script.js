'use strict';

let colorSelector = document.querySelectorAll(".priority-i");
let mainContainer = document.querySelector(".main-container");
let plusBtn = document.querySelector(".fas.fa-plus.sign");
let crossBtn = document.querySelector(".fas.fa-times.sign");
let crossBtnClicked = false;
let taskArray = [];
let colorArray = ["#f8a593","#ff7575","#e17155","#d63030"];


let numOfTask = 0;
if(localStorage.getItem("alltask")){
    let stringTaskArray = localStorage.getItem("alltask");
    taskArray = JSON.parse(stringTaskArray);
    let len = taskArray.length;
    for(let i=0;i<len;i++){
        let obj = taskArray[i];
        makeTask(obj.desc,obj.color,true,obj.id);
    } 
}



for(let color=0;color<colorSelector.length;color++){
    colorSelector[color].addEventListener("click",function(e){
        let colorId = colorSelector[color].getAttribute("color");
        colorId = "#"+colorId;

        let taskList = mainContainer.querySelectorAll(".task-container");
        console.log("colorrId : ",colorId);
        for(let i=0;i<taskList.length;i++){
            mainContainer.removeChild(taskList[i]);
        }

        console.log(taskArray.length);
        for(let i=0;i<taskArray.length;i++){
            let obj = taskArray[i];
            console.log(obj.color);
            if(obj.color == colorId){
                console.log(obj.color);
                makeTask(obj.desc,obj.color,true,obj.id);
            }
        }

    })
}


plusBtn.addEventListener("click",function(e){
    createModalBox();
    let currentColor = "#d63030";
    //Modal Box is already created , So we can 
    //fetch priority-btn to now which color is currently clicked
    let priorityBtns = document.querySelectorAll(".priority-btn");
    for(let i=0; i< priorityBtns.length;i++){
        priorityBtns[i].addEventListener("click",function(){
            priorityBtns.forEach(priorityBtn => {
                priorityBtn.classList.remove("priority-selector-border");
            })
            let color = priorityBtns[i].classList[1];
            if(color == "first-P") currentColor = "#f8a593";
            else if(color == "second-P") currentColor = "#ff7575";
            else if(color == "third-P") currentColor = "#e17155";
            else currentColor = "#d63030";
            priorityBtns[i].classList.add("priority-selector-border");
            
        })
    }

    let inputBox = document.querySelector(".input-box");
    inputBox.addEventListener("keydown",function(e){
        if(e.key == "Enter" && inputBox.value != ""){
            let taskInput = inputBox.value;
            console.log("While making Task , current color is : ",currentColor);
            makeTask(taskInput,currentColor,false);
            document.querySelector(".modal-box").remove();
        } 
    })

})

function makeTask(taskInput, colorValue , created ,givenTaskId){
    let taskContainer = document.createElement("div");
    var uid = new ShortUniqueId();
    let taskId;
    if(givenTaskId == null) taskId = uid();
    else taskId = givenTaskId;

    taskContainer.setAttribute("class",`task-container`);
    taskContainer.classList.add(`taskNum${numOfTask++}`)
    taskContainer.innerHTML = ` <div class="priority-line">
    
    </div>
    <h3 class="task-id">#${taskId}</h3>
    <div class="task-description" contenteditable="true">
        ${taskInput}
    </div>`;
    mainContainer.appendChild(taskContainer);
    let priorityLine = taskContainer.querySelector(".priority-line");
    priorityLine.style.backgroundColor= colorValue;

    taskContainer.addEventListener('dblclick', function (e) {
        if(crossBtnClicked){
            let currentNode = e.currentTarget;
            let taskIdContainer = currentNode.querySelector(".task-id");
            let taskid = taskIdContainer.innerText.substring(1);
            taskArray = taskArray.filter(function( obj ) {
                return obj.id != taskid;
            });
            let stringTaskArray = JSON.stringify(taskArray);
            localStorage.setItem("alltask",stringTaskArray);
            currentNode.parentNode.removeChild(currentNode);
            crossBtnClicked = false;
        }
    });

    let taskDescriptionContainer = taskContainer.querySelector(".task-description");
    taskDescriptionContainer.addEventListener("keypress",function(e){
        if(e.key == 'Enter' && !e.shiftKey){
            let newInput = taskDescriptionContainer.innerText;
            let currentTaskId = taskDescriptionContainer.parentNode.children[1].innerText.substring(1);
            taskArray = taskArray.filter(function( obj ) {
                if(obj.id === currentTaskId){
                    obj.desc = newInput;
                }
                return obj;
            });
            let stringTaskArray = JSON.stringify(taskArray);
            localStorage.setItem("alltask",stringTaskArray);
            taskDescriptionContainer.blur();
        }
    })

    let taskColorContainer = taskContainer.querySelector(".priority-line");
    taskColorContainer.addEventListener("click",function(e){
        let bgcolor = taskColorContainer.style.backgroundColor;
        bgcolor = rgb2hex(bgcolor);
        let idx = colorArray.indexOf(bgcolor);
        //update bgcolor value
        bgcolor = colorArray[(idx+1)%4];
        //updating bgcolor of taskColorContainer
        taskColorContainer.style.backgroundColor = bgcolor;

        let currentTaskId = taskColorContainer.parentNode.children[1].innerText.substring(1);
            taskArray = taskArray.filter(function( obj ) {
                if(obj.id === currentTaskId){
                    obj.color = bgcolor;
                }
                return obj;
            });
        
        let stringTaskArray = JSON.stringify(taskArray);
        localStorage.setItem("alltask",stringTaskArray);

    })

    if(!created){
        let taskobj = {
            id : taskId,
            desc : taskInput,
            color : colorValue
        }

        taskArray.push(taskobj);
        let stringTaskArray = JSON.stringify(taskArray);
        localStorage.setItem("alltask",stringTaskArray);
    }
}


function createModalBox(){
    let element = document.querySelector(".modal-box");
    if(element == null){

    let modalBox = document.createElement("div");
    modalBox.setAttribute("class","modal-box");
    
    let inputBox = document.createElement("textarea");
    inputBox.setAttribute("class","input-box");
    inputBox.setAttribute("placeholder","Enter Your Text Here");
    modalBox.appendChild(inputBox);

    let colorPriorityDiv = document.createElement("div");
    colorPriorityDiv.setAttribute("class","hit-priority");

    let firstP = document.createElement("div");
    firstP.setAttribute("class","priority-btn first-P");
    let secondP = document.createElement("div");
    secondP.setAttribute("class","priority-btn second-P");
    let thirdP = document.createElement("div");
    thirdP.setAttribute("class","priority-btn third-P");
    let fourthP = document.createElement("div");
    fourthP.setAttribute("class","priority-btn fourth-P");

    colorPriorityDiv.appendChild(firstP);
    colorPriorityDiv.appendChild(secondP);
    colorPriorityDiv.appendChild(thirdP);
    colorPriorityDiv.appendChild(fourthP);

    modalBox.appendChild(colorPriorityDiv);
    mainContainer.appendChild(modalBox);

    fourthP.classList.add("priority-selector-border");
    }
    
}

crossBtn.addEventListener("click",function(e){
    crossBtnClicked = true;
})



//Function to convert rgb color to hex format
var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
function rgb2hex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }

// Tutorial Function
function tutorial(){
    let body = document.body;
    body.innerHTML += `<div class="block-ui"></div>`;
    let blockUIContainer = body.querySelector(".block-ui");
    blockUIContainer.innerHTML = `<div class="things">
    <div class="content">
      <div class="arrow">
        <div class="curve"></div>
        <div class="point"></div>
      </div>
    </div> 
  </div>`;

    addFirstTutorial();
    function addFirstTutorial(){

    }
}