const fetch = require("node-fetch");

function keepAlive() {
    setInterval(() => {
        fetch("https://stickeando-backend.onrender.com")
            .then(() => console.log("Ping enviado para evitar hibernación"))
            .catch(err => console.error("Error en el ping:", err));
    }, 5 * 60 * 1000); // Cada 5 minutos
}

module.exports = keepAlive;
