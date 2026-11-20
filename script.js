
const mensagens = document.querySelectorAll(".hero-messages p");

   mensagens.forEach((mensagem, indiceMensagem) => {
    const texto = mensagem.textContent.trim();

    mensagem.textContent = "";

    const palavras = texto.split(" ");

    let indiceLetra = 0;
    palavras.forEach((palavra, indicePalavra) => {
        const grupo = document.createElement("span");
        grupo.classList.add("palavra");

        [...palavra].forEach((letra) => {
            const span = document.createElement("span");
            span.classList.add("letra");
            span.textContent = letra;


           span.style.animationDelay = 
           `${indiceLetra * 0.08}s`;
            indiceLetra++;

            grupo.appendChild(span);
        });

        mensagem.appendChild(grupo);

        if (indicePalavra < palavras.length - 1) {
            mensagem.appendChild(document.createTextNode(" "));
        }
    });
});


let mensagemAtual = 0;

function mostrarMensagem() {
    mensagens.forEach((mensagem) => {
        mensagem.classList.remove("ativa");
    });

    mensagens[mensagemAtual].classList.add("ativa");

    mensagemAtual = (mensagemAtual + 1) % mensagens.length;
}

mostrarMensagem();

setInterval(mostrarMensagem, 5000);

const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector("#menu-principal");

function fecharMenu() {
    botaoMenu.classList.remove("aberto");
    menuPrincipal.classList.remove("aberta");
    botaoMenu.setAttribute("aria-expanded", "false");
}

fecharMenu();

botaoMenu.addEventListener("click", () => {
    const abrir = !botaoMenu.classList.contains("aberto");

    botaoMenu.classList.toggle("aberto", abrir);
    menuPrincipal.classList.toggle("aberta", abrir);

    botaoMenu.setAttribute("aria-expanded", String(abrir));
});

window.addEventListener("resize", fecharMenu);

menuPrincipal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
});


// Transição simples: Cavaleiro Comum ↔ Cavaleiro Herói.
// A mesma área e o mesmo tamanho CSS são usados para ambas as imagens.

// Pincel de revelação: Cavaleiro Comum e Cavaleiro Herói
const personagem = document.querySelector(".hero-character");
const imagemHeroi = personagem?.querySelector(".cavaleiro-heroi");
const imagemComum = personagem?.querySelector(".cavaleiro-base");
const mousePreciso = window.matchMedia("(hover: hover) and (pointer: fine)");


const canvasPincel = document.querySelector(".pincel-canvas");
const contextoPincel = canvasPincel.getContext("2d");
const areaPersonagem = document.querySelector(".hero-character");


function ajustarCanvas() {
    canvasPincel.width = areaPersonagem.clientWidth;
    canvasPincel.height = areaPersonagem.clientHeight;
}

ajustarCanvas();
let ultimoX = null;
let ultimoY = null;


function desenharPincel(evento) {
    const area = areaPersonagem.getBoundingClientRect();
    

    const x = evento.clientX - area.left;
    const y = evento.clientY - area.top;

    

    pinceladas.push({
    x1: ultimoX ?? x,
    y1: ultimoY ?? y,
    x2: x,
    y2: y,
    tempo: performance.now()

});

    ultimoX = x;
    ultimoY = y;
}


const duracaoRastro = 1000;
const tempoDesaparecimento = 500;
const pinceladas = [];

function animarRastro(agora) {
    contextoPincel.clearRect(
        0, 0,
        canvasPincel.width,
        canvasPincel.height
    );

    for (let i = pinceladas.length - 1; i >= 0; i--) {
        const pincelada = pinceladas[i];
        const idade = agora - pincelada.tempo;

        if (idade > duracaoRastro + tempoDesaparecimento) {
            pinceladas.splice(i, 1);
            continue;
        }

        const opacidade = idade < duracaoRastro
            ? 1
            : 1 - (idade - duracaoRastro) / tempoDesaparecimento;

        
contextoPincel.globalAlpha = Math.max(0, opacidade);
contextoPincel.beginPath();

const variacao = Math.sin(
    pincelada.x1 * 0.12 + pincelada.y1 * 0.08
) * 14;

contextoPincel.lineWidth = 70 + variacao;
contextoPincel.lineCap = "round";
contextoPincel.lineJoin = "round";
contextoPincel.strokeStyle = "white";

contextoPincel.moveTo(pincelada.x1, pincelada.y1);
contextoPincel.lineTo(pincelada.x2, pincelada.y2);
contextoPincel.stroke();


        // Cria bordas orgânicas conectadas ao pincel
        const dx = pincelada.x2 - pincelada.x1;
        const dy = pincelada.y2 - pincelada.y1;
        const comprimento = Math.hypot(dx, dy);

        const direcaoX = comprimento > 0 ? -dy / comprimento : 0;
        const direcaoY = comprimento > 0 ? dx / comprimento : 1;

        const quantidade = Math.max(
            1,
            Math.ceil(comprimento / 8)
        );

        for (let j = 0; j <= quantidade; j++) {
            const progresso = j / quantidade;

            const x = pincelada.x1 + dx * progresso;
            const y = pincelada.y1 + dy * progresso;

            const onda = Math.sin(x * 0.09 + y * 0.07) * 8;
            const detalhe = Math.sin(x * 0.23 - y * 0.17) * 4;

            const raio = contextoPincel.lineWidth / 2
                + onda + detalhe;

            contextoPincel.beginPath();
            contextoPincel.arc(
                x + direcaoX * detalhe,
                y + direcaoY * detalhe,
                Math.max(12, raio),
                0,
                Math.PI * 2
            );

          
            contextoPincel.fillStyle = "white";
            contextoPincel.fill();
            
        } // Fecha o for interno das bordas orgânicas

    } // Fecha o for principal das pinceladas

    contextoPincel.globalAlpha = 1;

    const mascara = canvasPincel.toDataURL("image/png");


    // Revela o Cavaleiro Herói
    imagemHeroi.style.webkitMaskImage = `url("${mascara}")`;
    imagemHeroi.style.maskImage = `url("${mascara}")`;
    imagemHeroi.style.opacity = "1";


    // Cria uma máscara inversa para o Cavaleiro comum
    const canvasInverso = document.createElement("canvas");
    canvasInverso.width = canvasPincel.width;
    canvasInverso.height = canvasPincel.height;

    const contextoInverso = canvasInverso.getContext("2d");

    // Começa com a máscara totalmente visível
    contextoInverso.fillStyle = "white";
    contextoInverso.fillRect(
        0,0,
        canvasInverso.width,
        canvasInverso.height
    );

    // Apaga da máscara as regiões pintadas
    contextoInverso.globalCompositeOperation = "destination-out";
    contextoInverso.drawImage(canvasPincel, 0, 0);

    const mascaraInversa = canvasInverso.toDataURL("image/png");

    // Esconde o Cavaleiro comum nas regiões reveladas
    imagemComum.style.webkitMaskImage = `url("${mascaraInversa}")`;
    imagemComum.style.maskImage = `url("${mascaraInversa}")`;

    requestAnimationFrame(animarRastro);
}

