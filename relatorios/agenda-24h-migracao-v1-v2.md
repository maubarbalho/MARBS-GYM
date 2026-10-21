# Agenda de 24 horas — Migração restante da v1 para a v2

**Projeto:** MARSB-GYM 2.0  
**Branch:** `v2-rebuild`  
**Branch protegida:** `main` — não modificar durante a execução  
**Ponto de partida:** Onda 2 concluída, commit `693878e`  
**Formato:** agenda relativa a `T+0`  
**Cadência:** ondas sequenciais com validação obrigatória entre blocos  
**Escopo:** restante do backlog de paridade e preparação da migração segura de dados

> Esta é uma agenda de execução de 24 horas, não uma garantia de que todo o backlog estará pronto para lançamento nesse período. Se uma onda falhar em persistência, paridade ou segurança de dados, a agenda deve parar nesse portão e preservar o backup anterior.

---

## Resultado esperado ao fim das 24 horas

Ao final do ciclo, o objetivo é ter:

- As próximas funcionalidades prioritárias implementadas ou claramente classificadas.
- O importador seguro da v1 prototipado com prévia e backup.
- Testes específicos para cada onda executada.
- Matriz de paridade atualizada.
- Branch `v2-rebuild` limpa e publicada.
- Relatório de pendências remanescentes.
- Nenhuma alteração na `main`.
- Nenhum dado de produção da v1 sobrescrito.

A promoção de uma funcionalidade para **Validado** só ocorre quando houver implementação, persistência, teste e validação mobile.

---

# Cronograma de 24 horas

| Horário relativo | Onda | Atividade principal | Resultado mínimo |
|---|---|---|---|
| T+00:00–00:45 | Preparação | Backup, auditoria e congelamento da base | Tag e backup verificados |
| T+00:45–04:00 | Onda 3A | Importador seguro: leitura, mapeamento e prévia | Prévia sem escrita na v1 |
| T+04:00–06:30 | Onda 3B | Importação controlada e rollback | Importação v2 reversível |
| T+06:30–07:00 | Portão 1 | Testes da migração | Aprovar ou interromper |
| T+07:00–09:30 | Onda 4 | D07–D09: aderência, duplicar dia e favoritos | Recursos persistidos e testados |
| T+09:30–10:00 | Portão 2 | Teste mobile da dieta | Aprovar ou reverter |
| T+10:00–13:00 | Onda 5 | D10–D13: receitas, restrições, compras e metas | Fluxos avançados funcionais |
| T+13:00–13:30 | Portão 3 | Testes de dieta e contrato | Matriz atualizada |
| T+13:30–16:00 | Onda 6 | Paridade formal das calculadoras | Comparação v1/v2 documentada |
| T+16:00–16:30 | Portão 4 | Testes numéricos e mobile | Divergências classificadas |
| T+16:30–19:00 | Onda 7 | Progresso e configurações | Dados reais e preferências persistentes |
| T+19:00–19:30 | Portão 5 | Teste de atualização e persistência | Plano salvo preservado |
| T+19:30–21:30 | Onda 8 | Treino guiado e timer | Paridade restante auditada |
| T+21:30–22:00 | Portão 6 | Teste Playwright e regressão geral | Suíte sem regressões |
| T+22:00–23:15 | Onda 9 | Ensaio completo da migração | Relatório antes/depois |
| T+23:15–24:00 | Onda 10 | Matriz, relatório e decisão de lançamento | Branch e documentação fechadas |

---

## T+00:00–00:45 — Preparação e backup

### Ações

1. Confirmar branch `v2-rebuild`.
2. Confirmar que `main` não será tocada.
3. Executar `git status`.
4. Criar tag de backup da base.
5. Criar arquivo compactado do repositório.
6. Exportar uma cópia de teste dos dados v1, sem dados reais de produção.
7. Registrar commit inicial do ciclo.
8. Confirmar que os 43 testes da base continuam aprovados.

### Portão

Não iniciar a Onda 3 sem:

- Backup legível.
- Tag local.
- Branch limpa.
- Suíte da base aprovada.

---

# T+00:45–06:30 — Onda 3: importador seguro da v1

A migração de dados é o ponto mais sensível e deve ocorrer antes dos recursos secundários.

## T+00:45–04:00 — Leitura, mapeamento e prévia

### Implementar

- Leitor somente leitura da estrutura v1.
- Exportação JSON.
- Mapeamento de treino, dieta, peso, histórico e preferências.
- Conversão para `schemaVersion: 2`.
- Relatório de registros encontrados.
- Relatório de campos sem correspondência.
- Prévia antes da confirmação.
- Detecção de dados já importados.
- IDs novos para os registros convertidos.

