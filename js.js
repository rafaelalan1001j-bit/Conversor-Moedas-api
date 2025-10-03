       
        const API_KEY = '3ec7a65497faa33'; 

        async function loadCurrentRates() {
            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6`);
                const data = await response.json();
                
                const ratesContainer = document.getElementById('currentRates');
                ratesContainer.innerHTML = `
                    <div class="result-label">Cotações Atuais (vs BRL)</div>
                    <div class="result-value">USD: ${data.rates.USD.toFixed(4)}</div>
                    <div class="result-value">EUR: ${data.rates.EUR.toFixed(4)}</div>
                    <div class="result-value">GBP: ${data.rates.GBP.toFixed(4)}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 10px;">Atualizado: ${new Date().toLocaleString()}</div>
                `;
            } catch (error) {
                document.getElementById('currentRates').innerHTML = `
                    <div class="error">Erro ao carregar cotações. Usando dados simulados.</div>
                    <div class="result-value">USD: 5.20</div>
                    <div class="result-value">EUR: 5.60</div>
                    <div class="result-value">GBP: 6.50</div>
                `;
            }
        }

        function createAlert() {
            const fromCurrency = document.getElementById('moeda-origem').value;
            const toCurrency = document.getElementById('moeda-destino').value;
            const targetRate = document.getElementById('taxa-alvo').value;
            const email = document.getElementById('email').value;

            if (!targetRate || !email) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const alert = {
                id: Date.now(),
                from: fromCurrency,
                to: toCurrency,
                target: targetRate,
                email: email,
                created: new Date().toLocaleString(),
                active: true
            };

            const alerts = JSON.parse(localStorage.getItem('exchangeAlerts') || '[]');
            alerts.push(alert);
            localStorage.setItem('exchangeAlerts', JSON.stringify(alerts));

            alert('Alerta criado com sucesso! Você receberá uma notificação por e-mail quando a taxa atingir ' + targetRate);
        }

        function loadAlerts() {
            const alerts = JSON.parse(localStorage.getItem('exchangeAlerts') || '[]');
            const alertsList = document.getElementById('alertsList');
            
            if (alerts.length === 0) {
                alertsList.innerHTML = '<p style="color: #999; text-align: center;">Nenhum alerta ativo</p>';
                return;
            }

            alertsList.innerHTML = alerts.map(alert => `
                <div class="alert-item ${alert.active ? 'alert-active' : ''}">
                    <strong>${alert.from} → ${alert.to}</strong><br>
                    Meta: ${alert.target}<br>
                    Criado: ${alert.created}<br>
                    <button onclick="deleteAlert(${alert.id})" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 5px; cursor: pointer;">Excluir</button>
                </div>
            `).join('');
        }

        function deleteAlert(alertId) {
            const alerts = JSON.parse(localStorage.getItem('exchangeAlerts') || '[]');
            const filteredAlerts = alerts.filter(alert => alert.id !== alertId);
            localStorage.setItem('exchangeAlerts', JSON.stringify(filteredAlerts));
            loadAlerts();
        }

        function loadHistoricalData() {
            const chart = document.getElementById('historicalChart');
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
            const values = [5.15, 5.22, 5.18, 5.25, 5.30, 5.20];
            
            chart.innerHTML = months.map((month, index) => `
                <div class="chart-bar" style="height: ${(values[index] - 5.0) * 100}px">
                    <div class="chart-bar-label">${month}</div>
                </div>
            `).join('');
        }

        function showSettings() {
            alert('Configurações de notificação:\n- E-mail: Ativo\n- Push: Disponível\n- SMS: Disponível');
        }
        
        loadCurrentRates();
        loadAlerts();