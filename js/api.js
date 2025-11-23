const SPREADSHEET_ID = '1lN0C99B04RzDmhNIprHMGLk64IQRS76uw8gwaSVdqtk'; 
const API_KEY = 'AIzaSyDCw73o0pdFmqjlUGMq8y6wMaktG0Cavs8'; 

window.gapiInitialized = false;


window.gapiLoaded = function() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    });
    gapiInitialized = true;
    console.log('Google API Client inicializado com Chave Pública.');
    
    
  } catch (err) {
    console.error("Erro na inicialização da GAPI. Verifique a API Key e as restrições.", err);
    document.getElementById('lista-comunicados').innerHTML = '<div class="loading-message"><p>Erro crítico ao conectar aos dados. Tente mais tarde.</p></div>';
  }
}

async function fetchDataAndRender() {
    if (!gapiInitialized) {
        console.warn("GAPI não inicializada. Tentando novamente.");
        return;
    }
    
    fetchComunicados(); 
    fetchCalendario(); 
}


async function fetchComunicados() {
    const range = 'Comunicados!A2:E';
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range, 
        });
        const comunicados = response.result.values;
        if (comunicados && comunicados.length > 0) {
            console.log('Comunicados encontrados:', comunicados.length);
            renderComunicados(comunicados);
        } else {
            document.getElementById('lista-comunicados').innerHTML = '<div class="loading-message"><p>Nenhum comunicado ativo encontrado.</p></div>';
        }
    } catch (err) {
        console.error("Erro ao buscar comunicados: " + err.message);
        document.getElementById('lista-comunicados').innerHTML = `<div class="loading-message"><p>Erro (403/404) ao carregar dados. Verifique o compartilhamento da planilha. (${err.message})</p></div>`;
    }
}

async function fetchCalendario() {
    const range = 'Calendario!A2:F';
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range, 
        });
        const eventos = response.result.values;
        if (eventos && eventos.length > 0) {
            console.log('Eventos do Calendário encontrados:', eventos.length);
            renderCalendario(eventos);
        } else {
            document.getElementById('tabela-calendario').innerHTML = '<div class="loading-message"><p>Nenhum evento no calendário encontrado.</p></div>';
        }
    } catch (err) {
        console.error("Erro ao buscar calendário: " + err.message);
        document.getElementById('tabela-calendario').innerHTML = `<div class="loading-message"><p>Erro (403/404) ao carregar o calendário. Verifique o compartilhamento da planilha. (${err.message})</p></div>`;
    }
}