const translations = {
    es: {
        title: "🎧 Audio Cleaner",
        subtitle: "Mejora automáticamente la calidad de tus audios",
        button: "Limpiar audio",
        processing: "⏳ Procesando...",
        done: "✅ Audio listo!",
        error: "❌ Error procesando audio"
    },
    en: {
        title: "🎧 Audio Cleaner",
        subtitle: "Automatically improve your audio quality",
        button: "Clean audio",
        processing: "⏳ Processing...",
        done: "✅ Audio ready!",
        error: "❌ Error processing audio"
    }
};

let currentLang = "es";

function changeLang() {
    currentLang = document.getElementById("lang").value;
    const t = translations[currentLang];

    document.getElementById("title").innerText = t.title;
    document.getElementById("subtitle").innerText = t.subtitle;
    document.getElementById("btn").innerText = t.button;
}

async function upload() {
    const fileInput = document.getElementById("fileInput");
    const preset = document.getElementById("preset").value;
    const status = document.getElementById("status");
    const progressBar = document.getElementById("progress-bar");
    const result = document.getElementById("result");
    const audioPlayer = document.getElementById("audioPlayer");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!fileInput.files.length) {
        alert("Selecciona un archivo");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("preset", preset);

    status.innerText = translations[currentLang].processing;
    result.style.display = "none";
    progressBar.style.width = "0%";

    const xhr = new XMLHttpRequest();

    // 📊 Progreso real de subida
    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 50;
            progressBar.style.width = percent + "%";
        }
    };

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Simular procesamiento restante
                let progress = 50;
                const interval = setInterval(() => {
                    progress += 10;
                    progressBar.style.width = progress + "%";
                    if (progress >= 100) {
                        clearInterval(interval);

                        const blob = xhr.response;
                        const url = URL.createObjectURL(blob);

                        audioPlayer.src = url;
                        downloadBtn.href = url;
                        result.style.display = "block";

                        status.innerText = translations[currentLang].done;
                    }
                }, 200);
            } else {
                status.innerText = translations[currentLang].error;
            }
        }
    };

    xhr.open("POST", "https://audio-cleaner-backend.onrender.com/clean-audio/");
    xhr.responseType = "blob";
    xhr.send(formData);
}