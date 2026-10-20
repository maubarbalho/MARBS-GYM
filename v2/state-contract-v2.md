# Contrato de estado da v2

**Chave de armazenamento:** `marsbGym_v2_preview`  
**Versão inicial do esquema:** `2`  
**Compatibilidade:** nunca escrever nas chaves da v1 durante o protótipo.

## Estrutura-base

```js
{
  schemaVersion: 2,
  profile: {
    name: "",
    sex: "M",
    weightKg: null,
    heightCm: null,
    age: null,
    activity: "moderado",
    preferences: {
      restrictions: "",
      allergies: ""
    }
  },
  nutrition: {
    selectedDate: "YYYY-MM-DD",
    days: {
      "YYYY-MM-DD": {
        waterMl: 0,
        targets: {
          kcal: null,
          protein: null,
          carbs: null,
          fats: null,
          waterMl: null
        },
        meals: {
          cafe: [],
          almoco: [],
          lanche: [],
          jantar: [],
          posTreino: []
        }
      }
    },
    favorites: [],
    recipes: []
  },
  workouts: {},
  progress: {},
  ui: {
    activeTab: "today",
    expandedSections: {}
  }
}
```

## Contrato de alimento

Cada item salvo em uma refeição deve conter um identificador estável, origem, quantidade e snapshot nutricional suficiente para recalcular o dia sem depender de rede:

```js
{
  id: "food-entry-uuid",
  foodId: "taco-frango-peito-cozido",
  name: "Frango peito cozido",
  source: "TACO",
  meal: "almoco",
  grams: 150,
  unit: "g",
  nutritionPer100g: {
    kcal: 163,
    protein: 31.5,
    carbs: 0,
    fats: 3.2
  },
  createdAt: "ISO-8601",
  updatedAt: "ISO-8601"
}
```

## Operações obrigatórias

A camada de estado deve expor funções centralizadas, sem edição direta de objetos do armazenamento pelos componentes:

```js
loadState()
saveState(nextState)
migrateState(state)
getNutritionDay(date)
updateNutritionDay(date, updater)
saveDietRecipe(name, date)
applyDietRecipe(recipeId, date, meal)
removeDietRecipe(recipeId)
saveDietPreferences(restrictions, allergies)
getDietShopping(date)
addFoodEntry(date, meal, entry)
updateFoodEntry(date, meal, entryId, patch)
removeFoodEntry(date, meal, entryId)
updateTargets(date, targets)
addWater(date, milliliters)
copyPlanToDay(date, plan, options)
cloneDay(sourceDate, targetDate)
recalculateDay(date)
readLegacyStorage()
countLegacyState(state)
buildLegacyImportPreview(legacyRecord)
confirmLegacyImport(preview)
rollbackLastLegacyImport()
```

## Regras de segurança

A operação de copiar um cardápio deve ser aditiva por padrão. Duplicar um dia deve criar novos identificadores para os alimentos. Receitas devem guardar snapshots dos ingredientes e aplicar novos identificadores ao diário. Restrições e alergias são preferências persistentes e apenas alertam, sem alterar registros antigos automaticamente. A lista de compras deve agrupar apenas alimentos reais do diário. A remoção deve permitir desfazer. Uma migração deve preservar campos desconhecidos e somente salvar depois da validação estrutural. Nenhuma atualização de aplicativo pode reinstalar dados padrão sobre um estado existente.

## Migrações

Cada mudança estrutural deve aumentar `schemaVersion`. A migração deve ser determinística, idempotente e testável. Durante o protótipo, a importação entre v1 e v2 ocorre somente por ação explícita do usuário; a origem é lida em modo somente leitura, a prévia informa contagens, a v2 recebe backup antes da escrita e existe rollback por migração.

## Calculadoras v2

As calculadoras usam funções determinísticas equivalentes às fórmulas da v1 e não escrevem nas chaves de produção. A API `MARSB_V2_CALCULATORS` cobre IMC, macros, porções TACO, anilhas, progressão e conversões; entradas são normalizadas para ponto decimal e resultados são arredondados apenas na apresentação ou conforme a referência v1.

## Progresso e preferências v2

As sessões concluídas da v2 são armazenadas em `sessions` com data, status, exercício, séries e volume. Registros importados da v1 permanecem em `progress.completedWorkouts` e são tratados como somente leitura para os agregados de histórico, sem alterar a origem. A tela de Progresso filtra por período e exercício e calcula sessões, volume total, média semanal, evolução e melhor carga a partir desses registros reais; estado vazio é tratado sem gráficos ou números fictícios.

As preferências da interface são persistidas em `settings` (`appearance`, `units`, `notifications`), com alteração aditiva e sem reinstalar plano, sessões ou histórico.

## Treino guiado e timer v2

A sessão guiada mantém `guided.active`, índice atual, exercícios concluídos e exercícios pulados dentro do estado v2. Pular não apaga o exercício; `returnSkippedExercise` permite retomá-lo posteriormente. A sessão só é encerrada após a avaliação final de esforço, energia, desconforto e observações, e então é adicionada a `sessions` sem recarregar uma sessão concluída como nova.

O timer usa `timer.deadlineAt` como prazo absoluto, `pausedRemaining` para pausa explícita e `running` para distinguir execução de pausa. O estado é persistido antes de sair, restaurado em `pageshow`, `visibilitychange` e `focus`, e recalculado pelo relógio do sistema ao retornar. Notificações locais dependem de permissão do navegador/service worker; no iOS/PWA há limitações de entrega em tela bloqueada e suspensão que exigem validação manual no dispositivo real.

## Ensaio de migração e auditoria v2

O ensaio da Onda 9 usa uma cópia anonimizada da v1 e valida a sequência prévia → importação → comparação → uso mobile → offline → atualização simulada → rollback. A origem `marsbGym_v2` permanece byte a byte inalterada; o destino usa exclusivamente `marsbGym_v2_preview`. A atualização simulada por reload/query string preserva o estado migrado e o rollback restaura o estado anterior da v2.

A suíte completa do bloco 7–9 foi executada com 56 testes aprovados e nenhuma falha. O teste de navegador legado foi alinhado ao fluxo guiado atual: a avaliação final aparece após a conclusão dos exercícios pendentes, não após o primeiro exercício isolado.
