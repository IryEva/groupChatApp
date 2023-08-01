let submitbtn = document.getElementById('login');

submitbtn.addEventListener('click', login);

async function login(e) {
  e.preventDefault();
  try{ 
    //console.log(event.target.email.value);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginDetails ={
            
      email,
      password

    }
    console.log(loginDetails)
    const response = await axios.post("http://localhost:3000/user/login",loginDetails)
    if(response.status === 200) {
      alert(response.data.message)
      localStorage.setItem('token',response.data.token)
      window.location.href = "../FrontEnd/chat.html";

      } else {
          throw new Error(response.data.message)

        }

  }
  catch(err){
    //console.log(JSON.stringify(err))
    document.body.innerHTML += `<div style="color:red;">${err.message} <div> `

  }
}