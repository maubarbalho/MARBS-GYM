# Agenda de migração da v1 para a v2

**Projeto:** MARSB-GYM 2.0  
**Branch de trabalho:** `v2-rebuild`  
**Branch estável:** `main` — não deve ser modificada durante o protótipo  
**Estado de referência:** Onda 2 concluída, commit `3d9d0ff`  
**Último resultado de testes:** 43 testes aprovados, 0 falhas  
**Fuso sugerido para execução:** horário de Brasília  
**Modelo de execução:** uma onda por vez, com backup, implementação, testes, atualização da matriz e commit

> Esta agenda é um plano operacional. Nenhum agendamento automático recorrente foi criado porque ainda não foi informado horário de início, frequência ou data de execução. A sequência abaixo pode ser convertida posteriormente em tarefas agendadas.

---

## 1. Objetivo da agenda

Concluir a migração funcional da v1 para a v2 sem perder dados personalizados, sem substituir o plano de treino salvo e sem misturar as chaves de armazenamento das duas versões.

A conclusão só será considerada segura quando:

1. Todas as funcionalidades prioritárias da matriz tiverem implementação equivalente.
2. Os dados da v1 puderem ser exportados e visualizados antes da importação.
3. A importação for aditiva, validada e reversível.
4. O plano de treino, histórico, dieta e preferências forem preservados.
5. Os testes automatizados e mobile passarem.
6. A `main` continuar intacta até a aprovação final.

---

## 2. Estado atual

### Já concluído

- Fundação do estado centralizado v2.
- Contrato `schemaVersion: 2`.
- Persistência isolada em `marsbGym_v2_preview`.
- Diário alimentar por data.
- Água e metas nutricionais.
- Alimentos TACO com snapshot nutricional.
- CRUD de alimentos.
- Cartões reais de refeições.
- Integração aditiva do planejador com o diário.
- Navegação mobile e melhorias de acessibilidade.
- Testes de regressão do treino, timer, atualização e persistência.

### Ainda pendente ou parcial

| Grupo | Itens |
|---|---|
| Dieta avançada | D07–D13 |
| Calculadoras | C01–C06, com C01–C05 parciais e C06 pendente |
| Progresso | P01–P02 |
| Configuração | P03 |
| Treino | T01–T02 parciais |
| Migração de dados | Exportação, prévia, importação, validação e rollback |

---

## 3. Agenda sequencial sugerida

A recomendação é executar uma onda por ciclo de aproximadamente 24 horas, mantendo o intervalo entre ondas para validar a anterior. Ondas que envolvem migração e testes reais podem exigir mais de um ciclo.

| Ordem | Onda | Escopo | Prioridade sugerida | Duração estimada |
|---:|---|---|---|---:|
| 1 | Onda 3 | Fundação do importador seguro da v1 | P0 | 1 ciclo |
| 2 | Onda 4 | Dieta avançada D07–D09 | P1 | 1 ciclo |
| 3 | Onda 5 | Dieta avançada D10–D13 | P1 | 1–2 ciclos |
| 4 | Onda 6 | Paridade formal das calculadoras C01–C06 | P0/P1 | 1–2 ciclos |
| 5 | Onda 7 | Progresso e configurações P01–P03 | P1 | 1 ciclo |
| 6 | Onda 8 | Paridade final de treino e timer T01–T02 | P0 | 1–2 ciclos |
| 7 | Onda 9 | Ensaio de migração e auditoria final | P0 | 1–2 ciclos |
| 8 | Onda 10 | Portão de lançamento e documentação | P0 | 1 ciclo |

---

# Onda 3 — Fundação do importador seguro da v1

## Objetivo

Criar a infraestrutura para migrar dados reais da v1 sem apagar, sobrescrever ou alterar a origem.

## Entregas

- Exportação somente leitura da estrutura da v1.
- Geração de backup JSON antes de qualquer importação.
- Tela de prévia da importação.
- Relatório de itens encontrados, convertidos, ignorados e conflitantes.
- Mapeamento inicial de:
  - Plano de treino.
  - Treinos concluídos.
  - Pesos e histórico.
  - Dieta e alimentos.
  - Metas.
  - Preferências.
- Importação em `marsbGym_v2_preview`.
- IDs novos para registros importados.
- Compatibilidade com dados ausentes ou incompletos.
- Rollback por restauração do backup v2.

## Critérios de aceite

- A v1 permanece somente leitura.
- Nenhuma chave da v1 é alterada.
- A importação pode ser cancelada antes da confirmação.
- A prévia mostra exatamente o que será importado.
- Dados desconhecidos são preservados em uma área de migração ou relatório de incompatibilidade.
- Uma segunda importação não duplica dados sem aviso.
- Existe um caminho claro para desfazer a importação.

