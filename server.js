const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

// Endpoint para obter a música atual
app.get('/current-track', (req, res) => {
  const scriptPath = path.join(__dirname, 'get-spotify-info.ps1');

  // Executa o script PowerShell
  exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Erro ao executar PowerShell:', error);
      return res.status(500).send('Erro ao capturar música.');
    }

    try {
      // Converte a saída do PowerShell em JSON
      const output = stdout.trim();
      const parsedOutput = JSON.parse(output);

      if (parsedOutput.message) {
        res.json({ message: parsedOutput.message });
      } else {
        // Retorna os dados da música
        res.json({
          name: parsedOutput.name || 'Desconhecido',
          artist: parsedOutput.artist || 'Desconhecido',
        });
      }
    } catch (parseError) {
      console.error('Erro ao processar saída do PowerShell:', parseError);
      res.status(500).send('Erro ao processar dados da música.');
    }
  });
});

// Servir arquivos estáticos da raiz do projeto
app.use(express.static(__dirname));

// Redirecionar para index.html se nenhum arquivo for encontrado
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});