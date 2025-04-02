// carrega dom
document.addEventListener('DOMContentLoaded', function() {
    // seleciona formulario
    const form = document.getElementById('cadastro-form');
    // seleciona resultado
    const resultado = document.getElementById('resultado');
    // seleciona dados
    const dadosCadastro = document.getElementById('dados-cadastro');
    // seleciona historico
    const historicoContainer = document.getElementById('historico-cadastros');
    
    // array de cadastros
    let cadastros = [];
    
    // carrega cadastros
    carregarCadastros();
    
    // evento submit
    form.addEventListener('submit', function(event) {
        // previne reload
        event.preventDefault();
        
        // valida antes de processar
        if (validarFormulario()) {
            // captura dados
            const dados = capturarDados();
            // adiciona id unico
            dados.id = Date.now();
            // guarda cadastro
            cadastros.push(dados);
            // salva no storage
            localStorage.setItem('cadastros', JSON.stringify(cadastros));
            // exibe dados
            exibirDados(dados);
            // atualiza historico
            atualizarHistorico();
            // limpa form
            form.reset();
        }
    });
    
    // valida formulario
    function validarFormulario() {
        // verifica interesses
        const interesses = document.querySelectorAll('input[name="interesses"]:checked');
        if (interesses.length === 0) {
            alert('Por favor, selecione pelo menos um interesse.');
            return false;
        }
        
        // formulario valido
        return true;
    }
    
    // captura dados
    function capturarDados() {
        // objeto dados
        const dados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            telefone: document.getElementById('telefone').value,
            area: document.getElementById('area').value,
            escolaridade: document.querySelector('input[name="escolaridade"]:checked').value,
            interesses: [],
            observacoes: document.getElementById('observacoes').value || 'Não informado'
        };
        
        // captura interesses
        const interessesChecked = document.querySelectorAll('input[name="interesses"]:checked');
        interessesChecked.forEach(function(interesse) {
            dados.interesses.push(interesse.value);
        });
        
        return dados;
    }
    
    // exibe dados
    function exibirDados(dados) {
        // formata data
        const dataNascimentoFormatada = formatarData(dados.dataNascimento);
        
        // traduz valores
        const areaInteresse = traduzirArea(dados.area);
        const escolaridade = traduzirEscolaridade(dados.escolaridade);
        const interesses = traduzirInteresses(dados.interesses);
        
        // cria html
        let html = `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>E-mail:</strong> ${dados.email}</p>
            <p><strong>Data de Nascimento:</strong> ${dataNascimentoFormatada}</p>
            <p><strong>Telefone:</strong> ${dados.telefone}</p>
            <p><strong>Área de Interesse:</strong> ${areaInteresse}</p>
            <p><strong>Nível de Escolaridade:</strong> ${escolaridade}</p>
            <p><strong>Interesses:</strong> ${interesses}</p>
            <p><strong>Observações:</strong> ${dados.observacoes}</p>
        `;
        
        // insere html
        dadosCadastro.innerHTML = html;
        
        // mostra resultado
        resultado.style.display = 'block';
        
        // rola para resultado
        resultado.scrollIntoView({ behavior: 'smooth' });
    }
    
    // formata data
    function formatarData(data) {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR');
    }
    
    // traduz area
    function traduzirArea(area) {
        const areas = {
            'administrativa': 'Administrativa',
            'juridica': 'Jurídica',
            'saude': 'Saúde',
            'educacao': 'Educação',
            'outra': 'Outra'
        };
        
        return areas[area] || area;
    }
    
    // traduz escolaridade
    function traduzirEscolaridade(escolaridade) {
        const escolaridades = {
            'medio': 'Ensino Médio',
            'superior': 'Ensino Superior',
            'posGraduacao': 'Pós-Graduação'
        };
        
        return escolaridades[escolaridade] || escolaridade;
    }
    
    // traduz interesses
    function traduzirInteresses(interesses) {
        const interessesTraducoes = {
            'concursoPublico': 'Concurso Público',
            'certificacao': 'Certificação Profissional',
            'aprimoramento': 'Aprimoramento Profissional'
        };
        
        // traduz e junta
        return interesses.map(interesse => interessesTraducoes[interesse] || interesse).join(', ');
    }
    
    // carrega cadastros salvos
    function carregarCadastros() {
        // pega do storage
        const cadastrosSalvos = localStorage.getItem('cadastros');
        if (cadastrosSalvos) {
            cadastros = JSON.parse(cadastrosSalvos);
            atualizarHistorico();
        }
    }
    
    // atualiza lista de cadastros
    function atualizarHistorico() {
        // verifica elemento
        if (!historicoContainer) return;
        
        // limpa container
        historicoContainer.innerHTML = '';
        
        // verifica vazio
        if (cadastros.length === 0) {
            historicoContainer.innerHTML = '<p class="sem-cadastros">Nenhum cadastro realizado ainda.</p>';
            return;
        }
        
        // cria lista
        cadastros.forEach(cadastro => {
            // cria container
            const itemCadastro = document.createElement('div');
            itemCadastro.className = 'cadastro-item';
            
            // formata data
            const dataNascimento = formatarData(cadastro.dataNascimento);
            
            // traduz valores
            const areaInteresse = traduzirArea(cadastro.area);
            
            // preenche conteudo
            itemCadastro.innerHTML = `
                <div class="cadastro-info">
                    <h3>${cadastro.nome}</h3>
                    <p><strong>E-mail:</strong> ${cadastro.email}</p>
                    <p><strong>Área:</strong> ${areaInteresse}</p>
                    <p><strong>Data:</strong> ${dataNascimento}</p>
                </div>
                <div class="cadastro-acoes">
                    <button class="btn-excluir" data-id="${cadastro.id}">Excluir</button>
                </div>
            `;
            
            // adiciona na lista
            historicoContainer.appendChild(itemCadastro);
        });
        
        // adiciona evento nos botoes
        const botoesExcluir = document.querySelectorAll('.btn-excluir');
        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', function() {
                // pega id do botao
                const id = parseInt(this.getAttribute('data-id'));
                // remove cadastro
                removerCadastro(id);
            });
        });
    }
    
    // remove cadastro
    function removerCadastro(id) {
        // confirma exclusao
        if (confirm('Tem certeza que deseja excluir este cadastro?')) {
            // filtra lista
            cadastros = cadastros.filter(cadastro => cadastro.id !== id);
            // atualiza storage
            localStorage.setItem('cadastros', JSON.stringify(cadastros));
            // atualiza tela
            atualizarHistorico();
        }
    }
});