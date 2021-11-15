const express = require('express');
const app = express();

app.all('/', (req, res) => {
	res.send(`<meta property="og:description"
  content="Don\'t ask me what i can do." />
<meta property="og:title" content="Baltraz" />
  <style>
body {
  background: rgb(255, 255, 255);
  background-image: url("https://cdn.discordapp.com/attachments/848133914971209728/855088261785583636/ranger-4df6c1b6.png");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
h4 {
  color: white;
}
.Align1{
  margin: 0;
  position: absolute;
  top: 50%;
  left: 30%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.Align2{
  margin: 0;
  position: absolute;
  top: 50%;
  left: 60%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.Button {
  background-color: #25d7a7; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
  </style>
  <a href="https://top.gg/bot/839835292785704980">
  <img src="https://top.gg/api/widget/839835292785704980.svg" alt="Sky Bot" />
  </a>
  
  <form method="get" action="https://discord.gg/Ca6XpTRQaR">
    <input class="Button Align1" type="submit" value="Support Server" />
  </form>
  <form method="post" action="https://discord.com/oauth2/authorize?client_id=839835292785704980&permissions=470150231&scope=bot"> 
    <input class="Button Align2" type="submit" value="Invite The Bot" />
  </form> Website By: Knei</p>`);
});

function keepAlive() {
	app.listen(3000);
}

module.exports = keepAlive;
