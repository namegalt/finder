import Electrobun, { Electroview } from "electrobun/view";

const rpc = Electroview.defineRPC({
    handlers: { requests: {}, messages: {} }
});
const electrobun = new Electrobun.Electroview({ rpc });

const input = document.getElementById('freq-input') as HTMLInputElement;
const btn = document.getElementById('find-btn') as HTMLButtonElement;
const resultsDiv = document.getElementById('results') as HTMLDivElement;

btn.addEventListener('click', async () => {
    const freq = parseFloat(input.value);
    if (isNaN(freq)) return;

    const matches = await electrobun.rpc!.request.identify({ freq });
    
    if (matches.length === 0) {
        resultsDiv.innerHTML = "<p>Дронів не знайдено для цієї частоти.</p>";
        return;
    }

    resultsDiv.innerHTML = matches.map(drone => `
        <div class="drone-card">
            <h3>${drone.name}</h3>
            <p><strong>Тип сигналу:</strong> ${drone.modem_type}</p>
            <div class="img-placeholder">Фото: ${drone.name}</div>
        </div>
    `).join('');
});