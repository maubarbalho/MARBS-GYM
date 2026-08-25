# MARSB-GYM — Pacote de publicação

Este pacote contém a versão completa do PWA MARSB-GYM, pronta para hospedagem estática. Para publicar, extraia todos os arquivos deste pacote e mantenha-os na mesma pasta pública do site. O arquivo de entrada é `index.html`.

## Arquivos incluídos

| Arquivo | Finalidade |
|---|---|
| `index.html` | Aplicativo completo, com HTML, CSS e JavaScript embutidos. |
| `sw.js` | Service worker responsável pelo cache e pelo funcionamento progressivo do app. |
| `manifest.json` | Configuração de instalação do PWA. |
| `icon-192.png` | Ícone do aplicativo para dispositivos compatíveis. |
| `icon-512.png` | Ícone de alta resolução para instalação e telas de abertura. |
| `xlsx.full.min.js` | Biblioteca local usada para importar e exportar treinos em Excel. |

## Como publicar

Envie todos os arquivos para a pasta pública do seu serviço de hospedagem. O endereço final precisa servir o `index.html` e o `sw.js` sob o mesmo caminho. Em uma hospedagem na raiz, por exemplo, o aplicativo será aberto em `https://seu-dominio.com/`; em uma subpasta, mantenha a estrutura intacta e abra o endereço correspondente à subpasta.

Para que a instalação como PWA e o service worker funcionem corretamente, publique o site usando **HTTPS**. A exceção é o ambiente local `localhost` ou `127.0.0.1`, que os navegadores tratam como seguro para testes.

Depois da publicação, abra o app uma vez, recarregue a página e verifique no navegador a opção de instalar o aplicativo. Se uma versão antiga continuar aparecendo, feche as abas do app e faça uma atualização forçada; o service worker usa o cache `marsb-gym-v55-performance-offline`.

## Coach e funcionamento offline

A interface e a execução do Coach/IA foram removidas desta versão. Preferências e histórico legados são preservados apenas para compatibilidade de dados, mas não são executados nem enviados para serviços externos. Treinos, histórico, recordes, calculadoras, dieta, configurações, backup e dados locais ficam no navegador do usuário; recursos remotos opcionais, como a geração de QR code, podem exigir conexão.

A biblioteca Excel é carregada somente quando uma ação de importação ou exportação é usada. Ela não faz parte do carregamento inicial do PWA, mas continua disponível no mesmo diretório público.

## Dados do usuário

Os treinos, pesos, histórico, diário e configurações são armazenados localmente no navegador por meio de `localStorage`. Recomenda-se utilizar a opção de exportação de backup dentro do app antes de limpar os dados do navegador ou trocar de dispositivo.

## Importante

Não remova nem renomeie os arquivos `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png` ou `xlsx.full.min.js`. Eles são referenciados pelo aplicativo e pelo manifesto PWA.
