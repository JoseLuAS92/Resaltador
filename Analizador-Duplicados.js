(function(){

if(document.getElementById('analizadorRecurrencias')){
document.getElementById('analizadorRecurrencias').remove();
return;
}

const panel=document.createElement('div');

panel.id='analizadorRecurrencias';

panel.style=`
position:fixed;
top:50%;
left:50%;
transform:translate(-50%,-50%);
background:white;
z-index:99999999;
width:800px;
max-height:85vh;
overflow:auto;
padding:20px;
border-radius:10px;
box-shadow:0 0 20px rgba(0,0,0,.4);
font-family:Arial,sans-serif;
`;

panel.innerHTML=`
<h2>🔎 Casos Relacionados</h2>

<textarea
id="nuevoCasoTexto"
placeholder="Pegue aquí la nueva descripción..."
style="
width:100%;
height:200px;
border:1px solid #999;
padding:10px;
box-sizing:border-box;
resize:vertical;
background:white;
color:black;
">
</textarea>

<br><br>

<button id="btnAnalizar"
style="
padding:10px 20px;
background:#198754;
color:white;
border:none;
border-radius:5px;
cursor:pointer;
">
Analizar
</button>

<button id="btnCerrar"
style="
padding:10px 20px;
margin-left:10px;
">
Cerrar
</button>

<hr>

<div id="resultadoRecurrencias"></div>
`;

document.body.appendChild(panel);

document.getElementById('btnCerrar').onclick=function(){
panel.remove();
};

document.getElementById('btnAnalizar').onclick=function(){

const nuevo=
document.getElementById('nuevoCasoTexto').value;

const historicos=
[...document.querySelectorAll('div[style*="max-height: 150px"]')]
.map(x=>x.innerText);

function limpiar(texto){

const stopwords = [

"usuario",
"activa",
"activo",
"segun",
"adres",
"entidad",
"afectado",
"peticionario",
"solicita",
"requiere",
"contributivo",
"subsidiado",
"caso",
"para",
"porque",
"desde",
"entre",
"sobre",
"respecto",
"ante",
"dicha",
"dicho",
"esta",
"este",
"tiene",
"tener",
"lleva",
"llevo",
"mes",
"dias"

];

return texto
.toLowerCase()
.normalize('NFD')
.replace(/[\u0300-\u036f]/g,'')
.replace(/[^\w\s]/g,' ')
.split(/\s+/)
.filter(x=>x.length>3)
.filter(x=>!stopwords.includes(x));

}

function similitud(a,b){

a=a.toLowerCase();
b=b.toLowerCase();

let score=0;

if(a.includes("prestador") && b.includes("prestador"))
score+=30;

if(a.includes("suramericana") && b.includes("suramericana"))
score+=20;

if(
(a.includes("migraña") || a.includes("migrana")) &&
(b.includes("migraña") || b.includes("migrana"))
)
score+=30;

if(a.includes("neurolog") && b.includes("neurolog"))
score+=20;

return score;

}

let resultados=historicos.map(h=>{

const rad=(h.match(/RAD\d+/)||['Sin RAD'])[0];

const etiqueta =
(h.match(/#([A-Z]+)/)||['','Sin Tipo'])[1];

return{
rad,
etiqueta,
texto:h,
score:similitud(nuevo,h)
};

});

resultados.sort((a,b)=>b.score-a.score);

document.getElementById('resultadoRecurrencias').innerHTML=
resultados
.slice(0,5)
.map(r=>`
<div style="
margin-bottom:15px;
padding:10px;
border:1px solid #ddd;
border-radius:8px;
">

<b>Radicado:</b> ${r.rad}<br>
<b>Tipo:</b> ${r.etiqueta}<br>
<b>Coincidencia:</b> ${r.score}%<br><br>

${r.texto.substring(0,250)}

</div>
`)
.join('');

};

})();
