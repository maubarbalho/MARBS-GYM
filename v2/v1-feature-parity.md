# Matriz de paridade funcional v1 → v2

**Branch:** `v2-rebuild`  
**Onda:** 2 — Integração do planejador (D14)
**Regra:** uma função só pode ser marcada como concluída quando possuir implementação real, persistência adequada, teste e validação mobile.

**Nota de execução (2026-09-06):** o arquivo `/home/ubuntu/plano-acao-tecnico-v1-para-v2.md` não estava disponível no ambiente nem foi encontrado no histórico Git. Para não interromper a execução, a priorização desta rodada foi derivada da primeira sequência P0 ainda pendente nesta matriz: D01–D06. Os itens posteriores permanecem sem alteração.

| ID | Área | Função | Prioridade | Estado atual | Critério de aceite |
|---|---|---|---|---|---|
| D01 | Dieta | Diário por data | P0 | Validado | Trocar a data carrega registros, metas e água corretos |
| D02 | Dieta | Registrar água em ml | P0 | Validado | Adicionar, editar e remover ml atualiza consumo e percentual |
| D03 | Dieta | Metas de kcal, macros e água | P0 | Validado | Salvar metas altera cartões e cálculos do dia |
| D04 | Dieta | Adicionar alimento da TACO | P0 | Validado | Buscar, selecionar, informar gramas e salvar na refeição |
| D05 | Dieta | Editar e remover alimento | P0 | Validado | Totais são recalculados imediatamente |
| D06 | Dieta | Cartões reais de refeições | P0 | Validado | Cartões refletem o estado persistido, sem placeholders |
| D07 | Dieta | Aderência de 7 dias | P1 | Validado | Indicador usa registros reais da semana |
| D08 | Dieta | Duplicar dia | P1 | Validado | Cria cópia independente sem apagar a origem |
| D09 | Dieta | Favoritos | P1 | Validado | Salvar, listar, aplicar e remover favorito |
| D10 | Dieta | Receitas salvas | P1 | Validado | Criar, listar, usar e salvar receita |
| D11 | Dieta | Restrições e alergias | P1 | Validado | Preferências persistem e são exibidas no fluxo correto |
| D12 | Dieta | Lista de compras do diário | P1 | Validado | Agrupa alimentos reais por nome, preparo e quantidade |
| D13 | Dieta | Explicação de metas | P1 | Validado | Fórmulas e referências em bloco expansível |
| D14 | Dieta | Copiar plano para diário | P0 | Validado | Acrescenta itens e nunca substitui registros existentes |
| C01 | Calculadora | IMC | P1 | Validado | Fórmula e classificação iguais à v1 |
| C02 | Calculadora | Calorias e macros | P0 | Validado | TMB, TDEE, objetivos, macros e água equivalentes |
| C03 | Calculadora | Porções | P1 | Validado | Campos e referências iguais à v1 |
| C04 | Calculadora | Anilhas | P1 | Validado | Combinações, pesos fracionados e alternativas equivalentes |
| C05 | Calculadora | Progressão de carga | P1 | Validado | Arredondamento e microplaca equivalentes |
| C06 | Calculadora | Conversões | P2 | Validado | kg/lb e cm/in equivalentes |
| P01 | Progresso | Histórico de treinos | P1 | Pendente | Filtros e registros correspondem à v1 |
| P02 | Progresso | Evolução e volume | P1 | Pendente | Agregações usam sessões reais |
| P03 | Configuração | Preferências e edição segura | P1 | Pendente | Atualização não substitui treinos salvos |
| T01 | Treinos | Treino guiado e foco | P0 | Parcial | Pular, voltar, encerrar e completar preservados |
| T02 | Treinos | Timer em segundo plano | P0 | Parcial | Timer não pausa ao sair ou bloquear a tela |

## Estados permitidos

- **Pendente:** ainda não portado ou não auditado.
- **Parcial:** existe na v2, mas ainda não tem equivalência comprovada ou possui limitações.
- **Validado:** implementação, persistência, teste e validação mobile concluídos.
- **Bloqueado:** depende de decisão, recurso externo ou correção anterior.

## Regra de atualização

Cada alteração deve atualizar o estado, o commit e o teste associado. A `main` não participa das alterações da v2 durante o protótipo.

## Registro da onda executada

