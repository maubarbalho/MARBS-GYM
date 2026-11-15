# MARSB-GYM 2.0 — protótipo funcional

Esta pasta contém a fonte de desenvolvimento da versão 2.0 do MARSB-GYM, mantida na branch `v2-rebuild`. A versão validada é promovida para a `main` somente após backup, testes e verificação de integridade; a V1 permanece preservada por tags e por sua chave de armazenamento separada.

## Telas disponíveis

O protótipo inclui Hoje, Treinos, Treino guiado/Foco, Progresso, Dieta e Biblioteca. A navegação inferior é própria para celular e os cartões seguem a direção visual dos mockups aprovados: fundo escuro, cartões grafite, verde-limão e áreas de toque amplas.

O treino guiado permite editar repetições e carga decimal, marcar séries, consultar valores anteriores, copiar o último treino com confirmação, usar timer de descanso, pausar/pular descanso, pular exercício e concluir atividade com esforço percebido de 1 a 10. A tabela de séries possui um modo compacto responsivo que mantém série, reps, carga, último treino e seleção visíveis na largura do celular, sem rolagem horizontal.

## Dados e segurança

O protótipo usa a chave local `marsbGym_v2_preview` para não tocar na chave da versão atual. A importação da v1 é apenas explícita e sinaliza a existência de `marsbGym_v2`; não existe limpeza automática, `localStorage.clear()` ou sobrescrita silenciosa do plano atual. A exportação gera `marsb-gym-v2-backup.json`.

A onda 0 adiciona uma camada centralizada `MARSB_V2_STATE` em torno de `loadState`, `saveState`, `migrateState`, `getNutritionDay`, `updateNutritionDay`, `addFoodEntry`, `updateFoodEntry`, `removeFoodEntry`, `updateTargets`, `addWater`, `copyPlanToDay`, `cloneDay` e `recalculateDay`. A migração é idempotente, preserva campos desconhecidos, mantém `schemaVersion: 2` e não grava na chave da v1. A cópia de cardápio é aditiva por padrão; a duplicação gera novos IDs; e a remoção mantém informação suficiente para desfazer.

A Fase A adiciona diagnóstico local, backup versionado, restauração com validação e backup automático antes de restaurar. A importação da v1 continua explícita, com prévia, confirmação, backup e rollback. A V2 usa `schemaVersion: 2` e não reinstala dados padrão sobre um estado existente.

## Execução local

A partir da raiz do repositório, execute um servidor estático e abra `v2/index.html`, por exemplo:

```bash
python3 -m http.server 4173 --directory .
```

Depois visite `http://localhost:4173/v2/`.

## Validação

O protótipo foi validado em viewport móvel de 390 px com teste de navegador. O teste confirma a navegação entre as telas, abertura do treino guiado, modal de cópia, registro de série, modal de esforço e a ausência de overflow horizontal na tabela de séries.

## Status de publicação

A V2 está publicada no GitHub Pages. A atualização do PWA usa cache versionado e registro do Service Worker com `updateViaCache: 'none'`. O diagnóstico da versão e o fluxo de restauração ficam em Configurações. A versão atual da Fase A possui 59 testes aprovados; notificações com tela bloqueada no iOS continuam sujeitas às limitações do sistema e devem ser verificadas em uso real.
