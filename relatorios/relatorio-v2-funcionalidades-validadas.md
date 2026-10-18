# Relatório técnico — Funcionalidades validadas do MARSB-GYM v2

**Data do relatório:** 11 de outubro de 2026  
**Branch analisada:** `v2-rebuild`  
**Repositório:** `maubarbalho/MARBS-GYM`  
**Último commit verificado:** `7321232 docs(v2): close wave 2 parity record`  
**Commit funcional da Onda 2:** `0cac049 feat(v2): integrate diet planner with diary`  
**Estado do Git:** branch limpa e alinhada com `origin/v2-rebuild`  
**Status da `main`:** não modificada

> Este relatório diferencia funcionalidades **oficialmente validadas na matriz de paridade** de funcionalidades que possuem testes de regressão aprovados, mas ainda estão classificadas como **Parcial** ou **Pendente** para fins de equivalência completa com a v1.

---

## 1. Resumo executivo

A versão 2 do MARSB-GYM foi verificada na branch isolada `v2-rebuild`, sem alteração da versão estável em `main`.

A suíte automatizada completa foi executada em 9 de outubro de 2026:

```text
43 testes executados
43 aprovados
0 falhas
```

Além dos testes estáticos, o fluxo Playwright em viewport mobile foi executado com sucesso:

```text
v2-browser-check: ok
```

A validação mobile cobriu navegação entre telas, treino guiado, tabela compacta de séries, modais de treino, progresso, dieta, calculadora, biblioteca, menu e configurações.

### Resultado de paridade formal

| Grupo | Estado atual |
|---|---:|
| D01–D06 — Diário alimentar P0 | **Validado** |
| D14 — Copiar plano para o diário | **Validado** |
| Calculadoras C01–C06 | Validado nesta Onda 6 |
| C06 — Conversões | Validado nesta Onda 6 |
| D07–D09 — Aderência, duplicação e favoritos | Validado nesta Onda 4 |
| D10–D13 — Receitas, preferências, compras e metas | Validado nesta Onda 5 |
| P01–P03 — Progresso e configuração | Validado nesta Onda 7 |
| T01–T02 — Treino guiado e timer | Parcial na matriz; testes de regressão aprovados |

---

## 2. Arquitetura e proteção de dados

### 2.1 Estado v2 isolado

A aplicação utiliza a chave local:

```text
marsbGym_v2_preview
```

O contrato define `schemaVersion: 2` e impede que o protótipo escreva nas chaves de dados da v1.

A estrutura central contém:

- Perfil do usuário.
- Nutrição organizada por data.
- Metas de calorias e macronutrientes.
- Água consumida.
- Refeições e alimentos.
- Treinos e progresso.
- Estado de interface.
- Sessões e dados auxiliares do protótipo.

### 2.2 Migração e normalização

A camada central de estado possui:

- `loadState()`.
- `saveState(nextState)`.
- `migrateState(state)`.
- Normalização de dias nutricionais.
- Normalização de refeições e alimentos.
- Preservação de campos conhecidos e desconhecidos durante a migração.
- Persistência somente após validação estrutural.
- Migração idempotente.
- Não reinstalação de dados padrão sobre dados existentes.

### 2.3 API centralizada

O contrato expõe operações centralizadas para evitar edição direta e inconsistente do `localStorage`:

- `getNutritionDay(date)`.
- `updateNutritionDay(date, updater)`.
- `addFoodEntry(date, meal, entry)`.
- `updateFoodEntry(date, meal, entryId, patch)`.
- `removeFoodEntry(date, meal, entryId)`.
- `updateTargets(date, targets)`.
- `addWater(date, milliliters)`.
- `copyPlanToDay(date, plan, options)`.
- `cloneDay(sourceDate, targetDate)`.
- `recalculateDay(date)`.

### 2.4 Contrato de alimento

Cada alimento persistido contém identificador próprio, origem, quantidade e snapshot nutricional:

- ID estável e independente.
- Nome do alimento.
- Refeição de destino.
- Origem `TACO` ou plano gerado.
- Quantidade em gramas.
- Unidade.
- Calorias, proteínas, carboidratos e gorduras por 100 g.
- `createdAt` e `updatedAt`.

Isso permite recalcular os totais sem depender de rede ou de uma tabela externa carregada posteriormente.

---

## 3. Funcionalidades oficialmente validadas

## 3.1 Diário alimentar por data — D01

**Estado:** Validado  
**Prioridade:** P0

O diário permite selecionar uma data e carregar o estado correspondente, sem misturar registros entre dias.

Validações realizadas:

