# Inventário da v1 para a expansão da v2

A v1 é uma PWA monolítica em `index.html` com navegação por abas/painéis, Service Worker e persistência em `localStorage`. A expansão da v2 deve preservar a lógica e reexpressar os recursos em componentes visuais próprios.

## Funcionalidades identificadas

| Área | Recursos a transportar para a v2 |
|---|---|
| Início | Cards de treinos, treino ativo, status semanal, calendário, progresso e resumos |
| Treinos | Plano salvo, seleção de treino, treino livre, treino guiado, modo foco/completo e exercícios pendentes |
| Séries | Reps, carga decimal, zero sem peso, marcar/desmarcar, última série, cópia de valores anteriores e histórico |
| Navegação guiada | Voltar, pular exercício, retornar ao exercício pendente, concluir exercício, encerrar treino e sessão nova após conclusão |
| Descanso | Timer, pausa, pular, preservação ao sair do app e notificação quando suportada |
| Feedback | Esforço, energia e desconforto em escalas de 1–10, comentários e resumo final |
| Progresso | Streak, calendário, estatísticas de treino, comparações e resumos derivados com cache em memória |
| Dieta | Refeições, campos de alimentos, macros, água, opções recolhíveis e registros diários |
| Peso corporal | Registro de peso, histórico, variação, IMC e visualização de tendência |
| Calculadoras | Anilhas, conversões e cálculo relacionado à carga |
| Biblioteca | Fichas de exercício, mídia, instruções, alternativas, filtros e notas |
| Dados | Backup, restauração, exportação, importação, preservação do plano e migração segura |
| PWA | Cache versionado, atualização explícita, uso offline, tela instalada e manutenção sem limpeza destrutiva |
| Acessibilidade | Alvos de toque, foco visível, fontes sem zoom acidental, rótulos, contraste e estados de botão |

## Exclusões deliberadas

O legado de IA/coach não deve ser transportado como dependência obrigatória. Recursos nativos de HealthKit, Apple Watch, Huawei Watch e notificações locais devem permanecer como integrações futuras isoladas, porque não são capacidades completas de um PWA puro.

## Regra de migração

A v2 deve ter um adaptador explícito do schema atual. O usuário deve confirmar a importação, receber possibilidade de exportar os dados e manter a v1 intacta até a validação da migração. A v2 não deve usar `localStorage.clear()` nem sobrescrever silenciosamente `marsbGym_v2`.
