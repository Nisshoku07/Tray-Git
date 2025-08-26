document.addEventListener('DOMContentLoaded', function () {
    const filterForm = document.querySelector('form.smart-filter');
    // Renomeei o botão para evitar conflito de nome com a função `submit` do formulário.
    const submitButton = document.getElementById('main-filter-button'); 
    const clearFiltersLink = document.getElementById('clear-all-filters');

    // --- LOGICA DO BOTAO PRINCIPAL "APLICAR FILTROS" ---
    if (submitButton) {
        submitButton.addEventListener('click', function (event) {
            // Previne o envio padrão do formulário para podermos adicionar a lógica de preço.
            event.preventDefault();

            const minInput = document.getElementById('price-min');
            const maxInput = document.getElementById('price-max');
            const errorBox = document.getElementById('price-error');
            
            errorBox.classList.add('hidden');
            minInput.classList.remove('input-error');
            maxInput.classList.remove('input-error');
            
            const min = parseFloat(minInput.value);
            const max = parseFloat(maxInput.value);

            if (!isNaN(min) && !isNaN(max) && min >= max) {
                errorBox.textContent = 'O minimo deve ser menor que o maximo.';
                errorBox.classList.remove('hidden');
                minInput.classList.add('input-error');
                maxInput.classList.add('input-error');
                return;
            }
            
            // Pega todos os parâmetros do formulário (checkboxes, etc.)
            const formData = new FormData(filterForm);
            const params = new URLSearchParams(formData);

            // --- LOGICA DE PRECO CORRIGIDA ---
            // Deleta qualquer filtro de preço existente para não duplicar.
            params.delete('prices[]');

            if (!isNaN(min) && !isNaN(max)) {
                // Cenário 1: Minimo e Maximo preenchidos.
                params.set('prices[]', `${min},${max}`);
            } else if (!isNaN(min)) {
                // Cenário 2: Apenas Minimo preenchido. Usa um valor maximo muito alto.
                params.set('prices[]', `${min},999999`);
            } else if (!isNaN(max)) {
                // Cenário 3: Apenas Máximo preenchido. Usa 0 como minimo.
                params.set('prices[]', `0,${max}`);
            }
            // Se nenhum campo de preço foi preenchido, ele simplesmente não adiciona o parâmetro `prices[]`.

            // Redireciona para a URL com todos os filtros corretos.
            window.location.href = window.location.pathname + '?' + params.toString();
        });
    }

    // --- LOGICA DO BOTAO "LIMPAR FILTROS" ---
    if (clearFiltersLink) {
        clearFiltersLink.addEventListener('click', function (event) {
            event.preventDefault();
            // Redireciona para a URL da página atual, sem NENHUM parâmetro de filtro.
            window.location.href = window.location.pathname;
        });
    }
    
    // ==========================================================
    // INÍCIO - CÓDIGO DE CORREÇÃO DA REFERÊNCIA DO PRODUTO (TRAY)
    // ==========================================================

    // Seleciona o elemento <span> que envolve a referência.
    const referenceContainer = document.querySelector('span#referencia_variavel_produto');

    // 1. Roda o código apenas se estivermos em uma página que tenha esse elemento.
    if (referenceContainer) {
        
        // Encontra o elemento <strong> onde o texto realmente fica.
        const referenceElement = referenceContainer.querySelector('strong.dados-valor');

        if (referenceElement) {

            // 2. No carregamento inicial, guarda a referência CORRETA que veio do servidor.
            const correctReference = referenceElement.textContent.trim();
    
            // 3. Cria um "observador" que vigia qualquer tentativa de mudança no elemento.
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    
                    const currentText = referenceElement.textContent.trim();
    
                    // 4. Se o texto mudar para algo DIFERENTE do que guardamos...
                    if (currentText !== correctReference) {
                        
                        // 5. ...nosso script corrige de volta para o valor original!
                        referenceElement.textContent = correctReference;
                    }
                });
            });
    
            // 6. Inicia o observador para monitorar o elemento.
            observer.observe(referenceContainer, {
                childList: true,     // Observa quando o texto (que é um "nó filho") é trocado.
                subtree: true        // Necessário para observar o <strong> dentro do <span>.
            });
        }
    }
    // ==========================================================
    // FIM - CÓDIGO DE CORREÇÃO
    // ==========================================================
});


// ESTE CODIGO PERMANECE IGUAL.
const limparCategoriasMarcas = setInterval(() => {
    const checkboxes = document.querySelectorAll('.filter-block-categories input[type="checkbox"]');

    if (checkboxes.length > 0) {
        const nomesMarcasExibir = [
            "Amarante", "Amissima", "Anacapri", "Ana do Céu", "Anne Fernandes", "Betelgeuse", "Bfly",
            "Calvin Klein", "Cantão", "Caos", "Carrano", "Charth", "City Class", "Cleo Carvalho",
            "Decencia", "Delight", "Duplo Sentido", "Ellen Baptista", "Esquire", "Fleche Dor", "For Yetts",
            "Frutacor", "Graf", "Hush", "Inocence", "Iodice", "Iorane", "Isla", "Jorge Bischoff", "Lacoste",
            "Liuzzi", "Lina Brand", "Lore", "Loucos e Santos", "Lovit", "Luiza Barcelos", "Mamô", "Maracujá",
            "Maria Valentina", "M Nacional", "Mia Brand", "MM Especial", "MN Maxnino", "Modelan", "Morena Rosa",
            "Morena Rosa Beach", "Morena Rosa Living", "Patchoulee", "Plié", "Reserva", "Rosa Dahlia", "Ryzí",
            "Santa Lolla", "Schutz", "Seiki", "Sis Brand", "Skazi", "Skunk", "Strass", "Thamara Capelão",
            "Tommy Hilfiger", "Vicenza", "Victor Dzenk", "Wink", "YTCOM", "Zinco", "MARCAS", "ROUPAS"
        ];

        checkboxes.forEach(el => {
            const labelText = el.nextElementSibling?.querySelector('.filter-name')?.innerText.trim();
            if (nomesMarcasExibir.includes(labelText)) {
                const item = el.closest('.filter-item');
                if (item) item.remove();
            }
        });

        clearInterval(limparCategoriasMarcas);
    }
}, 300);