| Onda | Estado | Escopo entregue | Testes estáticos | Validação mobile | Backup | Commit |
|---|---|---|---|---|---|---|
| 0 — Fundação e contrato de paridade | Implementada | Camada centralizada `MARSB_V2_STATE` sobre `marsbGym_v2_preview`, migração idempotente, schema v2, operações de dieta, cópia aditiva, IDs independentes e desfazer de remoção; nenhum item de paridade foi marcado como `Validado` sem equivalência visual e funcional completa. | `state-contract-v2-check`, `v2-syntax-check`, `v2-prototype-check`, `diet-collapsible-sections-check`, `mobile-accessibility-check`, `mobile-fluidity-stage1/2/3/4-check`: aprovados. `calculators-menu-v2-static-check`: falha preexistente por exigir `generateMenuBtn`/`copyMenuBtn`, ausentes também no `HEAD` anterior. | Página v2 carregada em viewport móvel; navegação e tela Dieta verificadas; API de estado exercitada no navegador com `schemaVersion: 2`, `250 ml` persistidos e nenhuma escrita em `marsbGym_v2`. | `backup-before-wave-0-20260905T171001Z` (branch/tag local e arquivo compactado) | `40ac197` |
| 1 — Dieta P0 (D01–D06) | Implementada | Diário por data; metas de kcal, macros e água; catálogo TACO com snapshot nutricional; adição, edição e remoção de alimentos; cartões de refeições calculados a partir do estado; água com adicionar, editar total e zerar; tudo persistido em `marsbGym_v2_preview`, sem escrita em `marsbGym`. | `diet-wave1-v2-check`, `v2-syntax-check`, `state-contract-v2-check`, `v2-prototype-check`, `mobile-accessibility-check`, `mobile-fluidity-stage1/2/3/4-check`: aprovados. | Teste de navegador em viewport móvel com troca de data, metas, alimento TACO, edição/remoção de alimento, adição/edição/remoção de água, recálculo e verificação de ausência da chave `marsbGym`. | `backup-before-wave-1-20260906T171012Z` (branch/tag local e `/home/ubuntu/MARBS-GYM-wave1-before-20260906T171012Z.tar.gz`) | `e36e491` |
| 2 — Integração do planejador (D14) | Implementada | Interface funcional do planejador na Calculadora; plano gerado com snapshot TACO; cópia aditiva para o dia selecionado; metas do plano preenchidas somente quando ausentes; registros existentes preservados. | `diet-wave1-v2-check`, `diet-wave2-v2-check`, checagem de sintaxe e teste mobile: aprovados. | Cardápio gerado no navegador e copiado ao diário; 13 itens adicionados, registro pré-existente preservado e meta kcal existente mantida. | `backup-before-wave-2-20261007T090001Z` (tag local e `/home/ubuntu/MARBS-GYM-wave2-before-20261007T090001Z.tar.gz`) | `0cac049` |
| 3 — Importador seguro da v1 | Implementada | Leitura somente da chave legada `marsbGym_v2`/`marsbGym_v1`; prévia com contagens; mapeamento de perfil, dieta, treinos, histórico, pesos, favoritos, receitas e agenda; backup v2 por migração; confirmação explícita; rollback. | `wave3-migration-static-check`, `wave3-migration-browser-check`, `v2-prototype-check`, `state-contract-v2-check`, sintaxe e suíte completa: aprovados. | Teste mobile controlado importou 1 alimento, 1 treino concluído, plano personalizado, perfil e agenda; confirmou que a origem não mudou; rollback restaurou o estado anterior. | `backup-before-wave-3-20261011T193500Z` e `/home/ubuntu/MARBS-GYM-wave3-before-20261011T193500Z.tar.gz` | `a30a738` |
| 4 — Dieta avançada (D07–D09) | Implementada | Aderência real de 7 dias; duplicação por data com confirmação e modo adicionar/substituir; favoritos de combinações do diário com aplicação e remoção offline; novos IDs e preservação da origem. | `diet-wave4-v2-check`, `diet-wave4-v2-browser-check`, regressões D01–D06/D14, `state-contract-v2-check`, `v2-syntax-check`, `v2-prototype-check` e `mobile-accessibility-check`: aprovados. | Teste mobile controlado confirmou 3/7 dias registrados, duplicação independente com IDs diferentes, aplicação e remoção de favorito persistido. Suíte completa fica para o fechamento do bloco 4–6. | `backup-before-wave-4-20261015T140800-0300` e `/home/ubuntu/MARBS-GYM-wave4-before-20261015T140800-0300.tar.gz` | `8d06bf987acf686b5b5131d39eb14c2b76836674` |
| 5 — Dieta avançada (D10–D13) | Implementada | Receitas salvas com ingredientes e aplicação por refeição; restrições e alergias persistentes com alertas sem alteração automática do histórico; lista de compras agrupada por alimento real com cópia; explicação recolhível das metas, TMB, TDEE, déficit e superávit. | `diet-wave5-v2-check`, `diet-wave5-v2-browser-check`, regressões D01–D09, `state-contract-v2-check`, `v2-syntax-check`, `v2-prototype-check` e `mobile-accessibility-check`: aprovados. | Teste mobile controlado criou e aplicou uma receita, consolidou 250 g de frango na lista, persistiu preferências e confirmou remoção da receita. Suíte completa fica para o fechamento do bloco 4–6. | `backup-before-wave-5-20261016T140800-0300` e `/home/ubuntu/MARBS-GYM-wave5-before-20261016T140800-0300.tar.gz` | `0bf71eb086d3e6a113b920671f09ef08576a678a` |
| 6 — Paridade formal das calculadoras (C01–C06) | Implementada | Camada central de cálculo equivalente à v1 para IMC, TMB/TDEE/macros/água, porções TACO com whey, anilhas com pesos fracionados e alternativas, progressão e conversões kg/lb/cm/polegadas. | `calculators-wave6-v2-check`, `calculators-wave6-v2-browser-check`, `calculators-menu-v2-static-check`, regressões D01–D14, contrato, sintaxe, protótipo e acessibilidade: aprovados. Suíte completa do bloco 4–6: **51/51 aprovados**. | Teste mobile controlado confirmou IMC 25,6, macros para 80 kg, três opções de proteína incluindo whey, anilhas para 100 kg/20 kg e quatro conversões com arredondamento equivalente. | `backup-before-wave-6-20261017T140800-0300` e `/home/ubuntu/MARBS-GYM-wave6-before-20261017T140800-0300.tar.gz` | `720ef66533158531bd96cf1acd0aad4a677a39ca` |