- Troca de data atualiza `nutrition.selectedDate`.
- Registros de alimentos são separados por data.
- Metas são separadas por data.
- Água é separada por data.
- A troca para um dia vazio não exibe alimentos do dia anterior.
- O retorno ao dia anterior recupera o estado salvo.

## 3.2 Registro de água — D02

**Estado:** Validado  
**Prioridade:** P0

O módulo de hidratação permite:

- Adicionar mililitros.
- Definir o total consumido diretamente.
- Zerar o consumo.
- Exibir o total no cartão de hidratação.
- Calcular o percentual em relação à meta, quando definida.
- Persistir o resultado por data.

A operação mantém os valores no estado v2 e não escreve na estrutura de dados da v1.

## 3.3 Metas de calorias, macros e água — D03

**Estado:** Validado  
**Prioridade:** P0

O usuário pode salvar por dia:

- Meta calórica.
- Proteína em gramas.
- Carboidratos em gramas.
- Gorduras em gramas.
- Água em mililitros.

Os cartões de resumo exibem:

- Consumo atual.
- Meta do dia.
- Progresso visual.
- Totais recalculados a partir dos alimentos registrados.

## 3.4 Catálogo de alimentos TACO — D04

**Estado:** Validado  
**Prioridade:** P0

O diário oferece catálogo local com alimentos baseados na tabela TACO, incluindo exemplos como:

- Frango peito cozido.
- Arroz branco cozido.
- Feijão preto cozido.
- Ovo cozido.
- Banana-prata.
- Aveia.
- Batata.
- Patinho.
- Abacate.
- Azeite.

O fluxo permite:

1. Escolher a refeição.
2. Selecionar o alimento.
3. Informar a quantidade em gramas.
4. Adicionar o item ao diário.
5. Salvar um snapshot nutricional local.

## 3.5 Edição e remoção de alimentos — D05

**Estado:** Validado  
**Prioridade:** P0

Cada item salvo pode ser:

- Editado em quantidade.
- Removido da refeição.
- Recalculado imediatamente.

A remoção utiliza IDs próprios para evitar apagar o item errado quando existem alimentos iguais em refeições diferentes.

A camada de estado também possui suporte para desfazer a última remoção, conforme o contrato v2.

## 3.6 Cartões reais de refeições — D06

**Estado:** Validado  
**Prioridade:** P0

Os cartões de refeição são alimentados pelo estado persistido, sem placeholders estáticos.

Cada cartão apresenta:

- Nome da refeição.
- Alimentos registrados.
- Quantidades.
- Calorias calculadas.
- Ações de edição e remoção.
- Estado vazio quando não há registros.

As refeições suportadas são:

- Café da manhã.
- Almoço.
- Lanche.
- Jantar.
- Pós-treino.

## 3.7 Integração do planejador com o diário — D14

**Estado:** Validado  
**Prioridade:** P0

A Onda 2 integrou o planejador de dieta ao diário existente.

O fluxo validado é:

1. Abrir a aba Calculadora.
2. Informar peso, altura e idade.
3. Selecionar sexo e atividade.
4. Selecionar hipertrofia ou déficit.
5. Selecionar o estilo do plano.
6. Gerar o cardápio de três refeições.
7. Revisar quantidades, macros e água.
8. Selecionar **Copiar este cardápio para o Diário Alimentar**.
9. Adicionar os itens ao dia selecionado.

Regras de segurança verificadas:

- A cópia é aditiva por padrão.
- Registros anteriores não são apagados.
- IDs novos são criados para os itens copiados.
- O snapshot nutricional é levado para o diário.
- Metas do plano só preenchem campos ainda vazios.
- Metas existentes não são sobrescritas.
- O plano copiado fica registrado em `state.menuPlanCopiedAt`.

No teste mobile, foram adicionados 13 itens de cardápio a um dia que já possuía um registro, preservando o registro preexistente e uma meta calórica previamente definida.

---

## 4. Funcionalidades com testes aprovados, mas ainda não promovidas a “Validado”

A aprovação de um teste de regressão não significa automaticamente equivalência funcional completa com a v1. Os itens abaixo possuem cobertura automatizada, mas continuam classificados assim na matriz.

### 4.1 Calculadoras

A interface e os fluxos abaixo possuem testes estáticos e funcionais de regressão:

- IMC.
- Calorias e macros.
- Porções de alimentos.
- Calculadora de anilhas.
- Progressão de carga.
- Conversões de unidades.
- Planejador baseado em TACO.

A matriz ainda mantém C01–C05 como **Parcial** porque a equivalência completa de fórmulas, classificações, arredondamentos e referências com a v1 ainda não foi formalmente promovida para Validado. C06 permanece **Pendente** na matriz.

### 4.2 Treino guiado e foco

Os testes aprovados cobrem:

