document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calculator-form");
    const resultadoDiv = document.getElementById("resultado");

    const valoresPermitidos = {
        ancho_rueda: [105, 115, 125, 135, 145, 155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315, 325, 335, 345, 355, 365, 375, 385, 395, 405],
        perfil_rueda: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
        tamano_llanta: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const anchoActual = parseFloat(document.getElementById("ancho-actual").value);
        const perfilActual = parseFloat(document.getElementById("perfil-actual").value);
        const tamanoLlantaActual = parseFloat(document.getElementById("tamano-llanta-actual").value);

        const anchoNuevo = parseFloat(document.getElementById("ancho-nuevo").value);
        const perfilNuevo = parseFloat(document.getElementById("perfil-nuevo").value);
        const tamanoLlantaNuevo = parseFloat(document.getElementById("tamano-llanta-nuevo").value);

        if (!isValidValue(anchoActual, perfilActual, tamanoLlantaActual) ||
            !isValidValue(anchoNuevo, perfilNuevo, tamanoLlantaNuevo)) {
            resultadoDiv.innerHTML = "<p>Por favor, ingresa valores válidos.</p>";
            return;
        }

        const diametroTotalActual = anchoActual * perfilActual / 100 * 2 + tamanoLlantaActual * 25.4;
        const diametroTotalNuevo = anchoNuevo * perfilNuevo / 100 * 2 + tamanoLlantaNuevo * 25.4;

        const llantaActualEnMilimetros = tamanoLlantaActual * 25.4;
        const llantaNuevaEnMilimetros = tamanoLlantaNuevo * 25.4;

        const perfilActualEnMilimetros = (perfilActual * anchoActual) / 100;
        const perfilNuevoEnMilimetros = (perfilNuevo * anchoNuevo) / 100;

        const circunferenciaActual = diametroTotalActual * Math.PI;
        const circunferenciaNueva = diametroTotalNuevo * Math.PI;

        const revolucionesEnUnKilometroActual = 1000 / (circunferenciaActual / 1000);
        const revolucionesEnUnKilometroNueva = 1000 / (circunferenciaNueva / 1000);

        const diferenciaDeDiametroTotal = diametroTotalNuevo - diametroTotalActual;

        resultadoDiv.innerHTML = `
        <div class="canvas-container">
            <div class="canvas-item">
                <canvas id="canvas-actual"></canvas>
                <p>Diametro llanta: ${llantaActualEnMilimetros.toFixed(2)} mm.</p>
                <p>Altura perfil: ${perfilActualEnMilimetros.toFixed(2)} mm.</p>
                <p>Diametro total: ${diametroTotalActual.toFixed(2)} mm. (100%)</p>
                <p>Distancia/revolución: ${(circunferenciaActual / 1000).toFixed(2)} m.</p>
                <p>Revoluciones/km: ${revolucionesEnUnKilometroActual.toFixed(2)} rev</p>
            </div>
            <div class="canvas-item">
                <canvas id="canvas-nuevo"></canvas>
                <p>Diametro llanta: ${llantaNuevaEnMilimetros.toFixed(2)} mm.</p>
                <p>Altura perfil: ${perfilNuevoEnMilimetros.toFixed(2)} mm.</p>
                <p>Diametro total: ${diametroTotalNuevo.toFixed(2)} mm. (%)</p>
                <p>Distancia/revolución: ${(circunferenciaNueva / 1000).toFixed(2)} m.</p>
                <p>Revoluciones/km: ${revolucionesEnUnKilometroNueva.toFixed(2)} rev</p>
            </div>
        </div>
            <div class="paragraph-container">
            <p>La diferencia de diametro entre ambas ruedas es de ${Math.abs(diferenciaDeDiametroTotal.toFixed(2))} milimetros. (${Math.abs(100 - ((100 + (diametroTotalNuevo - diametroTotalActual) / diametroTotalActual * 100))).toFixed(2)}%) </p>
            </div>
        `;

        // Dibujar las ruedas a un tercio del tamaño
        drawWheel("canvas-actual", anchoActual, perfilActual, tamanoLlantaActual, 0.33);
        drawWheel("canvas-nuevo", anchoNuevo, perfilNuevo, tamanoLlantaNuevo, 0.33);
    });

    function isValidValue(ancho, perfil, tamanoLlanta) {
        return valoresPermitidos.ancho_rueda.includes(ancho) &&
            valoresPermitidos.perfil_rueda.includes(perfil) &&
            valoresPermitidos.tamano_llanta.includes(tamanoLlanta);
    }

    function drawWheel(canvasId, ancho, perfil, diametro, scale) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext("2d");

        var _diametro = diametro * 25.4;
        var _perfil = ancho * perfil / 100;
        var diametro_neumatico = _diametro + _perfil * 2;

        var scaledDiametro = diametro_neumatico * scale;

        canvas.width = scaledDiametro;
        canvas.height = scaledDiametro;

        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = scaledDiametro / 2;

        const neumaticoColor = "#000"; // Cambiar a negro

        // Dibujar el neumático
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.fillStyle = neumaticoColor;
        context.fill();
        context.closePath();

        // Agregar una imagen dentro del neumático
        const image = new Image();
        image.src = "../sources/llanta.png";
        image.onload = function () {
            const imageRadius = radius * 0.8; // Ajusta el tamaño de la imagen dentro del neumático
            context.drawImage(image, centerX - imageRadius, centerY - imageRadius, imageRadius * 2, imageRadius * 2);
        };
    }

});