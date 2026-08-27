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

Depois da publicação, abra o app uma vez, recarregue a página e verifique no navegador a opção de instalar o aplicativo. Se uma versão antiga continuar aparecendo, use o botão **Atualizar app** no topo da tela inicial ou feche as abas do app e faça uma atualização forçada; o service worker usa o cache `marsb-gym-v75-global-visual-rebrand`. A ativação remove caches antigos, salva a sessão guiada, os campos visíveis e a navegação antes de recarregar, sem limpar o `localStorage`. O endereço recebe um parâmetro de atualização para evitar que o navegador reutilize a página antiga. No PWA instalado no iPhone, a checagem também acontece ao abrir novamente o app, voltar para ele depois de deixá-lo em segundo plano e recuperar a conexão; o fluxo usa `registration.update()` e o service worker busca os arquivos de navegação sem reutilizar o cache HTTP antigo.

## Coach e funcionamento offline

A interface e a execução do Coach/IA foram removidas desta versão. Preferências e histórico legados são preservados apenas para compatibilidade de dados, mas não são executados nem enviados para serviços externos. Treinos, histórico, recordes, calculadoras, dieta, configurações, backup e dados locais ficam no navegador do usuário; recursos remotos opcionais, como a geração de QR code, podem exigir conexão.

A biblioteca Excel é carregada somente quando uma ação de importação ou exportação é usada. Ela não faz parte do carregamento inicial do PWA, mas continua disponível no mesmo diretório público.

## Timer de descanso em segundo plano

O timer de descanso não depende de decrementar um contador a cada execução de `setInterval`. Ao iniciar ou retomar, o app grava um prazo absoluto (`Date.now()`), persiste esse estado no armazenamento local e recalcula o tempo restante ao receber `visibilitychange`, `pageshow`, `focus` ou ao reabrir o PWA. Assim, o tempo transcorrido é refletido corretamente quando o usuário volta ao app, mesmo que o sistema suspenda a execução do JavaScript em segundo plano. A pausa continua sendo exclusivamente manual.

O navegador ou o sistema operacional pode suspender completamente o PWA; por isso, um alerta sonoro ou vibração no instante exato enquanto o app está suspenso não é garantido. A garantia implementada é a correção do relógio e da finalização assim que o app retorna ao primeiro plano.

## Identidade visual verde-limão

O app usa o logo oficial `apple-touch-icon.png` ao lado do nome `MARSB-GYM` no cabeçalho principal e no treino guiado. O header principal mantém apenas a marca, sem o subtítulo “Hipertrofia • Treino livre e progresso contínuo”, e foi reduzido para liberar espaço útil no celular. A paleta global foi harmonizada em torno de verde-limão, com superfícies grafite no tema escuro, uma variação clara acessível (`#58740F` para ações com texto branco), estados de ação coerentes e cores de foco ajustadas. Ícones funcionais seguem um tratamento outline arredondado, enquanto a tipografia usa papéis de display, headline, title, body e label com a fonte do sistema. A troca é somente visual e não altera planos, exercícios, sessões, histórico, pesos, dieta ou demais dados locais.

## Sistema visual global

A mesma linguagem visual é aplicada em Início, Treinos, Progresso, Dieta, Calculadoras e Configuração. Verde-limão é reservado para ações, progresso e seleção; grafite organiza superfícies e controles; texto principal e secundário usam tons claros com contraste elevado. O sistema de ícones mantém estilo único e os rótulos textuais continuam presentes nas ações críticas, sem depender somente de cor ou símbolo.

## Layout compacto do treino guiado

A área visual do exercício foi reduzida novamente para um bloco compacto de `60 px` no celular, deixando mais espaço para o nome, as instruções e os controles de séries. O cabeçalho guiado também se reorganiza em duas linhas para evitar sobreposição do nome, modo e ações. Os círculos de conclusão reduzem apenas a área visual para `32 px`, preservando o alvo de toque de `44 px`. O bloco permanece identificado como elemento visual acessível, mantém o enquadramento e não altera nenhum dado do treino.

Na aba **Treinos**, quando existe uma sessão ativa, o app mostra o treino atual em um painel próprio, com progresso, próximo exercício, modo de execução e ações para continuar ou abrir o treino. Esse painel é derivado do estado já salvo e não cria registros adicionais.

No modo guiado, os controles **Anterior** e **Próximo** ficam na primeira linha, **Iniciar timer** e **Repetir última** ficam na segunda, e **Encerrar exercício** e **Encerrar treino agora** ficam por último no mesmo bloco do cartão do exercício. A faixa de ações rápida separada foi removida para evitar duplicidade, deslocamento visual e sobreposição no celular.

## Controles e foco no celular

