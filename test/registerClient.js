//import * from "loginClient.js";

// const net = require('net');
// const client = new net.Socket();
// client.connect({ port: 59090, host: process.argv[2] });
// client.on('data', (data) => {
//   console.log(data.toString('utf-8'));
// });

// 임시로..
var objPeople = [
	{ // Object @ 0 index
		Id: "sam",
		password: "codify"
	},
	{ // Object @ 1 index
		Id: "matt",
		password: "academy"
	},
	{ // Object @ 2 index
		Id: "chris",
		password: "forever"
	}

]


const idCheck = (id, people) => {
    for(var i = 0; i<people.length; i++){
        if(id == people[i].Id){
            return false;
        }
        else {
            return true;
        }
    }
}

document.getElementById("id_check").addEventListener("click", (e)=>{
    const id = document.getElementById("id").value
    const duplicateMsg = document.getElementById("duplicate_msg")

    const flag = idCheck(id,objPeople)
    if(flag){
        duplicateMsg.innerHTML = "사용해도 좋은 ID입니다"
    } else {
        duplicateMsg.innerHTML="이미 존재하는 ID입니다."
    }

} )


document.getElementById("btnJoin").addEventListener("click", (e)=>{
    const id = document.getElementById("id").value
    const flag = idCheck(id, objPeople);
    //console.log(idCheck);
    const pw1 = document.getElementById("pswd1").value
    const pw2 = document.getElementById("pswd2").value


    const name = document.getElementById("name").value

    if(flag)
    {
        if(pw1 == pw2){
            const newUser = {Id:id, password:pw1}
            objPeople.push(newUser)
            const successMsg = document.createElement('label')
            successMsg.textContent = "회원가입 성공"
            document.getElementById('btn_area').appendChild(successMsg)
            

            
            // 디비에 저장...
        }
    }
})