## Testes obrigatórios

- Teste com banco v1 vazio.
- Teste com banco v1 completo.
- Teste com campos ausentes.
- Teste com plano personalizado.
- Teste com sessões concluídas.
- Teste de não escrita em chaves v1.
- Teste de idempotência.
- Teste de rollback.

## Portão

Não avançar para a Onda 4 se o importador não produzir prévia e backup verificáveis.

---

# Onda 4 — Dieta avançada: aderência, duplicação e favoritos

## Escopo

### D07 — Aderência de 7 dias

Criar indicador baseado nos registros reais do diário, sem usar dados estáticos.

Aceite:

- Considera os sete dias corretos.
- Diferencia dias com e sem registro.
- Mostra calorias, proteína ou aderência conforme a regra escolhida.
- Funciona quando existem dias vazios.
- Respeita a data selecionada e a semana correspondente.

### D08 — Duplicar dia

Permitir duplicar um dia alimentar para outra data.

Aceite:

- A origem não é alterada.
- A cópia recebe novos IDs.
- Metas e refeições são copiadas conforme escolha do usuário.
- A operação é aditiva ou substitutiva somente mediante escolha explícita.
- Existe confirmação para evitar duplicação acidental.

### D09 — Favoritos

Permitir salvar e reaplicar alimentos ou combinações frequentes.

Aceite:

- Criar favorito.
- Listar favorito.
- Aplicar a uma refeição.
- Remover favorito.
- Persistir favoritos fora da data do diário.

## Testes obrigatórios

- Testes de datas cruzadas.
- Testes de IDs independentes.
- Testes de duplicação repetida.
- Testes de favoritos sem rede.
- Testes de preservação de metas e registros existentes.

---

# Onda 5 — Dieta avançada: receitas, restrições, lista de compras e explicações

## Escopo

### D10 — Receitas salvas

- Criar receita com ingredientes.
- Salvar quantidades e rendimento.
- Editar receita.
- Aplicar receita a uma refeição.
- Remover receita.
- Recalcular macros da porção.

### D11 — Restrições e alergias

- Preferências persistentes.
- Exibição no fluxo do planejador.
- Filtros ou avisos para alimentos incompatíveis.
- Não alterar registros antigos sem autorização.
- Preservar preferências durante atualização.

### D12 — Lista de compras

- Agrupar alimentos reais do diário ou plano.
- Consolidar quantidades.
- Diferenciar preparo quando necessário.
- Permitir copiar ou exportar a lista.
- Não incluir placeholders.

### D13 — Explicação de metas

- Mostrar fórmulas utilizadas.
- Explicar TMB, TDEE, déficit e superávit.
- Informar limitações das estimativas.
- Manter o conteúdo recolhível para não ocupar a tela mobile.

## Portão

A Onda 5 só será considerada concluída quando os dados forem persistidos no contrato v2 e houver teste mobile para criação, edição e aplicação.

---

# Onda 6 — Paridade formal das calculadoras

## Escopo

Comparar a v2 diretamente com a v1, usando os mesmos valores de entrada e verificando resultados.

### C01 — IMC

- Fórmula.
- Arredondamento.
- Classificação.
- Mensagem explicativa.
- Campos padrão.

### C02 — Calorias e macros

- TMB.
- TDEE.
- Sexo.
- Idade.
- Altura.
- Peso.
- Atividade.
- Objetivos de manutenção, hipertrofia e déficit.
- Proteína, carboidratos, gorduras e água.

### C03 — Porções

- Alimentos disponíveis.
- Quantidades.
- Macros por porção.
- Referência TACO.
- Arredondamento.

### C04 — Anilhas

- Peso total.
- Peso da barra.
- Distribuição por lado.
- Pesos fracionados.
- Alternativas quando a combinação exata não existir.

### C05 — Progressão

- Percentual de aumento.
- Arredondamentos.
- Passos de 0,5 kg e 1,25 kg.
- Mensagens de segurança.

### C06 — Conversões

- kg/lb.
- lb/kg.
- cm/polegadas.
- polegadas/cm.
- Casas decimais e formato brasileiro.

## Critérios de aceite

- Comparação automatizada de entradas equivalentes v1/v2.
- Diferenças justificadas e documentadas.
- Nenhuma divergência silenciosa.
- Interface utilizável no celular.
- Planejador continua integrado ao diário.

---

# Onda 7 — Progresso e configurações

## P01 — Histórico de treinos

- Usar sessões reais da v2.
- Filtrar por período.
- Filtrar por exercício.
- Exibir cargas, repetições e conclusão.
- Preservar registros importados da v1.

## P02 — Evolução e volume

