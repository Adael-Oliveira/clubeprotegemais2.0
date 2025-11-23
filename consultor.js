// consultor.js

import supabase from './supabase.js';

// Elementos da interface
const authSection = document.getElementById('auth-section');
const crudSection = document.getElementById('crud-section');
const authActionBtn = document.getElementById('auth-action-btn');
const loginForm = document.getElementById('login-form');
const partnerForm = document.getElementById('partner-form');
const partnersList = document.getElementById('partners-list');
const authMessage = document.getElementById('auth-message');

// --- Lógica de AUTENTICAÇÃO ---

const displaySections = (session) => {
    if (session) {
        authSection.style.display = 'none';
        crudSection.style.display = 'block';
        authActionBtn.textContent = 'Sair';
        authActionBtn.onclick = handleLogout;
        loadConsultorPartners();
    } else {
        authSection.style.display = 'block';
        crudSection.style.display = 'none';
        authActionBtn.textContent = 'Entrar';
        authActionBtn.onclick = () => {}; // Não faz nada, já está no login
    }
};

const handleLogin = async (e) => {
    e.preventDefault();
    authMessage.style.display = 'none';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        authMessage.textContent = 'Erro no login. Verifique as credenciais.';
        authMessage.style.display = 'block';
    } else {
        // Redirecionamento de sessão é tratado pelo onAuthStateChange
    }
};

const handleLogout = async () => {
    await supabase.auth.signOut();
};

// --- Lógica CRUD de Parceiros ---

// Carregar parceiros do consultor (Read)
const loadConsultorPartners = async () => {
    partnersList.innerHTML = '<p>Carregando seus parceiros...</p>';
    
    // O RLS garante que só os parceiros deste usuário sejam retornados
    const { data: partners, error } = await supabase
        .from('parceiros')
        .select('id, nome, segmento, aprovado, created_at')
        .order('created_at', { ascending: false }); 

    if (error) {
        partnersList.innerHTML = `<p class="message error">Erro ao carregar lista: ${error.message}</p>`;
        return;
    }

    if (partners.length === 0) {
        partnersList.innerHTML = '<p>Você ainda não cadastrou nenhum parceiro.</p>';
        return;
    }

    partnersList.innerHTML = partners.map(partner => `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <span>
                <strong>${partner.nome}</strong> (${partner.segmento || 'S/ Segmento'})
                <span style="color: ${partner.aprovado ? 'green' : 'orange'}; margin-left: 10px;">
                    [${partner.aprovado ? 'APROVADO' : 'PENDENTE'}]
                </span>
            </span>
            <div style="display: flex; gap: 10px; margin-top: 5px;">
                <button class="tag-btn" onclick="deletePartner('${partner.id}')">Excluir</button>
            </div>
        </div>
    `).join('');
};

// Deletar um parceiro (Delete)
window.deletePartner = async (partnerId) => {
    if (!confirm('Tem certeza que deseja deletar este parceiro?')) return;

    const { error } = await supabase
        .from('parceiros')
        .delete()
        .eq('id', partnerId);

    if (error) {
        alert('Erro ao deletar: ' + error.message);
    } else {
        alert('Parceiro excluído com sucesso!');
        loadConsultorPartners();
    }
};

// Cadastro de Parceiro (Create)
const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    
    // Coleta dos dados do formulário
    const partnerName = document.getElementById('partner-name').value;
    const partnerSegment = document.getElementById('partner-segment').value;
    const partnerDescription = document.getElementById('partner-description').value;
    const partnerAddress = document.getElementById('partner-address').value;
    const partnerCity = document.getElementById('partner-city').value;
    const partnerPhone = document.getElementById('partner-phone').value;
    const partnerHorario = document.getElementById('partner-horario').value;

    const newPartner = {
        nome: partnerName,
        segmento: partnerSegment,
        descricao: partnerDescription,
        endereco: partnerAddress,
        cidade: partnerCity,
        telefone: partnerPhone,
        horario_funcionamento: partnerHorario,
        // O consultor_id é automaticamente preenchido pelo RLS
    };
    
    // Insere no banco
    const { error } = await supabase
        .from('parceiros')
        .insert([newPartner]);

    if (error) {
        alert('Erro ao salvar parceiro: ' + error.message);
    } else {
        alert('Parceiro cadastrado com sucesso! Aguardando aprovação.');
        partnerForm.reset();
        loadConsultorPartners();
    }
};

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', handleLogin);
    partnerForm.addEventListener('submit', handlePartnerSubmit);

    // Monitora o estado da autenticação em tempo real
    supabase.auth.onAuthStateChange((event, session) => {
        displaySections(session);
    });
});
