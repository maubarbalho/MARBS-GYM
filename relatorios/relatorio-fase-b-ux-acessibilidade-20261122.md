# Relatório da Fase B — UX mobile e acessibilidade

**Data:** 22/11/2026
**Projeto:** MARSB-GYM V2
**Branch de trabalho:** `v2-rebuild`
**Escopo:** Safari/iPhone, Android, VoiceOver, teclado, formulários, estados vazios, foco e treino guiado.

## Alterações realizadas

A interface recebeu foco visível consistente para botões, campos, `summary` e abas, além de alvos touch com `touch-action: manipulation`. Foi adicionada uma preferência global de movimento reduzido para respeitar `prefers-reduced-motion`, sem remover a navegação nem alterar dados salvos.

Os diálogos de menu, cópia de treino e avaliação RPE agora mantêm foco dentro do próprio diálogo, fecham com Escape, fecham ao tocar no backdrop, restauram o foco ao controle de origem e usam `aria-hidden`, `aria-describedby` e rótulos mais completos. O formulário RPE passou a ter rótulo explícito para comentário e os dez níveis de esforço possuem nomes acessíveis e estado `aria-pressed`.

A Biblioteca ganhou um estado vazio explícito quando a busca não encontra exercícios. As categorias musculares passaram a usar grupo semântico, estado `aria-pressed` e feedback de status. As abas da Calculadora agora expõem `aria-selected` e `aria-controls`, enquanto os resultados têm `role="status"` e `aria-live="polite"` para leitura por VoiceOver.

A exportação permanece versionada e segura pelo fluxo da Fase A, sem duplicar downloads e sem tocar na chave da V1.

## Proteção de dados

Nenhuma rotina nova escreve em `marsbGym_v2`. O estado da V2 continua em `marsbGym_v2_preview`, o plano salvo não é substituído por dados padrão e as alterações de UX não modificam sessões, dieta, calculadoras ou histórico.

## Backup e rollback

A tag anterior à fase é `backup-before-phase-b-20261122T0909-0300`.

O arquivo local anterior à fase é `/tmp/MARBS-GYM-phaseB-before-20261122T0909-0300.tar.gz`.

SHA-256: `c2210d14ab1146b7186f583088829e6782afa743b64717757bd93b48fbcc3d8d`.

## Validação

A suíte completa terminou com **60 testes aprovados e 0 falhas**. Foram aprovados os testes de sintaxe, contrato de estado, acessibilidade mobile, atualização standalone do iOS, fluxo de atualização, persistência do plano, reset de sessão, treino guiado, exportação e teste específico da Fase B.

O teste mobile em viewport de 390 × 844 confirmou abertura e fechamento do menu por Escape, foco preso dentro do modal, fechamento do modal, estado vazio da Biblioteca após busca sem resultados e troca acessível para a aba Nutrição da Calculadora.

`git diff --check` também foi aprovado.

## Limitações

A validação automatizada não substitui o uso físico com VoiceOver no iPhone, TalkBack no Android, teclado externo, rotação, modo standalone e tela bloqueada. Esses testes devem ser realizados pelo usuário após a publicação. O comportamento de notificações em segundo plano continua limitado pelas regras do iOS e não foi alterado nesta fase.

## Próxima fase

A Fase C está programada para 29/11/2026 e tratará desempenho, bateria, offline, cache, listeners, timers, modularização segura e testes de performance, sem alterar os dados existentes.
