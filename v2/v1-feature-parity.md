# Matriz de paridade funcional v1 → v2

**Branch:** `v2-rebuild`  
**Onda:** 0 — Fundação e contrato de paridade  
**Regra:** uma função só pode ser marcada como concluída quando possuir implementação real, persistência adequada, teste e validação mobile.

| ID | Área | Função | Prioridade | Estado inicial | Critério de aceite |
|---|---|---|---|---|---|
| D01 | Dieta | Diário por data | P0 | Pendente | Trocar a data carrega registros, metas e água corretos |
| D02 | Dieta | Registrar água em ml | P0 | Pendente | Adicionar, editar e remover ml atualiza consumo e percentual |
| D03 | Dieta | Metas de kcal, macros e água | P0 | Pendente | Salvar metas altera cartões e cálculos do dia |
| D04 | Dieta | Adicionar alimento da TACO | P0 | Pendente | Buscar, selecionar, informar gramas e salvar na refeição |
| D05 | Dieta | Editar e remover alimento | P0 | Pendente | Totais são recalculados imediatamente |
| D06 | Dieta | Cartões reais de refeições | P0 | Pendente | Cartões refletem o estado persistido, sem placeholders |
| D07 | Dieta | Aderência de 7 dias | P1 | Pendente | Indicador usa registros reais da semana |
| D08 | Dieta | Duplicar dia | P1 | Pendente | Cria cópia independente sem apagar a origem |
| D09 | Dieta | Favoritos | P1 | Pendente | Salvar, listar, aplicar e remover favorito |
| D10 | Dieta | Receitas salvas | P1 | Pendente | Criar, listar, usar e salvar receita |
| D11 | Dieta | Restrições e alergias | P1 | Pendente | Preferências persistem e são exibidas no fluxo correto |
| D12 | Dieta | Lista de compras do diário | P1 | Pendente | Agrupa alimentos reais por nome, preparo e quantidade |
| D13 | Dieta | Explicação de metas | P1 | Pendente | Fórmulas e referências em bloco expansível |
| D14 | Dieta | Copiar plano para diário | P0 | Parcial | Acrescenta itens e nunca substitui registros existentes |
| C01 | Calculadora | IMC | P1 | Parcial | Fórmula e classificação iguais à v1 |
| C02 | Calculadora | Calorias e macros | P0 | Parcial | TMB, TDEE, objetivos, macros e água equivalentes |
| C03 | Calculadora | Porções | P1 | Parcial | Campos e referências iguais à v1 |
| C04 | Calculadora | Anilhas | P1 | Parcial | Combinações, pesos fracionados e alternativas equivalentes |
| C05 | Calculadora | Progressão de carga | P1 | Parcial | Arredondamento e microplaca equivalentes |
| C06 | Calculadora | Conversões | P2 | Pendente | kg/lb e cm/in equivalentes |
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
