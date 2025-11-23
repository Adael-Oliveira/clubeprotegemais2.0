// index.js (Lê dados dinamicamente da tabela 'parceiros' do Supabase)

import supabase from './supabase.js';

let partnersData = []; 
let currentFilter = 'Todos';

// ------------------------------------
// --- FUNÇÃO DE BUSCA NO SUPABASE ---
// ------------------------------------
const fetchPartners = async () => {
    // Busca todos os parceiros onde a coluna 'aprovado' é TRUE
    const { data, error } = await supabase
        .from('parceiros') 
        .select('*')
        .eq('aprovado', true); 

    if (error) {
        console.error('Erro ao buscar parceiros:', error);
        return [];
    }

    // Mapeia os nomes das colunas do Supabase (snake_case) para o formato que seu código JS espera (camelCase/português)
    partnersData = data.map(p => ({
        id: p.id,
        name: p.nome,
        segment: p.segmento,
        description: p.descricao,
        discount: p.desconto,
        logo: p.logo,
        banner: p.banner,
        phone: p.telefone,
        address: p.endereco,
        city: p.cidade,
        mapEmbedUrl: p.mapembedurl, // Corrigido para minúsculo/o nome que funcionou no SQL
        featured: p.destaque,
        instagram: p.instagram
    }));
    
    return partnersData;
};


// ------------------------------------
// --- FUNÇÕES DE RENDERIZAÇÃO E FILTRO (MANTIDAS) ---
// ------------------------------------

// [Atenção]: As funções renderCarousel, renderCards, renderFilters e filterAndRender
// Devem ser colocadas aqui, inalteradas, para que o código funcione.
// Elas agora usarão a variável global 'partnersData' preenchida pelo fetchPartners.


// Exemplo (adapte conforme seu código original):
function renderCarousel() {
    // Lógica que usa partnersData para preencher o carrossel (filtrando por featured: true)
}

function renderCards(data) {
    // Lógica que cria os cards HTML no grid principal
}

function renderFilters() {
    // Lógica que extrai segmentos únicos de partnersData e cria os botões de filtro
}

function filterAndRender() {
    const filteredData = (currentFilter === 'Todos') 
        ? partnersData 
        : partnersData.filter(p => p.segment === currentFilter);
        
    renderCards(filteredData);
}

// [FIM das Funções de Renderização]

// ------------------------------------
// --- INICIALIZAÇÃO E EVENTOS ---
// ------------------------------------

// Adiciona listener aos botões de filtro após serem renderizados
document.getElementById('filters-container')?.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        currentFilter = event.target.dataset.filter || 'Todos';
        filterAndRender();
        // Lógica para destacar o botão ativo
    }
});

async function initializeApp() {
    await fetchPartners(); 
    renderCarousel();
    renderFilters();
    filterAndRender();
    
    // Verifica se o usuário está logado (para redirecionar o Consultor se necessário)
    // Se o consultor.js estiver fazendo isso, pode remover.
    const { data: { user } } = await supabase.auth.getUser();
    if (user && window.location.pathname.includes('index.html')) {
        // window.location.href = 'consultor.html';
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
