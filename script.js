document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const thermalLoadInput = document.getElementById('thermalLoad');
    const evaporationTempInput = document.getElementById('evaporationTemp');
    const suggestedModelSpan = document.getElementById('suggestedModel');

    // Equipment data based on the provided image
    // The kcal/h values are the capacities. We need to ensure they are sorted ascendingly
    // for each temperature for the logic to find the "immediately superior" value correctly.
    const equipmentData = {
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
        // If you have more temperatures, add them here following the same structure.
        // Make sure the kcalh values are sorted in ascending order for each temperature.
    };

    calculateBtn.addEventListener('click', () => {
        const thermalLoad = parseFloat(thermalLoadInput.value);
        let evaporationTemp = parseFloat(evaporationTempInput.value);

        if (isNaN(thermalLoad) || isNaN(evaporationTemp)) {
            suggestedModelSpan.textContent = 'Por favor, insira valores válidos para Carga Térmica e Temperatura de Evaporação.';
            return;
        }

        let suggestedModel = 'Nenhum modelo encontrado para os critérios informados.';

        // Find the closest available evaporation temperature in our data
        // The image only shows -5°C and -25°C.
        // We'll prioritize exact match, then the closest available.
        let selectedTempData = null;
        if (evaporationTemp === -5) {
            selectedTempData = equipmentData['-5'];
        } else if (evaporationTemp === -25) {
            selectedTempData = equipmentData['-25'];
        } else {
            // Handle cases where the input temperature is not exactly -5 or -25
            // You might want to define a specific behavior for other temperatures.
            // For now, we'll indicate that the temperature is out of range.
            suggestedModelSpan.textContent = 'Temperatura de evaporação fora da faixa de dados disponível (-5°C ou -25°C).';
            return;
        }

        if (selectedTempData) {
            let found = false;
            for (let i = 0; i < selectedTempData.length; i++) {
                if (thermalLoad <= selectedTempData[i].kcalh) {
                    suggestedModel = selectedTempData[i].model;
                    found = true;
                    break; // Found the immediately superior or exact match
                }
            }

            if (!found) {
                // If the thermal load is greater than the largest capacity for the selected temperature
                suggestedModel = 'Carga térmica muito alta para os modelos disponíveis nesta temperatura de evaporação.';
            }

        } else {
            suggestedModel = 'Não há dados de equipamento para a temperatura de evaporação informada.';
        }

        suggestedModelSpan.textContent = suggestedModel;
    });
});
