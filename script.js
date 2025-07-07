document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const thermalLoadInput = document.getElementById('thermalLoad');
    const evaporationTempInput = document.getElementById('evaporationTemp');
    
    // Spans para exibir os resultados
    const suggestedModelSpan = document.getElementById('suggestedModel');
    const fanQuantitySpan = document.getElementById('fanQuantity');
    const fanDiameterSpan = document.getElementById('fanDiameter');
    const liquidConnectionSpan = document.getElementById('liquidConnection');
    const suctionConnectionSpan = document.getElementById('suctionConnection');
    const evaporatorLengthASpan = document.getElementById('evaporatorLengthA');

    // Dados de capacidade frigorífica por temperatura
    const capacityData = {
        '-5': [
            { model: 'FXB-O12', kcalh: 853 },
            { model: 'FXB-O13', kcalh: 1140 },
            { model: 'FXB-O19', kcalh: 1543 },
            { model: 'FXB-O24', kcalh: 1769 },
            { model: 'FXB-O31', kcalh: 2212 },
            { model: 'FXB-O39', kcalh: 2755 },
            { model: 'FXB-O48', kcalh: 3623 },
            { model: 'FXB-O52', kcalh: 3926 },
            { model: 'FXB-O63', kcalh: 4717 },
            { model: 'FXB-O81', kcalh: 6030 },
            { model: 'FXB-O97', kcalh: 7204 }
        ],
        '-25': [
            { model: 'FXB-O12', kcalh: 751 },
            { model: 'FXB-O13', kcalh: 1003 },
            { model: 'FXB-O19', kcalh: 1358 },
            { model: 'FXB-O24', kcalh: 1562 },
            { model: 'FXB-O31', kcalh: 1759 },
            { model: 'FXB-O39', kcalh: 2344 },
            { model: 'FXB-O48', kcalh: 2877 },
            { model: 'FXB-O52', kcalh: 3321 },
            { model: 'FXB-O63', kcalh: 3764 },
            { model: 'FXB-O81', kcalh: 4701 },
            { model: 'FXB-O97', kcalh: 5900 }
        ]
    };

    // Dados complementares por modelo (Ventiladores, Conexões, Medida A)
    const modelDetails = {
        'FXB-O12': { fanQuantity: 1, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '1/2', evaporatorLengthA: 555 },
        'FXB-O13': { fanQuantity: 1, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '1/2', evaporatorLengthA: 555 },
        'FXB-O19': { fanQuantity: 2, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '1/2', evaporatorLengthA: 858 },
        'FXB-O24': { fanQuantity: 2, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '5/8', evaporatorLengthA: 858 },
        'FXB-O31': { fanQuantity: 2, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '5/8', evaporatorLengthA: 858 },
        'FXB-O39': { fanQuantity: 3, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '5/8', evaporatorLengthA: 1186 },
        'FXB-O48': { fanQuantity: 3, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '3/4', evaporatorLengthA: 1186 },
        'FXB-O52': { fanQuantity: 4, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '3/4', evaporatorLengthA: 1513 },
        'FXB-O63': { fanQuantity: 4, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '3/4', evaporatorLengthA: 1513 },
        'FXB-O81': { fanQuantity: 5, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '7/8', evaporatorLengthA: 1839 },
        'FXB-O97': { fanQuantity: 6, fanDiameter: '254 mm', liquidConnection: '1/2', suctionConnection: '7/8', evaporatorLengthA: 2167 }
    };

    calculateBtn.addEventListener('click', () => {
        const thermalLoad = parseFloat(thermalLoadInput.value);
        const evaporationTemp = parseFloat(evaporationTempInput.value);

        // Limpar resultados anteriores
        suggestedModelSpan.textContent = '';
        fanQuantitySpan.textContent = '';
        fanDiameterSpan.textContent = '';
        liquidConnectionSpan.textContent = '';
        suctionConnectionSpan.textContent = '';
        evaporatorLengthASpan.textContent = '';

        if (isNaN(thermalLoad) || isNaN(evaporationTemp)) {
            suggestedModelSpan.textContent = 'Por favor, insira valores válidos para Carga Térmica e Temperatura de Evaporação.';
            return;
        }

        let selectedModel = null;
        let selectedTempData = null;

        // Selecionar os dados de capacidade com base na temperatura de evaporação
        if (evaporationTemp === -5) {
            selectedTempData = capacityData['-5'];
        } else if (evaporationTemp === -25) {
            selectedTempData = capacityData['-25'];
        } else {
            suggestedModelSpan.textContent = 'Temperatura de evaporação fora da faixa de dados disponível (-5°C ou -25°C).';
            return;
        }

        if (selectedTempData) {
            // Encontrar o modelo com base na carga térmica (valor exato ou imediatamente superior)
            for (let i = 0; i < selectedTempData.length; i++) {
                if (thermalLoad <= selectedTempData[i].kcalh) {
                    selectedModel = selectedTempData[i].model;
                    break;
                }
            }

            if (selectedModel) {
                // Exibir o modelo sugerido
                suggestedModelSpan.textContent = selectedModel;

                // Buscar e exibir os detalhes adicionais do modelo
                const details = modelDetails[selectedModel];
                if (details) {
                    fanQuantitySpan.textContent = details.fanQuantity;
                    fanDiameterSpan.textContent = details.fanDiameter;
                    liquidConnectionSpan.textContent = details.liquidConnection;
                    suctionConnectionSpan.textContent = details.suctionConnection;
                    evaporatorLengthASpan.textContent = details.evaporatorLengthA + ' mm'; // Adicionar unidade
                } else {
                    // Isso não deve acontecer se todos os modelos estiverem mapeados
                    suggestedModelSpan.textContent = 'Detalhes do modelo não encontrados.';
                }
            } else {
                // Se a carga térmica for maior que a capacidade máxima dos modelos disponíveis
                suggestedModelSpan.textContent = 'Carga térmica muito alta para os modelos disponíveis nesta temperatura de evaporação.';
            }

        } else {
            // Este caso já é tratado acima, mas mantido por segurança
            suggestedModelSpan.textContent = 'Não foi possível carregar os dados de capacidade para a temperatura informada.';
        }
    });
});