- Volume por sessão.
- Volume semanal.
- Evolução por exercício.
- Comparação entre períodos.
- Dados vazios tratados corretamente.

## P03 — Preferências e edição segura

- Preferências persistentes.
- Unidades.
- Notificações.
- Aparência.
- Restrições e alergias.
- Atualizações sem reinstalar plano padrão.
- Backup antes de alterações estruturais.

## Portão

A tela de progresso não deve ser promovida a Validado enquanto os gráficos ou resumos dependerem de dados estáticos.

---

# Onda 8 — Paridade final do treino e do timer

## T01 — Treino guiado e foco

- Pular exercício.
- Retornar ao exercício pulado.
- Avançar para o próximo pendente.
- Encerrar exercício.
- Encerrar treino.
- Registrar esforço, energia, desconforto e observações.
- Manter estado ao sair e retornar.
- Não recarregar uma sessão concluída como se fosse nova.

## T02 — Timer em segundo plano

- Timer ao sair da tela.
- Timer ao sair do aplicativo.
- Timer com tela bloqueada, dentro das limitações do PWA.
- Notificação no fim do descanso.
- Recuperação após suspensão.
- Documentação explícita das limitações do iOS.

## Critérios de aceite

- Fluxo completo comparado lado a lado com a v1.
- Teste Playwright mobile aprovado.
- Teste manual em iPhone aprovado.
- Nenhum timer duplicado.
- Nenhuma sessão perdida ao navegar.

---

# Onda 9 — Ensaio de migração e auditoria final

## Objetivo

Executar uma migração simulada com uma cópia anonimizada dos dados reais, sem tocar na `main` nem nos dados de produção.

## Roteiro

1. Criar backup da v1.
2. Exportar dados v1.
3. Gerar prévia de importação.
4. Registrar contagens por categoria.
5. Importar na v2.
6. Comparar origem e destino.
7. Abrir o app em viewport mobile.
8. Testar treino salvo.
9. Testar histórico.
10. Testar dieta e planejador.
11. Testar calculadoras.
12. Testar offline.
13. Simular atualização do PWA.
14. Confirmar que os dados não retornaram ao padrão.
15. Executar rollback.
16. Repetir a importação após corrigir qualquer divergência.

## Evidências necessárias

- Backup original.
- Arquivo exportado.
- Prévia da importação.
- Relatório de conversão.
- Capturas ou logs dos testes.
- Contagem de registros antes e depois.
- Resultado do rollback.
- Resultado da suíte completa.

---

# Onda 10 — Portão de lançamento

A v2 só poderá ser considerada pronta para lançamento quando todos os itens abaixo forem verdadeiros:

- [ ] Matriz sem itens P0 pendentes.
- [ ] D01–D14 revisados e classificados corretamente.
- [ ] Calculadoras comparadas com a v1.
- [ ] Progresso baseado em dados reais.
- [ ] Importação da v1 concluída e reversível.
- [ ] Plano personalizado preservado.
- [ ] Teste de atualização sem perda de dados aprovado.
- [ ] Teste offline aprovado.
- [ ] Teste mobile em iPhone aprovado.
- [ ] Teste Android aprovado, quando disponível.
- [ ] Suíte automatizada completa aprovada.
- [ ] Backup final da v1 criado.
- [ ] Relatório final v1 × v2 atualizado.
- [ ] Usuário informado sobre limitações restantes.
- [ ] Aprovação explícita para publicação.

---

## 4. Regra operacional para cada onda

Cada onda deve seguir exatamente esta sequência:

1. **Backup:** criar tag e arquivo de restauração.
2. **Auditoria:** comparar o backlog com a matriz atual.
3. **Implementação:** alterar somente a branch `v2-rebuild`.
4. **Teste estático:** executar os testes específicos da onda.
5. **Teste funcional:** exercitar a interface e persistência.
6. **Teste mobile:** validar viewport estreito e toque.
7. **Atualização da matriz:** registrar estado, critérios e evidências.
8. **Commit:** usar mensagem específica da onda.
9. **Push:** publicar somente em `v2-rebuild`.
10. **Relatório:** registrar o que foi validado e o que ficou pendente.

Nenhuma onda deve iniciar se a anterior tiver falha de persistência, perda de dados, teste quebrado ou matriz desatualizada.

---

## 5. Próxima ação recomendada

A próxima execução deve ser a **Onda 3 — Fundação do importador seguro da v1**. Ela deve começar por uma auditoria dos formatos de dados reais da v1 e pela criação do fluxo de backup e prévia, antes de qualquer importação automática.

A Onda 3 é prioritária porque as funcionalidades da v2 podem continuar sendo desenvolvidas isoladamente, mas o lançamento não deve ocorrer enquanto os dados personalizados da v1 não puderem ser transferidos com segurança.
