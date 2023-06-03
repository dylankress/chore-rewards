const url = 'https://sheetdb.io/api/v1/03vthxv39kzq9';
const chores = [];
let currentUser = "default";

// Updates the current date on the spreadsheet
function setDate() {
  var d = new Date();
  var datestring = (d.getMonth()+1) + "/" + d.getDate()  + "/" + d.getFullYear();
  fetch('https://sheetdb.io/api/v1/03vthxv39kzq9/id/1', {
    method: 'PATCH',
    headers: {'Accept': 'application/json',
        'Content-Type': 'application/json'},
    body: JSON.stringify({
        data: {'todayDate': datestring}})})
  .then((response) => response.json())
  .then((data) => console.log(data))
  console.log(currentUser);
};
  
// Console Logs a Download Complete messgae as soon as the data is fetched from the server
window.addEventListener("sheetdb-downloaded", function() {
  const users = document.getElementById('users');
  users.onchange = function() {
    var selectedUser = this.options[this.selectedIndex].getAttribute('value');
    currentUser = selectedUser;
    if (currentUser != "default") {
      displayChores();
      } else {
        console.log("Error!");
      };
  };

function displayChores () {
  fetch(url)
  .then(res => res.json())
  .then(data => {
    chores.push(...data);
    console.log(data);
    console.log(chores);

  var chore=document.getElementById("choreTable");
  for (var i = 0; i < data.length; i++) {
    var row=document.createElement("tr");
    row.innerHTML += `<td>` + data[i].choreName + `</td>
    <td>` + data[i].dueInDays + ` day(s)</td>
    <td><button id="choreButton" value="` + data[i].id + `" class="btn">Done</button></td>`;
    chore.appendChild(row);
  }});

  const Listen = (doc) => {
    return {
        on: (type, selector, callback) => {
            doc.addEventListener(type, (event)=>{
                if(!event.target.matches(selector)) return;
                callback.call(event.target, event);
            }, false);
        }
    }
  };

Listen(document).on('click', '.btn', function (e) {       
    const clickedButton = e.target.value;
    var d = new Date();
    var datestring = (d.getMonth()+1) + "/" + d.getDate()  + "/" + d.getFullYear();
    fetch('https://sheetdb.io/api/v1/03vthxv39kzq9/id/' + clickedButton, {
      method: 'PATCH',
      headers: {'Accept': 'application/json',
      'Content-Type': 'application/json'},
        body: JSON.stringify({
            data:
                {
                  'lastCompletionDate':datestring
                }
            })})
      .then((response) => response.json())
      .then((data) => console.log(data))});
    
    Listen(document).on('click', '.btn', function (e) {
        const buttonValue = e.target.value - 1;
        const cName = chores[buttonValue].choreName;
        const cBy = currentUser;
        const cReward = chores[buttonValue].rewardValue;
        const d = new Date();
      const datestring = (d.getMonth()+1) + "/" + d.getDate()  + "/" + d.getFullYear();
      fetch('https://sheetdb.io/api/v1/03vthxv39kzq9?sheet=completedChores', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: [
                {
                    'id': "INCREMENT",
                    'completionDate':datestring,
                    'completedChore':cName,
                    'completedBy':cBy,
                    'rewardValue':cReward
                }
            ]
        })})
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => {
        setTimeout(function(){
          document.location.reload();
       }, 500);
      })})}});