- Abertura do treino guiado.
- Tabela de séries compacta.
- Ausência de rolagem horizontal nas séries no viewport mobile.
- Uso dos valores do último treino.
- Cancelamento do modal de cópia.
- Conclusão de exercício.
- Seleção de esforço percebido.
- Ações de pular exercício.
- Avanço para o próximo exercício pendente.
- Retorno e ações do modo foco.
- Botões de encerramento e navegação.

T01 continua como **Parcial** porque a matriz exige comprovação completa de toda a equivalência do fluxo guiado com a v1.

### 4.3 Timer e notificações

Os testes cobrem:

- Timer em segundo plano.
- Pausa e retomada.
- Encerramento do descanso.
- Notificação local ao fim do timer.
- Preservação do estado durante mudanças de tela.

T02 continua como **Parcial**, pois o comportamento nativo em todos os cenários de bloqueio de tela e suspensão do iOS depende do ambiente do sistema e não é garantido apenas pelo PWA.

---

## 5. Melhorias mobile e de usabilidade verificadas

A suíte completa inclui verificações de várias melhorias implementadas no aplicativo:

### Navegação e toque

- Navegação inferior entre Hoje, Treinos, Progresso, Dieta e Calculadora.
- Menu lateral e fechamento por backdrop.
- Ações de foco e retorno.
- Botões agrupados e acessíveis por toque.
- Fluxos sem dependência de teclado físico.
- Controle de zoom de campos no celular.

### Layout compacto

- Tabela de séries sem rolagem horizontal.
- Modo guiado mais compacto.
- Imagem de exercício reduzida.
- Header e navegação compactados.
- Conteúdo secundário em seções recolhíveis.
- Informações organizadas para telas estreitas.

### Acessibilidade e feedback

- Labels e nomes acessíveis nos controles principais.
- Modais com nomes identificáveis.
- Feedback via toast para ações importantes.
- Estado de progresso visível.
- Botões com intenção clara.
- Contraste e identidade visual verde-lima verificados.

---

## 6. Persistência, atualização e integridade do treino

Os testes de regressão também verificam que:

- O plano de treino salvo não volta indevidamente ao padrão.
- Treinos concluídos continuam visíveis quando necessário.
- O status semanal diferencia treinos feitos e pendentes.
- Pesos decimais, incluindo valores com vírgula, são aceitos.
- Exercícios concluídos sem peso podem assumir valor zero.
- O treino pode ser reiniciado sem carregar indevidamente a sessão anterior.
- O próximo exercício pendente pode ser localizado após pular um exercício.
- Filtros de equipamento e alternativas continuam disponíveis.
- Fluxos de atualização e refresh do PWA possuem cobertura estática.

Essas validações protegem principalmente a regra de não substituir dados personalizados do usuário durante atualizações.

---

## 7. Inventário dos 43 testes aprovados

### Núcleo v2, dieta e calculadoras

- `calculators-menu-v2-static-check.mjs`
- `diet-wave1-v2-check.mjs`
- `diet-wave2-v2-check.mjs`
- `state-contract-v2-check.mjs`
- `v2-prototype-check.mjs`
- `v2-syntax-check.mjs`

### Dieta, navegação recolhível e acessibilidade

- `diet-collapsible-sections-check.mjs`
- `collapsible-sections-check.mjs`
- `collapsible-ux-guidelines-check.mjs`
- `mobile-accessibility-check.mjs`
- `global-input-zoom-check.mjs`
- `global-lime-brand-check.mjs`
- `global-rebrand-all-tabs-check.mjs`

### Treino guiado e modo foco

- `guided-buttons-refinement-check.mjs`
- `guided-focus-actions-check.mjs`
- `guided-image-size-check.mjs`
- `guided-mobile-compact-check.mjs`
- `guided-next-pending-check.mjs`
- `guided-skip-check.mjs`
- `completed-workout-visibility-check.mjs`
- `equipment-filters-check.mjs`
- `session-reset-check.mjs`
- `weekly-workout-status-check.mjs`
- `zero-weight-completion-check.mjs`
- `decimal-weight-check.mjs`
- `plan-persistence-check.mjs`

### Timer, notificações e atualização

- `timer-background-check.mjs`
- `timer-notification-check.mjs`
- `ios-standalone-update-check.mjs`
- `force-refresh-active-panel-check.mjs`
- `update-flow-check.mjs`

### Check-in, sessões e recursos de treino

- `checkin-options-check.mjs`
- `recovery-tip-check.mjs`
- `sprint-1-guide-check.mjs`
- `sprint-3-4-check.mjs`
- `sprint-3-progress-comparison-check.mjs`
- `sprint-4-circuits-library-check.mjs`

### Verificações históricas de compatibilidade

