const formulario = document.getElementById("formReserva");
const listaReservas = document.getElementById("listaReservas");
const mensagem = document.getElementById("mensagem");

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const laboratorio = document.getElementById("laboratorio").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const finalidade = document.getElementById("finalidade").value;

    const existe = reservas.some(function(reserva) {

        return reserva.laboratorio === laboratorio &&
               reserva.data === data &&
               reserva.horario === horario;

    });

    if (existe) {

        mensagem.textContent =
            "❌ Esse laboratório já está reservado nesse horário.";

        mensagem.style.color = "red";

        return;
    }

    const novaReserva = {

        id: Date.now(),

        nome: nome,

        laboratorio: laboratorio,

        data: data,

        horario: horario,

        finalidade: finalidade

    };

    reservas.push(novaReserva);

    localStorage.setItem(
        "reservas",
        JSON.stringify(reservas)
    );

    mensagem.textContent =
        "✅ Reserva realizada com sucesso!";

    mensagem.style.color = "green";

    formulario.reset();

    mostrarReservas();

});


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


function cancelarReserva(id) {

    reservas = reservas.filter(function(reserva) {

        return reserva.id !== id;

    });

    localStorage.setItem(
        "reservas",
        JSON.stringify(reservas)
    );

    mostrarReservas();

}


mostrarReservas();