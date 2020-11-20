var objPeople = [
	{ // Object @ 0 index
		username: "sam",
		password: "codify"
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



function sendInfo() {
	let result = document.querySelector('.result')
	let username = document.querySelector('#username')
	let password = document.querySelector('#password')

	let xhr = new XMLHttpRequest()
	let url = "registerServer.js"

	xhr.open("POST", url, true)

	xhr.setRequestHeader("Content-Type", "application/json")

	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4 && xhr.status === 200){
			result.innerHTML = this.responseText;
		}
	}

	var data = JSON.stringify({"username":username.nodeValue, "password":password.value})

	xhr.send(data);
}