Em telas de até 600 px, os campos editáveis do app — pesos, repetições, busca, datas, horários, seletores e áreas de texto — usam fonte mínima de `16 px` para evitar o zoom automático comum ao focar campos pequenos em navegadores móveis. O ajuste não usa `user-scalable=no` nem `maximum-scale=1`; portanto, o usuário continua podendo ampliar manualmente a página quando precisar.

## Registro sem peso informado

Ao marcar explicitamente uma série como concluída sem preencher o peso, o app registra `0 kg` para aquela série e mantém o valor visível no treino e no histórico. A regra não é aplicada apenas ao abrir, renderizar ou consultar o treino: ela ocorre somente no clique de conclusão. Pesos já preenchidos, exemplos, plano, exercícios personalizados, sessão ativa, histórico, dieta e demais dados locais não são substituídos automaticamente.

O zero representa uma série concluída sem carga informada; por isso, ela não aumenta o volume calculado nem gera uma estimativa de 1RM. Se o usuário quiser corrigir o registro, pode editar o peso da série depois.

## Aviso local de fim do descanso

Em **Configurações > Notificações**, o usuário pode ativar explicitamente o aviso quando o timer de descanso terminar. Após a permissão do navegador, o app tenta mostrar uma notificação pelo service worker, com vibração e retorno para a tela de treinos ao tocar. O botão **Testar aviso** permite confirmar a permissão e o funcionamento sem iniciar um timer real.

A preferência `notifications.timerEnd` é compatível com estados antigos e fica armazenada localmente. Nenhuma inscrição de Web Push, conta, servidor ou dado de treino é criado. Se a permissão for negada, o navegador não suportar notificações ou o sistema suspender o PWA, o timer, o aviso dentro do app, a vibração e a correção pelo prazo absoluto continuam funcionando como fallback. Por isso, o aviso é de **melhor esforço** e não equivale a um alarme nativo garantido com o aparelho bloqueado.

## Pesos decimais

Os campos de carga dos exercícios, do treino guiado, do perfil e das calculadoras aceitam valores com ponto ou vírgula decimal, como `2.5`, `2,5`, `7.5` ou `7,5`. A entrada usa teclado decimal em celulares e os valores são normalizados internamente para manter cálculos, histórico, progressão e exportações consistentes.

## Sprint 2: filtros e substituições por equipamento

A aba Treinos possui filtros por grupo muscular e equipamento, derivados automaticamente dos exercícios do plano atual, incluindo exercícios personalizados e overrides. O modal de substituição prioriza alternativas do mesmo grupo muscular que utilizem outro equipamento e exibe séries, repetições, grupo e equipamento antes da confirmação. Filtrar e abrir o modal são ações somente de visualização; uma substituição só é aplicada após o usuário confirmar explicitamente, usando o mecanismo de override existente e mantendo os registros vinculados à posição do exercício.

## Sprint 3: gráficos de evolução e planejado versus realizado

A aba Progresso agora apresenta gráficos SVG leves e locais de volume por sessão e, quando existe um exercício selecionado, evolução de carga máxima, volume e 1RM estimado por sessão. O modal de evolução do exercício também reúne esses indicadores, o histórico detalhado e o comparativo entre o objetivo do plano ativo — séries e faixa de repetições — e a última sessão registrada. As visualizações são derivadas dos dados existentes, funcionam sem biblioteca externa e não criam um novo estado persistido.

O comparativo é informativo: ele não altera carga, séries, marcações, histórico, plano personalizado, exercícios personalizados, sessão ativa, dieta ou qualquer outro dado local. O 1RM e os gráficos são estimativas; registros legados somente com carga podem aparecer na carga máxima, mas não geram 1RM ou volume sem repetições. Nenhuma progressão é aplicada automaticamente.

## Sprint 4: supersets, circuitos e biblioteca da sessão

No treino guiado, o usuário pode escolher explicitamente o modo **Normal**, **Superset (2)** ou **Circuito** antes de iniciar. No modo Superset, o app alterna entre dois exercícios consecutivos após cada série marcada; no modo Circuito, alterna pelas estações do treino e retorna à próxima rodada. A navegação continua permitindo avançar, voltar e reabrir exercícios pendentes, e cada série permanece vinculada ao exercício original para não misturar pesos, repetições ou histórico.

O modo escolhido para uma sessão ativa é salvo somente como uma preferência de navegação da própria sessão, de forma retrocompatível; o plano, os exercícios, séries, cargas, histórico, dieta e demais dados não são reescritos. Sessões antigas sem esse campo continuam abrindo em modo Normal. A seleção é explícita e não altera o plano personalizado.

A aba Treinos e o treino guiado também oferecem uma biblioteca curta, expansível e local com sugestões gerais de aquecimento, mobilidade e volta à calma. Ela não cria agenda, não inicia timer, não registra conclusão e não substitui avaliação profissional. O usuário deve interromper a atividade diante de dor aguda, tontura ou perda de controle.

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
