const formulario = document.getElementById("formReserva");
const listaReservas = document.getElementById("listaReservas");
const mensagem = document.getElementById("mensagem");

const API = "http://localhost:3000/api/reservas";

let reservas = [];


// ===============================
// CARREGAR RESERVAS DO SERVIDOR
// ===============================

async function carregarReservas() {

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar reservas");
        }

        reservas = await resposta.json();

        mostrarReservas();

    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "❌ Não foi possível carregar as reservas.";

        mensagem.style.color = "red";
    }
}


// ===============================
// FAZER NOVA RESERVA
// ===============================

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const laboratorio = document.getElementById("laboratorio").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const finalidade = document.getElementById("finalidade").value;


    const novaReserva = {

        nome: nome,
        laboratorio: laboratorio,
        data: data,
        horario: horario,
        finalidade: finalidade

    };


    try {

        const resposta = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(novaReserva)

        });


        const resultado = await resposta.json();


        // Se houver conflito de horário
        if (!resposta.ok) {

            mensagem.textContent =
                "❌ " + resultado.erro;

            mensagem.style.color = "red";

            return;
        }


        // Adiciona a reserva recebida do servidor
        reservas.push(resultado);


        mensagem.textContent =
            "✅ Reserva realizada com sucesso!";

        mensagem.style.color = "green";


        formulario.reset();

        mostrarReservas();


    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "❌ Não foi possível realizar a reserva.";

        mensagem.style.color = "red";
    }

});


// ===============================
// MOSTRAR RESERVAS
// ===============================

function mostrarReservas() {

    listaReservas.innerHTML = "";


    if (reservas.length === 0) {

        listaReservas.innerHTML = `
            <p class="sem-reservas">
                Você ainda não possui reservas.
            </p>
        `;

        return;
    }


    reservas.forEach(function(reserva) {

        const div = document.createElement("div");

        div.className = "reserva-card";


        div.innerHTML = `

            <h3>${reserva.laboratorio}</h3>

            <p>
                👤 <strong>Usuário:</strong>
                ${reserva.nome}
            </p>

            <p>
                📅 <strong>Data:</strong>
                ${reserva.data}
            </p>

            <p>
                ⏰ <strong>Horário:</strong>
                ${reserva.horario}
            </p>

            <p>
                📝 <strong>Finalidade:</strong>
                ${reserva.finalidade}
            </p>

            <button
                class="cancelar"
                onclick="cancelarReserva(${reserva.id})">
                Cancelar Reserva
            </button>

        `;


        listaReservas.appendChild(div);

    });

}


// ===============================
// CANCELAR RESERVA
// ===============================

async function cancelarReserva(id) {

    try {

        const resposta = await fetch(`${API}/${id}`, {

            method: "DELETE"

        });


        if (!resposta.ok) {

            throw new Error("Erro ao cancelar reserva");

        }


        // Atualiza a lista buscando novamente no servidor
        await carregarReservas();


    } catch (erro) {

        console.error(erro);

        mensagem.textContent =
            "❌ Não foi possível cancelar a reserva.";

        mensagem.style.color = "red";
    }

}


// ===============================
// INICIAR SISTEMA
// ===============================

carregarReservas();