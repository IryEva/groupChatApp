function sendMessage(event) {
    event.preventDefault();
    let message = document.getElementById("chat-input").value;
    let obj = {
      message: message,
    };
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:3000/user/message", obj, {
        headers: { Authorization: token },
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
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/user/getmessage",{ headers: { Authorization: token } })
      if(response.status == 201){
        for(let i=0; i<response.data.message.length;i++){
          showOnChatBox(response.data.message[i].username, response.data.message[i].message)
      }
      }

    }catch(err){
      console.log(err);

    }
  

  setInterval(async() => {
    try{
    const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/user/getmessage", {
        headers: { Authorization: token },
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
    } catch (err) {
      console.log(err);
    }

  }, 1000);
  });

  function showOnChatBox(username,message){
    const parentnode = document.getElementById("output")
    const childnode = `<p>${username}:${message}</p>`
    parentnode.innerHTML += childnode;

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push({ username, message });
    localStorage.setItem("messages", JSON.stringify(messages));
  }