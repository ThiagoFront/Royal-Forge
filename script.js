
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

if (personagem && imagemHeroi && imagemComum) {

    personagem.addEventListener("pointermove", (evento) => {
        if (!mousePreciso.matches) return;

        // Localiza a área do Cavaleiro Herói
        const area = imagemHeroi.getBoundingClientRect();

        // Compensa a escala e o deslocamento da imagem
        const escalaX = area.width / imagemHeroi.offsetWidth;
        const escalaY = area.height / imagemHeroi.offsetHeight;

        const x = (evento.clientX - area.left) / escalaX;
        const y = (evento.clientY - area.top) / escalaY;

        // Posiciona o pincel nas duas imagens
        imagemHeroi.style.setProperty("--mouse-x", `${x}px`);
        imagemHeroi.style.setProperty("--mouse-y", `${y}px`);

        // Converte a posição para a área do Cavaleiro comum
        const areaComum = imagemComum.getBoundingClientRect();
        const escalaComumX = areaComum.width / imagemComum.offsetWidth;
        const escalaComumY = areaComum.height / imagemComum.offsetHeight;

        const xComum = (evento.clientX - areaComum.left) / escalaComumX;
        const yComum = (evento.clientY - areaComum.top) / escalaComumY;

        imagemComum.style.setProperty("--mouse-x", `${xComum}px`);
        imagemComum.style.setProperty("--mouse-y", `${yComum}px`);

        personagem.classList.add("mostrar-heroi");
    });

    const mostrarComum = () => {
        personagem.classList.remove("mostrar-heroi");
    };

    personagem.addEventListener("pointerleave", mostrarComum);
    window.addEventListener("blur", mostrarComum);
}
