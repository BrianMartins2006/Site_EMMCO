// Arquivo: js/script.js

// Variáveis para elementos do DOM
const menuPrincipal = document.getElementById('menu-principal');
const menuBtn = document.querySelector('.menu-mobile-btn');
const navLinks = document.querySelectorAll('#menu-principal a');

// ===============================================
// 1. FUNCIONALIDADE DO MENU MOBILE
// (Lógica local do site)
// ===============================================

function toggleMenu() {
    menuPrincipal.classList.toggle('active');
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
}

// Fecha o menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuPrincipal.classList.contains('active')) {
            menuPrincipal.classList.remove('active');
        }
    });
});


// ===============================================
// 2. FUNÇÕES DE RENDERIZAÇÃO
// (Chamadas pelo js/api.js após a busca)
// ===============================================

// Função para renderizar os comunicados na tela
function renderComunicados(data) {
    const container = document.getElementById('lista-comunicados');
    let htmlContent = '';
    container.innerHTML = '';
    
    if (data && data.length > 0) {
        data.forEach(row => {
            // Desestruturação: DATA, TÍTULO, RESUMO, LINK_PDF, STATUS
            const [dataCom, titulo, resumo, linkPdf, status] = row;
            
            if (status && status.toUpperCase() === 'ATIVO') {
                
                // Conversão de data PT-BR (dd/mm/aaaa) para objeto Date
                const parts = dataCom.split('/');
                const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
                const formattedDate = dateObj.toLocaleDateString('pt-BR');
                
                const linkHtml = linkPdf ? 
                    `<a href="${linkPdf}" target="_blank" class="btn-detalhes">Acessar Documento</a>` :
                    '';

                htmlContent += `
                    <div class="card-comunicado">
                        <span class="data">${formattedDate}</span>
                        <h3>${titulo}</h3>
                        <p>${resumo}</p>
                        ${linkHtml}
                    </div>
                `;
            }
        });
        
        container.innerHTML = htmlContent || '<div class="loading-message"><p>No momento, não há comunicados ativos.</p></div>';

    } else {
        container.innerHTML = '<div class="loading-message"><p>Não foi possível carregar os dados de comunicados.</p></div>';
    }
}

// Função para renderizar os eventos do calendário na tela
function renderCalendario(data) {
    const container = document.getElementById('tabela-calendario');
    
    container.innerHTML = ''; 

    if (data && data.length > 0) {
        
        let tableHtml = `
            <table class="tabela-calendario">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Evento</th>
                        <th>Horário</th>
                        <th>Público Alvo</th>
                        <th>Local</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(row => {
            // Desestruturação: DATA, DIA_SEMANA, EVENTO, HORÁRIO, PÚBLICO_ALVO, LOCAL
            const [dataEvento, diaSemana, evento, horario, publicoAlvo, local] = row;
            
            if (evento && dataEvento) {
                // Conversão de data PT-BR (dd/mm/aaaa)
                const parts = dataEvento.split('/');
                const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
                const formattedDate = `${diaSemana}, ${dateObj.toLocaleDateString('pt-BR')}`;

                tableHtml += `
                    <tr>
                        <td data-label="Data">${formattedDate}</td>
                        <td data-label="Evento"><strong>${evento}</strong></td>
                        <td data-label="Horário">${horario}</td>
                        <td data-label="Público">${publicoAlvo}</td>
                        <td data-label="Local">${local}</td>
                    </tr>
                `;
            }
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;

    } else {
        container.innerHTML = '<div class="loading-message"><p>Não há eventos no calendário programados no momento.</p></div>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('Site EMMCO carregado!');
    // A chamada fetchDataAndRender é feita pelo api.js após a autenticação
});