### Critérios de aceite

- Nenhuma chave v1 é alterada.
- O usuário consegue cancelar antes da importação.
- A prévia informa o número de registros por categoria.
- O plano personalizado aparece na prévia.
- Campos incompatíveis não são descartados silenciosamente.
- A conversão é determinística e idempotente.

## T+04:00–06:30 — Importação controlada e rollback

### Implementar

- Importação para `marsbGym_v2_preview`.
- Confirmação explícita.
- Registro de `migrationId`, data e origem.
- Backup v2 antes da escrita.
- Operação de rollback.
- Relatório pós-importação.

### Critérios de aceite

- A v1 permanece intacta.
- O plano de treino salvo é preservado.
- Os registros importados aparecem na v2.
- Uma segunda execução não duplica silenciosamente.
- O rollback restaura o estado anterior da v2.

---

## T+06:30–07:00 — Portão 1: testes da migração

Executar:

- Importação com v1 vazia.
- Importação com dados completos.
- Importação com campos ausentes.
- Importação repetida.
- Cancelamento antes da confirmação.
- Rollback.
- Verificação de nenhuma escrita na v1.
- Verificação de preservação de treinos e dieta.

**Falha crítica:** qualquer perda de dados, duplicação silenciosa ou escrita na v1 interrompe o ciclo e exige restauração do backup.

---

# T+07:00–10:00 — Onda 4: dieta avançada D07–D09

## D07 — Aderência de 7 dias

- Calcular aderência usando registros reais.
- Diferenciar dias preenchidos e vazios.
- Respeitar semana e data selecionadas.
- Não usar valores estáticos.

## D08 — Duplicar dia

- Copiar refeições e metas para outra data.
- Gerar novos IDs.
- Preservar a origem.
- Exigir escolha explícita entre adicionar e substituir.

## D09 — Favoritos

- Salvar alimento ou combinação.
- Listar favoritos.
- Aplicar favorito à refeição.
- Remover favorito.
- Persistir sem depender de rede.

## T+09:30–10:00 — Portão 2

Validar:

- Datas diferentes.
- Duplicação repetida.
- Favoritos aplicados e removidos.
- Totais nutricionais recalculados.
- Interface em viewport mobile.

---

# T+10:00–13:30 — Onda 5: dieta avançada D10–D13

## D10 — Receitas salvas

- Criar, editar, listar, aplicar e excluir receitas.
- Calcular macros por porção.
- Persistir ingredientes e rendimento.

## D11 — Restrições e alergias

- Persistir preferências.
- Exibir alertas no planejador.
- Evitar recomendar alimento incompatível quando houver alternativa.
- Não alterar registros históricos sem confirmação.

## D12 — Lista de compras

- Agrupar alimentos reais.
- Consolidar quantidades.
- Diferenciar preparo quando necessário.
- Permitir exportar ou copiar a lista.

## D13 — Explicação de metas

- Explicar TMB, TDEE, déficit e superávit.
- Exibir referências e limitações.
- Manter o bloco recolhível no mobile.

## T+13:00–13:30 — Portão 3

Executar testes de:

- Criação e edição.
- Persistência após recarregar.
- Aplicação ao diário.
- Compatibilidade com o planejador da Onda 2.
- Acessibilidade e toque.
- Regressão dos testes D01–D06 e D14.

---

# T+13:30–16:30 — Onda 6: paridade formal das calculadoras

Comparar v1 e v2 com a mesma tabela de entradas.

## Verificar

- IMC: fórmula, classificação e arredondamento.
- Calorias e macros: TMB, TDEE, atividade e objetivos.
- Porções: alimentos, quantidades e macros TACO.
- Anilhas: barra, total, lado e pesos fracionados.
- Progressão: percentuais, arredondamentos e microplacas.
- Conversões: kg/lb e cm/polegadas.

## Critérios de aceite

- Entradas equivalentes produzem resultados equivalentes ou diferença documentada.
- Valores decimais usam o formato brasileiro sem alterar o cálculo.
- Casos vazios e inválidos exibem mensagem segura.
- O planejador continua copiando para o diário.
- A interface continua utilizável no mobile.

## T+16:00–16:30 — Portão 4

Atualizar a matriz somente após:

- Testes numéricos aprovados.
- Comparação com a v1 registrada.
- Teste mobile concluído.
- Divergências classificadas como corrigidas, justificadas ou pendentes.

