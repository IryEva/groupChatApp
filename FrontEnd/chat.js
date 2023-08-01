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