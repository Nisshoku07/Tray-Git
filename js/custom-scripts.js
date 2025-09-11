document.addEventListener('DOMContentLoaded', function () {
    const filterForm = document.querySelector('form.smart-filter');
    // Renomeei o botao para evitar conflito de nome com a funcao submit do formulario.
    const submitButton = document.getElementById('main-filter-button');
    const clearFiltersLink = document.getElementById('clear-all-filters');

    // --- LOGICA DO BOTAO PRINCIPAL "APLICAR FILTROS" ---
    if (submitButton) {
        submitButton.addEventListener('click', function (event) {
            // Previne o envio padrao do formulario para podermos adicionar a logica.
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
            
            // Pega todos os parametros do formulario (checkbox, etc)
            const formData = new FormData(filterForm);
            const params = new URLSearchParams(formData);

            // --- LOGICA DE PRECO CORRIGIDA ---
            // Deleta qualquer filtro de preco preexistente para nao duplicar.
            params.delete('prices[]');

            if (!isNaN(min) && !isNaN(max)) {
                // Cenario 1: Minimo e Maximo preenchidos.
                params.set('prices[]', `${min},${max}`);
            } else if (!isNaN(min)) {
                // Cenario 2: Apenas Minimo preenchido. Usa um valor maximo muito alto.
                params.set('prices[]', `${min},999999`);
            } else if (!isNaN(max)) {
                // Cenario 3: Apenas Maximo preenchido. Usa 0 como minimo.
                params.set('prices[]', `0,${max}`);
            }
            // Se nenhum campo de preco foi preenchido, ele simplesmente nao adiciona o parametro `prices[]`.

            // Redireciona para a URL com todos os filtros corretos.
            window.location.href = window.location.pathname + '?' + params.toString();
        });
    }

    // --- LOGICA DO BOTAO "LIMPAR FILTROS" ---
    if (clearFiltersLink) {
        clearFiltersLink.addEventListener('click', function (event) {
            event.preventDefault();
            // Redireciona para a URL da pagina atual, sem NENHUM parametro de filtro.
            window.location.href = window.location.pathname;
        });
    }
    
    // ==========================================================
    // INICIO - CODIGO DE CORRECAO DA REFERENCIA DO PRODUTO (TRAY)
    // ==========================================================

    // Seleciona o elemento <span> que envolve a referencia.
    const referenceContainer = document.querySelector('span#referencia_variavel_produto');

    // 1. Roda o codigo apenas se estivermos em uma pagina que tenha esse elemento.
    if (referenceContainer) {
        
        // Encontra o elemento <strong> onde o texto realmente fica.
        const referenceElement = referenceContainer.querySelector('strong.dados-valor');

        if (referenceElement) {

            // 2. No carregamento inicial, guarda a referencia CORRETA que veio do servidor.
            const correctReference = referenceElement.textContent.trim();
    
            // 3. Cria um "observador" que vigia qualquer tentativa de mudanca no elemento.
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
                childList: true,     // Observa quando o texto (que e um "no filho") e trocado.
                subtree: true        // Necessario para observar o <strong> dentro do <span>.
            });
        }
    }
    // ==========================================================
    // FIM - CODIGO DE CORRECAO
    // ==========================================================

    // ESTE CODIGO FOI OTIMIZADO PARA O INP.
    // OTIMIZADO: Este codigo agora roda apenas uma vez para evitar bloqueios.
    // Ele aguarda 300ms para garantir que os elementos do filtro foram carregados.
    setTimeout(() => {
        const checkboxes = document.querySelectorAll('.filter-block-categories input[type="checkbox"]');
        if (checkboxes.length > 0) {
            const nomesMarcasExibir = [
                "AMARANTE", "AMISSIMA", "ANACAPRI", "ANA DO CEU", "ANNE FERNANDES", "BETELGEUSE", "BFLY",
                "CALVIN KLEIN", "CANTAO", "CAOS", "CARRANO", "CHARTH", "CITY CLASS", "CLEO CARVALHO",
                "DECENCIA", "DELIGHT", "DUPLO SENTIDO", "ELLEN BAPTISTA", "ESQUIRE", "FLECHE DOR", "FOR YETTS",
                "FRUTACOR", "GRAF", "HUSH", "INOCENCE", "IODICE", "IORANE", "ISLA", "JORGE BISCHOFF", "LACOSTE",
                "LIUZZI", "LINA BRAND", "LORE", "LOUCOS E SANTOS", "LOVIT", "LUIZA BARCELOS", "MAMO", "MARACUJA",
                "MARIA VALENTINA", "M NACIONAL", "MIA BRAND", "MM ESPECIAL", "MN MAXNINO", "MODELAN", "MORENA ROSA",
                "MORENA ROSA BEACH", "MORENA ROSA LIVING", "PATCHOULEE", "PLIE", "RESERVA", "ROSA DAHLIA", "RYZI",
                "SANTA LOLLA", "SCHUTZ", "SEIKI", "SIS BRAND", "SKAZI", "SKUNK", "STRASS", "THAMARA CAPELAO",
                "TOMMY HILFIGER", "VICENZA", "VICTOR DZENK", "WINK", "YTCOM", "ZINCO", "MARCAS", "ROUPAS"
            ];

            checkboxes.forEach(el => {
                const labelText = el.nextElementSibling?.querySelector('.filter-name')?.innerText.trim();
                if (nomesMarcasExibir.includes(labelText)) {
                    const item = el.closest('.filter-item');
                    if (item) item.remove();
                }
            });
        }
    }, 300);
});