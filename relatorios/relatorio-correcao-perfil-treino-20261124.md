# Relatório da correção — perfil e treino guiado

**Data:** 24/11/2026
**Projeto:** MARSB-GYM V2
**Escopo:** edição do nome do usuário, avanço, conclusão, salto e encerramento do treino guiado.

## Problemas corrigidos

A tela de Configurações não possuía campo nem rotina para salvar `profile.name`. Foi adicionado um campo de nome com limite de 80 caracteres, preenchimento pelo estado persistido e salvamento local junto às preferências. O fluxo não altera treinos, sessões, dieta, histórico ou a chave legada `marsbGym_v2`.

O treino guiado passou a normalizar índices e listas de exercícios carregadas de sessões anteriores. Foi adicionado o botão **Próximo sem concluir**, que preserva o exercício atual como pulado e abre o próximo pendente. O botão **Concluir exercício** conclui o exercício atual e avança ao próximo pendente. Quando há exercícios pulados, eles são retomados antes da avaliação final. A avaliação final só abre quando todos os exercícios foram concluídos.

## Proteção e rollback

Backup anterior à alteração:

`/tmp/MARBS-GYM-before-profile-workout-fix-20261124T0207Z.tar.gz`

SHA-256:

`a49a687c939c66d53b31444a40089ae927fac13fee552b6cf2e0361c87dd5213`

Rollback da produção: `v2-production-before-profile-workout-fix-20261124T0207-0300`, apontando para o commit de produção anterior `327417ea45a7dc0b3f8d22842cb810f93aed2421`.

## Testes

- Teste específico `profile-workout-fix-check.mjs`: aprovado.
- Teste existente do treino guiado: aprovado.
- Testes de salto, avanço pendente, ações no modo foco, reset de sessão e visibilidade do treino concluído: aprovados.
- Sintaxe JavaScript: aprovada.
- Suíte completa: **61 testes aprovados e 0 falhas**.
- `git diff --check`: aprovado.
- Teste mobile automatizado em viewport de 390 × 844: aprovado.

## Commits

- Desenvolvimento `v2-rebuild`: `eceea79bdd9ca336c78506811fe908083a4970f7`.
- Produção `main`: `d5132f5e8dc2308951416c70aaf64063c8cda8ee`.

## Publicação

A atualização foi promovida para `main` e o GitHub Pages confirmou a presença de `profileName`, `nextExerciseBtn` e `goToNextGuidedExercise` na versão pública:

https://maubarbalho.github.io/MARBS-GYM/

As branches locais de desenvolvimento e produção ficaram limpas e sincronizadas com o remoto.

## Observação

O teste automatizado confirma o comportamento do código. O uso físico no iPhone ou Android ainda deve ser feito pelo usuário para verificar teclado virtual, toque, rotação, modo instalado e persistência em um dispositivo real.

## Ajuste complementar de interface

Após a primeira publicação, foi identificado que a saudação inicial ainda estava fixa em “Marcelo” e que a barra de ações do treino ficava fora da área visível durante a animação da tela em viewport móvel. A saudação agora usa `profile.name` e os controles do treino permanecem visíveis e tocáveis na viewport de 390 × 844. A suíte foi repetida com servidor local ativo: **61 testes aprovados e 0 falhas**.
