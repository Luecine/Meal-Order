module.exports = {
    HTML:function(){
        return `
        <!DOCTYPE html>
        <html>
        <head>	
            <meta charset="UTF-8">
            <title>JavaScript Simple Login System</title>
            <link rel="shortcut icon" href="favicon.ico">
        </head>
        <body>
        로그인 페이지입니다!
        <br><br><br>
        
        
            <div class="login__container">
                <div id="login">
                    <form>
                        ID: <input type="text" id="username" placeholder="Choose Username" name="userid">
                        
                        <br>
                        비밀번호: <input type="text" id="password" placeholer="Choose Password" name="userpw">
                       
                       
                    </form>
                </div>
                
            </div>
            
        
            <script>
            $()
        
            </script>
        </body>
        </html>
        `;
    }
}