- `v45-static-check.mjs`
- `collapsible-sections-check.mjs`
- `test_marsb_v2.mjs` — Playwright mobile ponta a ponta

> Todos os 43 arquivos `.mjs` da pasta `tests/` retornaram código de saída zero na execução consolidada de 9 de outubro de 2026.

---

## 8. Evidências e artefatos técnicos

### Branch e commits

- Branch isolada: `v2-rebuild`.
- Último commit: `7321232`.
- Integração do planejador: `0cac049`.
- Implementação da Onda 1: `6c8d90f`.
- Fundação do estado: `40ac197`.
- Matriz e contrato iniciais: `8978e92`.

### Backups

- Backup anterior à Onda 2:
  - Tag: `backup-before-wave-2-20261007T090001Z`.
  - Arquivo: `/home/ubuntu/MARBS-GYM-wave2-before-20261007T090001Z.tar.gz`.

### Comando de execução da suíte

```bash
cd /home/ubuntu/MARBS-GYM-git
for test in tests/*.mjs; do
  node "$test"
done
```

O teste Playwright requer:

- Playwright instalado em `/home/ubuntu/node_modules`.
- Chromium gerenciado pelo Playwright instalado.
- Servidor local servido em `http://127.0.0.1:4173/v2/`.

---

## 9. Itens ainda não validados formalmente

Os seguintes itens permanecem fora do grupo de funcionalidades oficialmente validadas:

| ID | Funcionalidade | Estado |
|---|---|---|
| D07 | Aderência de 7 dias | Validado na Onda 4 |
| D08 | Duplicar dia | Validado na Onda 4 |
| D09 | Favoritos | Validado na Onda 4 |
| D10 | Receitas salvas | Validado na Onda 5 |
| D11 | Restrições e alergias | Validado na Onda 5 |
| D12 | Lista de compras | Validado na Onda 5 |
| D13 | Explicação de metas | Validado na Onda 5 |
| C01–C05 | Calculadoras com equivalência formal completa | Parcial |
| C06 | Conversões | Pendente |
| P01 | Histórico de treinos real | Pendente |
| P02 | Evolução e volume com sessões reais | Pendente |
| P03 | Preferências e edição segura completas | Pendente |
| T01 | Equivalência completa do treino guiado | Parcial |
| T02 | Garantia nativa de timer em bloqueio/suspensão | Parcial |

Esses itens devem permanecer na matriz com o estado atual até que tenham implementação, teste específico, validação mobile e comparação funcional formal com a v1.

---

## 10. Conclusão

A v2 possui uma base funcional sólida e verificável, com o núcleo de nutrição P0 validado:

- Diário alimentar por data.
- Água.
- Metas nutricionais.
- Catálogo TACO.
- CRUD de alimentos.
- Cartões reais de refeições.
- Integração aditiva do planejador com o diário.

A arquitetura de persistência está isolada da v1 e protegida por contrato de estado versionado. A suíte completa de 43 testes aprovados reduz o risco de regressões nas funcionalidades já implementadas, especialmente nos fluxos mobile e de treino.

A v2, entretanto, **não deve ser considerada funcionalmente equivalente a 100% da v1 ainda**, porque a própria matriz mantém itens Pendente e Parcial. O próximo trabalho deve seguir a ordem da matriz, priorizando os itens P0/P1 ainda não validados, sem alterar a `main` e mantendo o processo Backup → Implementar → Testar → Atualizar matriz → Commit → Push.

## Onda 6 — Paridade formal das calculadoras

C01–C06 foram centralizados na API `MARSB_V2_CALCULATORS`, com fórmulas e arredondamentos equivalentes à v1. A validação mobile confirmou IMC, TMB/TDEE, objetivos, macros, água, porções TACO incluindo whey, pesos fracionados e alternativas de anilhas, progressão e conversões de unidades.

Os testes específicos passaram e a suíte completa de fechamento do bloco das Ondas 4–6 passou com **51/51 testes**. O servidor local foi iniciado explicitamente na porta esperada pelos testes de navegador; não houve falha funcional da aplicação.

## Onda 7 — Progresso e configurações

P01–P03 foram implementados com dados reais. O histórico combina sessões concluídas da v2 e registros importados da v1 sem modificar a origem. Filtros por período e exercício alimentam os agregados de sessões, volume total, média semanal, evolução por exercício e melhor carga. A tela vazia não exibe números ou gráficos fictícios.

As preferências de aparência, unidades e notificações são persistidas em `marsbGym_v2_preview` e a validação mobile confirmou que salvá-las não altera sessões, treinos importados ou plano. Os testes específicos da Onda 7 passaram; a suíte completa permanece programada para após a Onda 9.
