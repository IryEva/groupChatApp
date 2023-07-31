async function signup() {
    event.preventDefault();
    try{
     //const email= document.getElementById("email").value;
      //console.log(email);
       console.log(event.target.email.value);
       console.log(event.target);
        const signupDetails ={
         name: event.target.name.value,
         email: event.target.email.value,
         password: event.target.password.value, 
         phonenumber: event.target.phonenumber.value
 
        } 
    
      console.log(signupDetails)
      const response = await axios.post("http://localhost:3000/user/signup",signupDetails)
      if(response.status === 201) {
        window.location.href = "../groupChatApp/FrontEnd/login.html"
 
      } else {
        throw new Error('Failed to login')
 
      }
 
    }
    catch(err){
      document.body.innerHTML += `<div style="color:red;">${err} <div> `;
 
    }
  }