# Relatório final — Onda 10 do MARSB-GYM v2

**Data:** 21 de outubro de 2026  
**Branch:** `v2-rebuild`  
**Repositório:** `maubarbalho/MARBS-GYM`  
**Status:** validação técnica concluída; lançamento não autorizado

## 1. Escopo executado

A Onda 10 fechou a migração técnica sem criar novas funcionalidades. Foram executadas a validação final do estado, a suíte completa, o teste comparativo mobile v1 × v2, a revisão da matriz de paridade, a confirmação de isolamento da `main` e a criação do backup final da base v2.

A execução permaneceu restrita à branch `v2-rebuild`. A versão estável em `main` não foi modificada e a chave de produção da v1 não recebeu escrita pelo protótipo.

## 2. Resultado dos testes

Os testes específicos da Onda 10 passaram:

- `wave10-final-validation-check` — aprovado.
- `wave10-v1-v2-comparison-browser-check` — aprovado em viewport de 390 × 844 px.

A suíte completa de fechamento passou integralmente:

```text
58 testes aprovados
0 falhas
```

A evidência da comparação está em [onda-10-comparacao-v1-v2.json](evidencias/onda-10-comparacao-v1-v2.json).

## 3. Comparação de usabilidade mobile

| Aspecto | v1 | v2 | Resultado |
|---|---|---|---|
| Identidade | `MARSB-GYM` | `MARSB-GYM 2.0` | Mantida e explicitada como protótipo isolado |
| Navegação principal | Início, Treinos, Calc, Dieta e Config. | Hoje, Treinos, Progresso, Dieta e Calculadora | As áreas centrais foram preservadas; Progresso ganhou acesso direto e Configurações foi deslocada para o menu |
| Telas/painéis | 15 painéis | 9 telas focadas | Menos fragmentação e menor carga cognitiva na navegação principal |
| Diário alimentar | Tela Dieta da v1 | Diário por data na tela Dieta | Paridade funcional validada, com metas, água, TACO, CRUD e planejador |
| Calculadoras | Tela Calc com calculadoras agrupadas | Tela Calculadora com navegação por grupos | Fórmulas e conversões validadas contra a v1 |
| Treinos | Fluxo de treino e histórico | Treinos, foco guiado, salto, retorno e timer persistente | Paridade funcional automatizada; timer possui limitação nativa de PWA/iOS |
| Progresso | Painel de progresso e histórico | Tela dedicada baseada em sessões reais | Histórico, volume, filtros e evolução validados |
| Backup e migração | Backup/restauração local da v1 | Importação explícita, prévia, backup v2 e rollback | Fluxo de migração reversível validado |
| Uso com toque | Interface funcional, mais densa | Alvos de toque, layout compacto e navegação inferior | A v2 reduz rolagem e agrupa ações para uso mobile |

### Pontos de melhoria da v2

A v2 apresenta uma arquitetura de navegação mais concentrada, com acesso direto a Progresso e uma tela de Dieta que reúne diário, metas, água, favoritos, receitas, compras e planejador. O estado é isolado e versionado, e os fluxos críticos são persistidos na chave `marsbGym_v2_preview`.

O principal ganho técnico é a separação entre funções de uso diário e operações de configuração/importação. Isso reduz o risco de ações administrativas interromperem o fluxo de treino ou alimentação.

### Diferenças que exigem atenção

A v2 possui nove telas principais contra quinze painéis na v1. Isso é intencional, mas usuários acostumados ao acesso direto à Configuração precisarão usar o menu. A navegação foi reorganizada, não removida.

A entrega de notificações com tela bloqueada e suspensão prolongada depende das restrições do PWA no iOS. Essa condição não pode ser declarada como equivalente nativa sem teste manual em um iPhone real.

## 4. Estado da paridade

Todos os grupos de funcionalidades previstos na matriz foram implementados e testados no ambiente automatizado:

- D01–D14: diário, metas, TACO, CRUD, recursos avançados e integração do planejador — validados.
- C01–C06: IMC, macros, porções, anilhas, progressão e conversões — validados.
- P01–P03: histórico, evolução, volume e preferências — validados.
- T01: treino guiado, salto, retorno, avanço e avaliação — validado.
- T02: timer persistente e recuperação — validado com limitação PWA/iOS para entrega em tela bloqueada.

A classificação não deve ser interpretada como aprovação para lançamento em produção. Ela representa a validação técnica disponível neste ambiente.

## 5. Portão de lançamento

O portão de lançamento permanece **não aprovado** pelos seguintes motivos objetivos:

1. O teste manual em iPhone real ainda não foi executado.
2. O teste em dispositivo Android ainda não foi executado.
3. Não existe aprovação explícita do usuário para publicar a v2 para usuários reais.

Portanto, a v2 deve permanecer somente na branch `v2-rebuild` e no ambiente de testes. Não houve publicação em produção, alteração da `main` ou migração automática de dados reais.

## 6. Backup e commits

Backup final criado antes da Onda 10:

- Tag: `backup-before-wave-10-20261021T140800-0300`.
- Arquivo: `/home/ubuntu/MARBS-GYM-wave10-before-20261021T140800-0300.tar.gz`.

Os artefatos da Onda 10 foram publicados somente em `origin/v2-rebuild`, sem lançamento para usuários reais.

## 7. Próximas ações permitidas

Não há novas features previstas após esta onda. Antes de qualquer decisão de lançamento, devem ser executados manualmente:

- Teste do PWA instalado em iPhone, incluindo bloqueio de tela e retorno ao aplicativo.
- Teste do PWA instalado em Android.
- Verificação de importação com um backup real escolhido pelo usuário, mantendo cópia de segurança.
- Aprovação explícita para publicação.