requestAnimationFrame(animarRastro);


areaPersonagem.addEventListener("pointermove", desenharPincel);
areaPersonagem.addEventListener("pointerout", () => {
    ultimoX = null;
    ultimoY = null;

    contextoPincel.clearRect(
        0,
        0,
        canvasPincel.width,
        canvasPincel.height
    );
});


/* ==========================================
   ROYAL FORGE — EMOTE ANIMADO DO BOTÃO
========================================== */

const botaoDeck = document.querySelector(".botao-deck");
const emoteRepouso = document.querySelector(".emote-repouso");
const emoteAnimado = document.querySelector(".emote-animado");

if (botaoDeck && emoteRepouso && emoteAnimado) {

    function iniciarEmote() {
        emoteAnimado.currentTime = 0;

        const reproducao = emoteAnimado.play();

        if (reproducao) {
            reproducao.then(() => {
                emoteRepouso.style.opacity = "0";
                emoteAnimado.style.opacity = "1";
            }).catch(() => {
                emoteRepouso.style.opacity = "1";
                emoteAnimado.style.opacity = "0";
            });
        }
    }

    function pararEmote() {
        emoteAnimado.pause();
        emoteAnimado.currentTime = 0;

        emoteAnimado.style.opacity = "0";
        emoteRepouso.style.opacity = "1";
    }

    botaoDeck.addEventListener("pointerenter", iniciarEmote);
    botaoDeck.addEventListener("pointerleave", pararEmote);
}


/* ==========================================
   ROYAL FORGE — ONDULAÇÕES DE ÁGUA
========================================== */

const canvasAgua = document.querySelector(".agua-deck");
const esferaAgua = document.querySelector(".esfera-deck");

if (canvasAgua && esferaAgua) {
    const ctxAgua = canvasAgua.getContext("2d");
    const ondas = [];

    let animacaoAgua = null;
    let ultimoMovimento = 0;

    function ajustarAgua() {
        const tamanho = esferaAgua.clientWidth;

        canvasAgua.width = tamanho;
        canvasAgua.height = tamanho;
    }

    ajustarAgua();

    function criarOnda(evento) {
        const agora = performance.now();

        // Evita criar ondas em excesso
        if (agora - ultimoMovimento < 65) return;
        ultimoMovimento = agora;

        const area = canvasAgua.getBoundingClientRect();

        ondas.push({
            x: evento.clientX - area.left,
            y: evento.clientY - area.top,
            raio: 2,
            opacidade: 0.55
        });

        if (!animacaoAgua) {
            animacaoAgua = requestAnimationFrame(animarAgua);
        }
    }

    function animarAgua() {
        ctxAgua.clearRect(
            0, 0,
            canvasAgua.width,
            canvasAgua.height
        );

        for (let i = ondas.length - 1; i >= 0; i--) {
            const onda = ondas[i];

            onda.raio += 0.35;
            onda.opacidade -= 0.006;

            if (onda.opacidade <= 0) {
                ondas.splice(i, 1);
                continue;
            }

            ctxAgua.beginPath();
            ctxAgua.arc(
                onda.x,
                onda.y,
                onda.raio,
                0,
                Math.PI * 2
            );

            ctxAgua.strokeStyle =
                `rgba(190, 250, 255, ${onda.opacidade})`;

            ctxAgua.lineWidth = 1.5;
            ctxAgua.stroke();
        }

        if (ondas.length > 0) {
            animacaoAgua = requestAnimationFrame(animarAgua);
        } else {
            animacaoAgua = null;
        }
    }

    esferaAgua.addEventListener("pointermove", criarOnda);

    esferaAgua.addEventListener("pointerleave", () => {
        ondas.length = 0;
        ctxAgua.clearRect(
            0, 0,
            canvasAgua.width,
            canvasAgua.height
        );
    });

    window.addEventListener("resize", ajustarAgua);
}
