const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const arquivoReservas = path.join(__dirname, "reservas.json");

// Criar o arquivo se ainda não existir
if (!fs.existsSync(arquivoReservas)) {
    fs.writeFileSync(arquivoReservas, "[]");
}

// Buscar reservas
app.get("/api/reservas", (req, res) => {

    const reservas = JSON.parse(
        fs.readFileSync(arquivoReservas, "utf8")
    );

    res.json(reservas);
});

// Criar reserva
app.post("/api/reservas", (req, res) => {

    const reservas = JSON.parse(
        fs.readFileSync(arquivoReservas, "utf8")
    );

    const novaReserva = {
        id: Date.now(),
        nome: req.body.nome,
        laboratorio: req.body.laboratorio,
        data: req.body.data,
        horario: req.body.horario,
        finalidade: req.body.finalidade
    };

    // Verificar conflito
    const conflito = reservas.some(reserva =>
        reserva.laboratorio === novaReserva.laboratorio &&
        reserva.data === novaReserva.data &&
        reserva.horario === novaReserva.horario
    );

    if (conflito) {
        return res.status(409).json({
            erro: "Esse laboratório já está reservado nesse horário."
        });
    }

    reservas.push(novaReserva);

    fs.writeFileSync(
        arquivoReservas,
        JSON.stringify(reservas, null, 2)
    );

    res.status(201).json(novaReserva);
});

// Cancelar reserva
app.delete("/api/reservas/:id", (req, res) => {

    let reservas = JSON.parse(
        fs.readFileSync(arquivoReservas, "utf8")
    );

    reservas = reservas.filter(
        reserva => reserva.id !== Number(req.params.id)
    );

    fs.writeFileSync(
        arquivoReservas,
        JSON.stringify(reservas, null, 2)
    );

    res.json({ sucesso: true });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});