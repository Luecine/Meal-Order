var objPeople = [
	{ // Object @ 0 index
		username: "tollea1234",
		password: "skyss123"
	},
	{ // Object @ 1 index
		username: "matt",
		password: "academy"
	},
	{ // Object @ 2 index
		username: "chris",
		password: "forever"
	}

]



function getInfo() {
	var username = document.getElementById('username').value
	var password = document.getElementById('password').value

	for(var i = 0; i < objPeople.length; i++) {
		// check is user input matches username and password of a current index of the objPeople array
		if(username == objPeople[i].username && password == objPeople[i].password) {
			console.log(username + " is logged in!!!")
            // stop the function if this is found to be true
            const login_msg = document.createElement("button");
            login_msg.textContent = username + " is logged in!! Click this for next page"
			login_msg.addEventListener("click", (e)=>{
				window.location.href="next.html"
			})
			
			document.getElementById("login").appendChild(login_msg);
			
			
		}
	}
	console.log("incorrect username or password")
}