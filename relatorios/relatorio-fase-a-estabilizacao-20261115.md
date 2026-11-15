# Relatório da Fase A — Confiabilidade e segurança

**Data:** 15/11/2026
**Projeto:** MARSB-GYM V2
**Branch de trabalho:** `v2-rebuild`
**Escopo:** backup/restauração, atualização do PWA, diagnóstico local e versionamento do cache.

## Alterações realizadas

- Adicionado diagnóstico local em Configurações com versão da aplicação, disponibilidade do armazenamento, status online/offline e data do último backup.
- Criado backup local versionado da chave `marsbGym_v2_preview`, com retenção dos cinco backups históricos mais recentes.
- Criada restauração de backup JSON com validação de tipo, formato e `schemaVersion: 2`.
- Criado backup automático de segurança antes de qualquer restauração.
- Exportação manual passou a incluir metadados do backup e snapshot validado do estado.
- Adicionado registro do Service Worker com `updateViaCache: 'none'` e atualização manual.
- Atualizado o identificador do cache para `marsb-gym-v2-phase-a-20261115`.
- Adicionada versão `2.0.0-phase-a` ao manifest da V2.
- Atualizadas as expectativas dos testes que dependiam do identificador antigo do cache.

## Proteção de dados

- A chave da V1 `marsbGym_v2` não é escrita, removida ou sobrescrita.
- A chave da V2 permanece `marsbGym_v2_preview`.
- A restauração somente ocorre após confirmação explícita do usuário.
- O estado atual é salvo antes da restauração.
- Backups inválidos ou incompatíveis são rejeitados sem alterar o estado.
- O plano de treino salvo não é substituído por dados padrão durante a inicialização ou atualização.

## Backup e rollback

- Tag anterior à Fase A: `backup-before-phase-a-20261115T0908-0300`.
- Arquivo local anterior à Fase A: `/tmp/MARBS-GYM-phaseA-before-20261115T0908-0300.tar.gz`.
- SHA-256 do arquivo: `db9f761ea5e9787cb1588b8539636b43577fed2c6dfdc51a4485be84e1d1580d`.

## Validação

- Suíte completa: **59 testes aprovados, 0 falhas**.
- Testes específicos de sintaxe, contrato de estado, acessibilidade, atualização iOS, fluxo de atualização e validação final: aprovados.
- Teste mobile específico da Fase A: diagnóstico visível, armazenamento disponível, exportação JSON e Service Worker registrado: aprovado.
- Teste de restauração mobile: backup v2 válido restaurado após confirmação e reload: aprovado.
- `git diff --check`: aprovado.

## Limitações

- A entrega de notificações com tela bloqueada no iOS continua dependendo das regras do sistema e deve ser observada em uso real.
- A Fase A não altera o timer nem promete comportamento nativo além do que o PWA pode oferecer.
- O teste de uso prático em iPhone/Android será realizado pelo usuário após a publicação.

## Próxima fase

A Fase B está programada para 22/11/2026 e tratará UX mobile e acessibilidade, sem alterar dados existentes.
