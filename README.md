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

Depois da publicação, abra o app uma vez, recarregue a página e verifique no navegador a opção de instalar o aplicativo. Se uma versão antiga continuar aparecendo, feche as abas do app e faça uma atualização forçada; o service worker usa o cache `marsb-gym-v60-completed-workouts-visible`.

## Coach e funcionamento offline

A interface e a execução do Coach/IA foram removidas desta versão. Preferências e histórico legados são preservados apenas para compatibilidade de dados, mas não são executados nem enviados para serviços externos. Treinos, histórico, recordes, calculadoras, dieta, configurações, backup e dados locais ficam no navegador do usuário; recursos remotos opcionais, como a geração de QR code, podem exigir conexão.

A biblioteca Excel é carregada somente quando uma ação de importação ou exportação é usada. Ela não faz parte do carregamento inicial do PWA, mas continua disponível no mesmo diretório público.

## Timer de descanso em segundo plano

O timer de descanso não depende de decrementar um contador a cada execução de `setInterval`. Ao iniciar ou retomar, o app grava um prazo absoluto (`Date.now()`), persiste esse estado no armazenamento local e recalcula o tempo restante ao receber `visibilitychange`, `pageshow`, `focus` ou ao reabrir o PWA. Assim, o tempo transcorrido é refletido corretamente quando o usuário volta ao app, mesmo que o sistema suspenda a execução do JavaScript em segundo plano. A pausa continua sendo exclusivamente manual.

O navegador ou o sistema operacional pode suspender completamente o PWA; por isso, um alerta sonoro ou vibração no instante exato enquanto o app está suspenso não é garantido. A garantia implementada é a correção do relógio e da finalização assim que o app retorna ao primeiro plano.

## Pesos decimais

Os campos de carga dos exercícios, do treino guiado, do perfil e das calculadoras aceitam valores com ponto ou vírgula decimal, como `2.5`, `2,5`, `7.5` ou `7,5`. A entrada usa teclado decimal em celulares e os valores são normalizados internamente para manter cálculos, histórico, progressão e exportações consistentes.

## Lista de treinos concluídos

O filtro inicial continua priorizando exercícios pendentes, mas um treino totalmente concluído permanece visível na lista quando não há busca ativa. O card aparece recolhido e identificado como `Concluído`, permitindo revisar a sessão, abrir o treino novamente ou consultar seus registros. A mudança é apenas de visualização e não altera marcações, pesos, histórico, plano personalizado ou dados locais.

## Dica de recuperação ao finalizar o treino

Ao concluir um treino completo, o resumo da sessão mostra uma única dica automática com uma estimativa de recuperação dos grupos musculares trabalhados. A dica usa o treino, as séries concluídas e o volume registrado como referência. Ela aparece somente no resumo final, não cria agenda, não envia lembretes, não acompanha o usuário depois e não bloqueia um novo treino. É uma estimativa informativa, não uma confirmação fisiológica de recuperação.

## Sprint 1: ficha local e orientação de progressão

Os cards de exercícios e o treino guiado oferecem uma ficha local, disponível sem conexão, com grupo muscular principal, equipamento de referência, passos gerais de execução, atenção técnica, séries, repetições e descanso configurado. A ficha é informativa e não altera séries, cargas, histórico ou o plano salvo. O app também mostra o último desempenho e a sugestão de progressão já configurada, sempre permitindo ajuste manual.

## Preservação do plano personalizado nas atualizações

O plano personalizado continua armazenado junto aos dados locais em `localStorage`. Além disso, quando o plano é salvo ou importado, o app cria uma cópia independente em `marsbGym_plan_backup_v1` e verifica se a gravação principal pode ser relida. Ao iniciar após uma atualização ou migração, se o estado principal estiver sem plano, o app tenta restaurar essa cópia antes de usar o plano padrão. O retorno ao padrão continua sendo uma ação manual, protegida por confirmação.

A proteção não substitui a exportação de backup: limpar os dados do site, trocar de domínio/origem ou remover os dados do navegador pode apagar o armazenamento local.

## Dados do usuário

Os treinos, pesos, histórico, diário e configurações são armazenados localmente no navegador por meio de `localStorage`. Recomenda-se utilizar a opção de exportação de backup dentro do app antes de limpar os dados do navegador ou trocar de dispositivo.

## Importante

Não remova nem renomeie os arquivos `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png` ou `xlsx.full.min.js`. Eles são referenciados pelo aplicativo e pelo manifesto PWA.
