# Auditoria de abas — MARSB-GYM v44

**Objetivo.** Avaliar os fluxos principais do PWA em uso predominantemente móvel, identificando oportunidades de clareza, velocidade, acessibilidade, confiabilidade local e continuidade entre abas. Esta auditoria não altera o comportamento do aplicativo.

## Escopo de teste

| Aba | Fluxos a observar |
|---|---|
| Início | Estado vazio, início/retomada de treino, consistência e instalação. |
| Treinos | Seleção de treino, treino guiado, carga, séries, descanso, conclusão e evolução. |
| Calculadora | Navegação interna, cálculos, resultados, avisos e reaproveitamento de dados. |
| Dieta | Registro, recentes, porções, metas, água, favoritos, lista de compras e restrições. |
| Coach | Contexto, privacidade, limites e alternativas quando a IA não está disponível. |
| Configurações | Organização, perfil, dados/backup, aparência, notificações, unidades e privacidade. |

## Registro de achados

### Início

O estado inicial é claro e conduz a pessoa para um treino pelo cartão “Primeiro passo”. A seleção entre os quatro treinos está visível, a consistência semanal não bloqueia o objetivo principal e o banner de instalação permanece discreto. O principal ponto de melhoria é tornar o resumo dos indicadores abaixo da dobra mais acionável, priorizando apenas a informação que leva ao próximo treino.

### Treinos

O atalho da página inicial abriu o Treino A sem erro. A aba reúne filtros, resumo do programa, recordes, histórico, troca/edição de exercício, peso, séries, timer, RIR/RPE e notas. Isso demonstra boa cobertura funcional, porém coloca muitos controles por exercício na mesma tela; em celular, a leitura e a decisão ficam densas antes mesmo da primeira série. As recomendações finais devem priorizar um modo de foco de treino, com apenas a série atual e os controles necessários em primeiro plano.

Durante a inspeção em tela de teste, a barra inferior permaneceu presente, mas o controle de Calculadora não ficou exposto como elemento indexado enquanto a lista longa de exercícios estava aberta. A navegação programática para a auditoria funcionou; recomenda-se revisar, em aparelho físico, a área livre e a priorização de toque da barra fixa em páginas muito extensas.

### Calculadora

A aba está bem separada em Corpo, Nutrição e Treino e oferece presets. O estado vazio do acompanhamento de peso é compreensível e a área de Nutrição apresenta os campos necessários em grupos objetivos. Como todos os campos aparecem antes do resultado, o fluxo pode pedir muitas decisões para uma pessoa iniciante. Uma etapa de “perfil salvo” que preencha peso, altura, idade e objetivo do onboarding, acompanhada de resultados progressivos, reduziria repetição e melhoraria a percepção de utilidade. Também é recomendável tornar mais explícita a diferença entre estimativas e metas pessoais, especialmente em calorias, macros e 1RM.

### Dieta

O diário contém geração de cardápio, água, duplicação do dia, favoritos, metas, base TACO, substituições, ajuste de porção, restrições, alergias e lista de compras. A cobertura é ampla, mas duas tarefas distintas — gerar cardápio e registrar o que foi consumido — dividem a mesma primeira dobra. A melhor oportunidade é permitir que o diário seja o padrão e tornar a geração de cardápio uma ação secundária, mantendo o registro diário imediatamente acessível. Os dados nutricionais de referência e os avisos sobre alergias já estão bem apresentados; faltam uma busca mais rápida de alimentos e uma visão de aderência semanal para transformar registros em acompanhamento.

### Coach

O Coach apresenta contexto selecionável, atalhos de pergunta, política de privacidade local e um limite médico explícito. Os elementos essenciais são corretos, porém a grande área vazia do histórico no primeiro uso pode gerar dúvida sobre onde começar. Sugere-se exibir duas ou três perguntas-modelo acompanhadas de uma explicação curta de que a resposta é uma orientação geral, além de diferenciar visualmente “IA pronta” de “provedor configurado” para não elevar expectativas de disponibilidade. A referência a dor e lesão deve continuar com encaminhamento a profissional, sem tentar diagnosticar.

### Configurações

A ordem atual apresenta Modo Personal antes das preferências individuais, ainda que a maior parte das pessoas use o app como aluno individual. Perfil, Aparência, Notificações e Unidades deveriam aparecer primeiro; Modo Personal, Plano e Sobre podem permanecer em um grupo secundário. A abertura de Dados e backup confirmou um fluxo claro, com volume local, versão do esquema, exportação, restauração e CSV. A mensagem de backup é adequada por estar no contexto certo, mas o aviso “Recomendado: exporte agora” poderia exibir também a data do último backup e se transformar em lembrete apenas quando estiver desatualizado, evitando urgência contínua para novos usuários.

