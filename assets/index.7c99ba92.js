const l=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerpolicy&&(n.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?n.credentials="include":i.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}};l();const u="\u{1F47E} \xBFEst\xE1s seguro de reiniciar el juego? Perder\xE1s todo el progreso.",h="\u{1F389} \xA1Terminaste! \xA1Felicidades! \u{1F389}";class f{constructor({container:t,numpad:e,counter:s,size:i,board:n,win_msg:r}){this.container=t,this.numpad=e,this.counter=s,this.size=i,this.spacing=i/9,this.time="00:00",this.board=n,this.userBoard=n.map(o=>o.slice()),this.win_msg=r,this.selected={x:null,y:null},this.createCanvas(),this.createNumpad(),this.drawGrid(),this.drawBoardNumbers(),this.addEventListeners(),this.startCounter()}createCanvas(){const t=document.createElement("canvas");t.width=this.size,t.height=this.size,t.classList.add("sudokuShadows"),this.container.appendChild(t),this.shadowsCtx=t.getContext("2d");const e=document.createElement("canvas");e.width=this.size,e.height=this.size,e.classList.add("sudokuBoard"),this.container.appendChild(e),this.ctx=e.getContext("2d");const s=document.createElement("canvas");s.width=this.size,s.height=this.size,s.classList.add("sudokuUser"),this.container.appendChild(s),this.userCtx=s.getContext("2d")}createNumpad(){for(let e=0;e<=9;e++){const s=document.createElement("button");s.innerText=e===0?"Borrar":`${e}`,s.classList.add("sudokuButton-"+(e===0?"clear":"number")),s.addEventListener("click",()=>{this.onNumpadPress({number:e})}),this.numpad.appendChild(s)}const t=document.createElement("button");t.innerText="Reiniciar",t.classList.add("sudokuButton-restart"),t.addEventListener("click",()=>{confirm(u)&&this.restart()}),this.numpad.appendChild(t)}restart(){this.userBoard=this.board.map(t=>t.slice()),this.userCtx.clearRect(0,0,this.size,this.size),this.startCounter(),this.selected.x=null,this.selected.y=null,this.drawSelected()}onNumpadPress({number:t}){const{x:e,y:s}=this.selected;e===null||s===null||this.board[s][e]===0&&(this.userBoard[s][e]=t,this.drawNumber({ctx:this.userCtx,x:e,y:s,number:t!==0?t:"",color:"rgb(50, 40, 220)",clear:!0}),t!==0&&this.checkWin()&&(clearInterval(this.counterInterval),alert(h+`

Tu tiempo es: ${this.time}

`+this.win_msg)))}startCounter(){this.counterInterval&&clearInterval(this.counterInterval),this.counter.innerText="00:00";const t=Date.now();this.counterInterval=setInterval(()=>{const e=Date.now(),s=Math.floor((e-t)/1e3),i=Math.floor(s/60),n=s%60,r=`${i<10?"0":""}${i}:${n<10?"0":""}${n}`;this.counter.innerText=r,this.time=r},1e3)}checkArrayWin(t){const e=t.slice().sort((i,n)=>i-n),s=[1,2,3,4,5,6,7,8,9];return e.join("")===s.join("")}checkWin(){for(let t=0;t<9;t++){const e=this.userBoard[t];if(!this.checkArrayWin(e))return!1;const s=this.userBoard.map(i=>i[t]);if(!this.checkArrayWin(s))return!1}for(let t=0;t<3;t++)for(let e=0;e<3;e++){const s=this.userBoard.slice(t*3,t*3+3).map(i=>i.slice(e*3,e*3+3));if(!this.checkArrayWin(s.flat()))return!1}return!0}addEventListeners(){const t=this.userCtx.canvas;t.addEventListener("click",e=>{const s=t.getBoundingClientRect(),i=this.size/s.width,n=(e.clientX-s.left)*i,r=(e.clientY-s.top)*i,o=Math.floor(n/this.spacing),a=Math.floor(r/this.spacing);this.board[a][o]!==0?(this.selected.x=null,this.selected.y=null):(this.selected.x=o,this.selected.y=a),this.drawSelected()}),document.body.addEventListener("click",e=>{this.container.contains(e.target)||this.numpad.contains(e.target)||(this.selected.x=null,this.selected.y=null,this.drawSelected())})}drawSelected(){const t=this.shadowsCtx;if(t.clearRect(0,0,this.size,this.size),this.selected.x===null||this.selected.y===null)return;t.fillStyle="rgba(0, 255, 200, 0.15)";const e=this.spacing*this.selected.x,s=this.spacing*this.selected.y;t.fillRect(0,s,this.size,this.spacing),t.fillRect(e,0,this.spacing,this.size),t.fillStyle="rgba(0, 255, 200, 0.6)",t.fillRect(e,s,this.spacing,this.spacing)}drawNumber({ctx:t,x:e,y:s,number:i,color:n,clear:r=!1}){r&&t.clearRect(e*this.spacing,s*this.spacing,this.spacing,this.spacing),t.font=`bold ${this.size*25/400}px Roboto, Inter, Arial, sans-serif`,t.fillStyle=n,t.textAlign="center",t.textBaseline="middle",t.fillText(i,this.spacing*(e+.5),this.spacing*(s+.5))}drawBoardNumbers(){for(let t=0;t<9;t++)for(let e=0;e<9;e++){const s=this.board[t][e];s!==0&&this.drawNumber({ctx:this.ctx,x:e,y:t,number:s,color:"#000"})}}drawLine({ctx:t,horizontal:e,pos:s}){t.beginPath(),e?(t.moveTo(0,s),t.lineTo(this.size,s)):(t.moveTo(s,0),t.lineTo(s,this.size)),t.stroke()}drawGrid(){const t=this.ctx;t.strokeStyle="#000";const e=this.size*2.5/300,s="#000",i=this.size*1.5/300,n="#888";t.lineWidth=i,t.strokeStyle=n;for(let r=1;r<=8;r++){if(r%3==0)continue;const o=this.spacing*r;this.drawLine({ctx:t,horizontal:!0,pos:o}),this.drawLine({ctx:t,horizontal:!1,pos:o})}t.lineWidth=e,t.strokeStyle=s;for(let r=1;r<=8;r++){if(r%3!=0)continue;const o=this.spacing*r;this.drawLine({ctx:t,horizontal:!0,pos:o}),this.drawLine({ctx:t,horizontal:!1,pos:o})}}}const m=[{id:"ss1",sudoku:[[2,8,0,4,5,0,0,0,0],[9,0,0,7,2,0,1,0,0],[7,6,0,3,0,0,9,2,5],[0,0,0,0,6,3,7,0,1],[0,4,3,0,0,0,6,0,0],[6,5,0,1,9,4,0,3,0],[3,1,0,0,0,2,5,0,0],[5,0,2,0,7,1,0,6,3],[0,7,0,9,0,0,8,0,0]]},{id:"sa2",sudoku:[[0,8,3,0,0,0,9,5,0],[0,0,0,8,6,0,3,0,4],[4,0,9,0,2,3,7,0,0],[7,0,0,0,1,8,4,0,0],[0,9,0,0,0,0,0,0,0],[2,5,0,0,0,4,0,0,0],[9,0,0,7,0,5,0,4,8],[0,0,2,1,0,0,0,0,0],[0,0,0,0,4,0,0,3,0]]},{id:"tt1",sudoku:[[9,6,0,1,7,4,0,5,8],[1,7,8,3,2,5,6,4,9],[2,5,4,6,8,9,7,3,1],[8,2,1,4,3,7,5,9,6],[4,9,6,8,5,2,3,1,7],[0,3,5,9,6,1,8,2,4],[5,8,9,7,1,3,4,6,2],[3,1,7,2,4,6,9,8,5],[6,4,2,5,9,8,1,7,0]]},{id:"a12",sudoku:[[0,0,7,8,0,6,4,0,1],[3,0,0,0,0,0,0,0,5],[8,0,0,0,1,0,0,0,6],[0,0,3,6,0,2,0,0,9],[0,0,5,0,0,0,2,0,0],[1,0,0,9,0,3,5,0,0],[5,0,0,2,0,7,0,0,0],[0,0,1,0,0,0,6,0,0],[9,0,0,0,8,0,7,3,0]]},{id:"b23",sudoku:[[0,0,9,7,0,0,2,3,0],[4,0,0,0,0,5,0,0,0],[6,0,0,8,2,0,1,0,5],[0,0,0,0,0,0,0,4,0],[2,5,0,0,9,0,0,0,7],[0,0,8,4,0,3,0,2,0],[8,0,0,3,0,0,0,0,0],[0,0,6,0,0,0,8,7,3],[7,0,1,6,0,0,0,0,0]]},{id:"c44",sudoku:[[0,0,3,8,0,0,0,0,4],[0,0,0,0,2,0,0,8,0],[8,0,0,0,0,9,2,0,0],[3,0,0,0,0,0,0,0,6],[0,0,2,0,8,0,4,1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,3,0,0,0,0,0],[1,3,0,2,0,0,0,4,9],[0,0,7,0,9,8,0,0,2]]}],d=document.querySelector(".form__code"),p="\u{1F3AF}\xBFEst\xE1s seguro que quieres comenzar ya?",g=`
    <p class='counter_container'><span class="counter"></span></p>
    <div class="app">
        <div class='wrapper'>
            <div class="container"></div>
        </div>
        <div class="numpad"></div>
    </div>
`;document.querySelector(".form").addEventListener("submit",c=>{c.preventDefault();const{value:t}=d,e=m.find(({id:s})=>s===t);if(e){if(!confirm(p))return;const s=new Date().toISOString(),i=Math.random().toString(36).substr(2,9),n=`C\xF3digo del juego: ${t} 

 Identificador: ${i} 

 ${s}`;document.body.innerHTML=g,new f({container:document.querySelector(".container"),numpad:document.querySelector(".numpad"),counter:document.querySelector(".counter"),size:1280,board:e.sudoku,win_msg:n})}else alert("C\xF3digo inv\xE1lido."),d.value=""});
