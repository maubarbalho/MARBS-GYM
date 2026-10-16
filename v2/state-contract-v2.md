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
