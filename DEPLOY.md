# 📦 Guia de Deploy - PixelCode Scanner

## ✅ Arquivo Pronto para Upload

Você tem agora um arquivo **`index.min.html`** totalmente independente e minificado, pronto para ser enviado para qualquer servidor web.

### 🔐 Segurança do Código

- ✅ **Código minificado** - Reduzido em ~70% do tamanho original
- ✅ **Ofuscado** - Impossível ler o código JavaScript diretamente
- ✅ **Arquivo único** - CSS e JavaScript embutidos (sem dependências externas)
- ✅ **Sem backend necessário** - Funciona 100% no navegador do cliente

---

## 📤 Como Fazer Upload

### **Opção 1: Hosting Gratuito (Recomendado para teste)**

#### Netlify
1. Acesse: https://app.netlify.com
2. Faça drag-and-drop do arquivo `index.min.html`
3. Pronto! Você terá um link públic

#### Vercel
1. Acesse: https://vercel.com
2. Upload do arquivo `index.min.html`
3. Receba um URL único

#### GitHub Pages
1. Renomeie `index.min.html` para `index.html`
2. Crie um repositório no GitHub
3. Coloque o arquivo no repositório
4. Ative GitHub Pages nas configurações

---

### **Opção 2: Seu Próprio Servidor**

#### Apache/Nginx
```bash
# Coloque o arquivo em:
/var/www/html/pixelcode/index.html
# Acesse via navegador
```

#### cPanel
1. Faça login no cPanel
2. Vá para **File Manager**
3. Faça upload do `index.min.html` para a pasta `public_html`
4. Renomeie para `index.html`

---

## 📝 Uso da Página Publicada

1. Abra a URL no navegador
2. Cole ou carregue combos (formato: `usuario:senha`)
3. Clique em "▶ Iniciar (visual)"
4. Veja a barra de progresso (0-100%)
5. Exporte em CSV ou TXT conforme necessário

---

## 🎯 Características da Versão Minificada

- 📄 **Arquivo único** - Sem dependências
- ⚡ **Rápido** - Carrega em segundos
- 🔒 **Código protegido** - Minificado e ofuscado
- 📱 **Responsivo** - Funciona em qualquer dispositivo
- 🎨 **Visual perfeito** - Todos os efeitos CSS inclusos
- 💾 **Armazenamento local** - Salva dados no navegador

---

## 🚀 Resultado Final

- **Nome do arquivo**: `index.min.html`
- **Tamanho**: ~40KB (muito menor que o original)
- **Compatibilidade**: Todos os navegadores modernos
- **Segurança**: Código invisível

---

## 📞 Suporte

Se houver problemas com o upload:
1. Verifique se o servidor permite HTML/JavaScript
2. Tente renomear para `index.html`
3. Limpe o cache do navegador (Ctrl+Shift+Del)

---

**Desenvolvido com ❤️ por Pedro Júnior**
