# PixelCode Scanner — Visual UI (Mock)

**Aviso**: Este repositório contém apenas a **interface visual** (HTML/CSS/JS) do painel "PixelCode Scanner". **Não** realiza varredura, checagem de credenciais ou qualquer tentativa de login em servidores remotos — é seguro para demonstração, design e integração em projetos legais.

## Conteúdo
- `index.html` — página principal (UI).
- `style.css` — estilos (tema dark azul neon).
- `script.js` — comportamentos UI-only (leitura de arquivo, formatação visual, export CSV/TXT, salvar local).
- `README.md` — este arquivo.

## Uso local (rápido)
1. Descompacte o ZIP.
2. Abra `index.html` diretamente no navegador OR rode um servidor local recomendado para evitar restrições:
   - Com Python 3:
     ```bash
     python -m http.server 8000
     ```
     Abra: `http://localhost:8000`
   - Ou com Node (http-server):
     ```bash
     npx http-server -p 8000
     ```

## Deploy (URL pública)
Você pode hospedar este site em serviços estáticos gratuitos:
- **GitHub Pages**: crie um repositório e envie os arquivos. Em *Settings → Pages*, escolha a branch `main` e root `/`.
- **Vercel**: faça deploy arrastando a pasta ou conectando o repositório — deploy automático.
- **Netlify**: arraste e solte a pasta no painel ou conecte o repositório.

## Export
- `Exportar TXT` gera `pixelcode_hits.txt` contendo blocos formatados (com emojis e links).
- `Exportar CSV` gera arquivo CSV com colunas: host,username,password,status,expiration,maxConnections,m3uLink,timestamp.

## Integração com backend real (APENAS se você administrar o servidor)
Se desejar ligar este front-end a um backend real que você controla, implemente um endpoint seguro que retorne JSON e tenha CORS configurado. **Eu posso ajudar** a criar um backend seguro (Node/Express) se você confirmar que controla o servidor alvo.

## Licença
Use livremente para fins legais e educativos. Não use para atividades ilegais ou abusivas.
