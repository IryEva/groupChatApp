const socket=io('http://localhost:3000');

function sendMessage(event) {
    event.preventDefault();
    let message = document.getElementById("chat-input").value;
    const groupdata = JSON.parse(localStorage.getItem('groupDetails'));
    const groupId = groupdata.id
    let obj = {
      message: message,
      groupId: groupId
    };
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:3000/user/message", obj, {
        headers: {" Authorization": token },
      })
      .then((response) => {
        alert("Message Sent");
      })
      .catch((err) => {
        console.log(err);
      });
  }

   document.addEventListener("DOMContentLoaded", async() => {
     try{
      const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
      const grpid=localStorage.getItem('groupId');
       const token = localStorage.getItem("token")
       const response = await axios.get(`http://localhost:3000/user/getmessage?groupid=${grpid}`,{ headers: { "Authorization": token } })
       if(response.status == 201){
         for(let i=0; i<response.data.message.length;i++){
           showOnChatBox(response.data.message[i].username, response.data.message[i].message)
       }
       }
     
        getMessage();
        showGroupName(groupDetails.groupName);
        getGroups();
       // showUserName();
      
      
     }catch(err){
       console.log(err);

     }});
  


  const getMessage = async() => {
    try{
      const grpid=localStorage.getItem('groupId');
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/user/getmessage?groupid=${grpid}`, {
        headers: {" Authorization": token },
      });
      if (response.status == 201) {
        document.getElementById("output").innerHTML = "";
        // Display the new messages
        for (let i = 0; i < response.data.message.length; i++) {
          showOnChatBox(
            response.data.message[i].username,
            response.data.message[i].message
          );
        }
      }

    }catch(error){
      console.log(error);
    }
  }

  function showOnChatBox(username,message){
    const parentnode = document.getElementById("output")
    const childnode = `<p>${username}:${message}</p>`
    parentnode.innerHTML += childnode;

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ username, message });
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const getGroups = async() => {
  try {

  const token = localStorage.getItem('token');
  const res = await axios.get('http://localhost:3000/users/get-group', { headers: {"Authorization": token }});
  console.log(res);
  const listGroups = res.data.listOfGroups;
  const listUsers = res.data.listOfUsers;
  listGroups.forEach(groups => {
      showGroupsOnScreen(groups)
  })
  showUsers.addEventListener('click', () => {
      document.getElementById('userLists').hidden = false;
      listUsers.forEach(users => {
          showUsersOnScreen(users)
      })
  });
  } catch(err) {
      console.log(err);
  }
}

const showGroupsOnScreen = (groups) => {
  const groupLists = document.getElementById('groupLists');

  const li = document.createElement('li');
  li.className = 'contact';

  const div = document.createElement('div');
  div.className = 'wrap';
  li.append(div);

  const p = document.createElement('p');
  p.textContent = groups.groupName;
  p.id = groups.id;

  div.append(p)
  groupLists.append(li)
}

const showUsersOnScreen = (users) => {
  const userLists = document.getElementById('userLists');

  const li = document.createElement('li');
  li.className = 'contact';

  const div = document.createElement('div');
  div.className = 'wrap';
  li.append(div);

  const p = document.createElement('p');
  p.textContent = users.name;

  div.append(p)
  userLists.append(li)
}

const boxName = document.getElementById('boxName');

const showGroupName = (groupName) => {
  boxName.textContent = `${groupName}`;
}



  const groupButton = document.getElementById('creategrp');

  groupButton.addEventListener('click',createGroup);

  async function createGroup (e) {
    try{
      e.preventDefault();

      const groupName = document.getElementById('groupName').value;
      
      const groupObj = {
        groupName: groupName
      }
      console.log(groupName);

      const token = localStorage.getItem('token');

      const res = await axios.post('http://localhost:3000/users/add-group', groupObj,
         { headers: {"Authorization": token }});
      console.log(res);
      localStorage.setItem('groupDetails', JSON.stringify(res.data.newGroup));
      //localStorage.setItem('isAdmin', JSON.stringify(true));
      alert(res.data.message)
      if(res.status === 202) {
      document.getElementById('groupName').value = '';
     }
    } catch(err) {
        console.log(err);
        document.getElementById('showResponse').textContent = err.response.data.error;
        document.getElementById('showResponse').style.color = 'red';
    }
  }