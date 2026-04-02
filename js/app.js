// js/app.js
async function upload() {
    const fileInput = document.getElementById("fileInput");
    const presetSelect = document.getElementById("preset");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {
        alert("Selecciona un archivo");
        return;
    }

    const file = fileInput.files[0];
    const preset = presetSelect.value;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("preset", preset);

    status.innerText = "Procesando... ⏳";

    try {
        const response = await fetch("https://audio-cleaner-backend.onrender.com/clean-audio/", 
        { method: "POST", 
        body: formData });

        if (!response.ok) {
            throw new Error("Error en el servidor");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "cleaned.mp3";
        a.click();
        window.URL.revokeObjectURL(url);
        status.innerText = "✅ Audio listo!";
    } catch (error) {
        status.innerText = "❌ Error procesando audio";
    }
}