---

# T+16:30–19:30 — Onda 7: progresso e configurações

## P01 — Histórico

- Usar sessões reais.
- Filtrar por período e exercício.
- Exibir cargas, repetições e conclusão.
- Preservar registros importados.

## P02 — Evolução e volume

- Volume por sessão e semana.
- Evolução por exercício.
- Comparação entre períodos.
- Tratamento de dias sem dados.

## P03 — Configurações

- Preferências persistentes.
- Unidades.
- Notificações.
- Aparência.
- Restrições e alergias.
- Edição sem reinstalar o plano padrão.

## T+19:00–19:30 — Portão 5

- Atualizar o PWA ou recarregar a página.
- Confirmar que o plano personalizado permanece.
- Confirmar que os dados importados permanecem.
- Confirmar que as preferências não retornam ao padrão.
- Executar o teste de persistência.

---

# T+19:30–22:00 — Onda 8: treino guiado e timer

## T01 — Treino guiado

- Pular exercício.
- Voltar ao exercício pulado.
- Avançar ao próximo pendente.
- Concluir exercício.
- Encerrar treino.
- Registrar esforço, energia, desconforto e observações.
- Preservar estado ao sair e voltar.
- Evitar carregar sessão concluída como nova.

## T02 — Timer

- Continuar ao trocar de tela.
- Continuar ao sair do app, dentro das limitações do PWA.
- Emitir notificação ao terminar.
- Recuperar o estado após suspensão.
- Não criar intervalos duplicados.

## T+21:30–22:00 — Portão 6

Executar:

- Teste Playwright mobile.
- Testes de timer.
- Testes de sessão.
- Teste de pesos decimais.
- Teste de conclusão sem peso.
- Teste de navegação e retorno.

---

# T+22:00–23:15 — Onda 9: ensaio completo da migração

Executar uma migração com uma cópia anonimizada da v1:

1. Backup da origem.
2. Exportação.
3. Prévia.
4. Confirmação.
5. Importação.
6. Comparação de contagens.
7. Verificação do treino salvo.
8. Verificação da dieta.
9. Verificação do histórico.
10. Verificação das preferências.
11. Teste offline.
12. Recarregamento do PWA.
13. Teste de rollback.

### Relatório obrigatório

- Quantidade de registros na origem.
- Quantidade de registros importados.
- Quantidade de registros ignorados.
- Conflitos encontrados.
- Diferenças justificadas.
- Resultado do rollback.
- Screenshots ou logs do fluxo mobile.

---

# T+23:15–24:00 — Onda 10: fechamento e decisão

## Ações

- [x] Executar todos os testes `.mjs` — 58/58 aprovados.
- [x] Confirmar Playwright aprovado.
- [x] Verificar `git diff` e `git status`.
- [x] Atualizar a matriz de paridade.
- [x] Atualizar o relatório v1 × v2.
- [x] Registrar commits separados por onda.
- [x] Criar backup final da base v2 antes do fechamento.
- [x] Criar tag da base v2.
- [x] Publicar apenas em `v2-rebuild`.
- [x] Registrar pendências que não puderam ser validadas.

## Resultado da Onda 10

A validação técnica foi concluída com 58/58 testes aprovados e comparação mobile v1 × v2. O lançamento permanece bloqueado até teste manual em iPhone, teste Android e aprovação explícita para publicação.

## Portão de lançamento

Não publicar para usuários reais se qualquer item abaixo ocorrer:

- Falha de importação.
- Perda ou duplicação de dados.
- Plano personalizado substituído.
- Chave da v1 alterada.
- Teste crítico quebrado.
- Divergência de fórmula não documentada.
- Timer ou sessão perdida.
- Matriz marcada como Validado sem evidência.

---

## Regras para interrupção e retomada

Se uma onda falhar:

1. Parar a onda atual.
2. Preservar logs e saída dos testes.
3. Restaurar o último backup se houver risco de dados.
4. Registrar a falha na matriz.
5. Corrigir somente na branch `v2-rebuild`.
6. Reexecutar os testes da onda.
7. Reexecutar a suíte completa antes de seguir.

O tempo de 24 horas não deve ser usado para ultrapassar um portão de segurança. Uma onda incompleta deve permanecer classificada como **Parcial** ou **Pendente**.

---

## Próxima ação

O ciclo deve começar pela **Onda 3**, com backup e leitura somente da v1. A primeira entrega concreta deve ser a prévia de importação, não a escrita automática de dados.