## Análise transversal

| Aspecto | Observação | Recomendação |
|---|---|---|
| Navegação | A barra inferior está presente nas abas e o aplicativo retorna ao topo ao navegar; em listas muito longas, a quantidade de controles no fluxo principal reduz a leitura rápida. | Reforçar um modo de foco para o treino e manter as ações secundárias em uma folha expansível. |
| Toque e foco | Os controles prioritários têm tamanho ampliado e os modais usam botão de fechar. | Verificar em iPhone e Android reais a área segura inferior, o gesto de retorno e o teclado virtual em campos numéricos. |
| Estados vazios | Início, Calculadora e Coach possuem explicações iniciais, mas Coach e Progresso podem oferecer uma primeira ação mais explícita. | Inserir exemplos acionáveis e um único CTA por estado vazio. |
| Dados locais | O painel confirma armazenamento local, backup JSON e restauração com confirmação. | Registrar e mostrar a data do último backup; incluir uma opção de exportação antes de alterações potencialmente destrutivas. |
| Atualização e offline | A interface explica que atualizações são procuradas com internet e orienta o uso do aviso “Atualizar”. | Testar em aparelho físico a troca de versão com uma instalação prévia e testar uma abertura totalmente sem rede após instalar o PWA. |
| Acessibilidade | Contraste alto, foco e alvos de toque já foram reforçados nas revisões recentes. | Fazer revisão manual com fonte do sistema ampliada e leitor de tela; priorizar rótulos consistentes para ícones e mensagens de erro próximas aos campos. |

> Limite da auditoria: os fluxos foram revisados na versão publicada e em ambiente de navegação controlada. A confirmação de vibração, instalação, área segura e comportamento offline integral ainda deve ser feita em um iPhone e em um Android físicos.

## Roteiro de melhorias priorizadas

| Prioridade | Melhoria | Abas | Impacto | Esforço |
|---|---|---|---|---|
| P0 | Criar um **modo foco** no treino guiado, exibindo a série atual, peso, RIR/RPE, descanso e avanço; levar edição, troca, nota e evolução para uma área secundária. | Treinos | Alto | Médio |
| P0 | Reordenar Configurações para colocar Perfil, Aparência, Notificações, Unidades e Dados e backup antes de Modo Personal, Plano e Sobre. | Configurações | Alto | Baixo |
| P0 | Fazer o onboarding preencher, mediante consentimento, os dados repetidos da Calculadora e do gerador de cardápio. | Início, Calc, Dieta | Alto | Médio |
| P1 | Separar “registrar o que comi” de “gerar cardápio”, deixando o diário alimentar como fluxo dominante da aba Dieta. | Dieta | Alto | Médio |
| P1 | Mostrar exemplos acionáveis e estado de disponibilidade inequívoco no Coach para reduzir a tela vazia de primeiro uso. | Coach | Médio | Baixo |
| P1 | Adicionar data do último backup, lembrete baseado em tempo e exportação preventiva antes de ações de alto impacto. | Configurações | Médio | Baixo |
| P1 | Tornar os resultados de macros, 1RM e gasto mais graduais e reforçar visualmente que são estimativas. | Calc | Médio | Médio |
| P2 | Transformar os indicadores de Início em ações: próximo treino, progresso semanal e evolução mais relevante acima da dobra. | Início | Médio | Médio |
| P2 | Acrescentar busca por texto, recentes por horário e aderência semanal ao diário. | Dieta | Médio | Médio |
| P2 | Executar uma rodada manual em iPhone/Android com fonte ampliada, leitor de tela, instalação, offline e teclado virtual. | Todas | Alto | Baixo |

### Sequência recomendada

A próxima versão deveria concentrar-se no modo foco de treino, na reordenação de Configurações e no reaproveitamento consentido do perfil no cálculo e na dieta. Esse conjunto reduz fricção diária sem aumentar o número de cartões na página inicial. Depois, a melhoria de Dieta e os estados iniciais do Coach podem entrar como uma segunda etapa, seguidos pela validação integral em aparelhos físicos.

Os achados de Calculadora, Dieta, Coach e Configurações serão adicionados após os respectivos testes. As recomendações finais serão classificadas por impacto, esforço e risco para dados locais.
