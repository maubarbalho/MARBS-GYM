# Validação preliminar — P1

- Data: 2026-08-21
- Ambiente: visualização local do PWA em `http://127.0.0.1:8767/?p1-unlimited=1`.
- O cabeçalho exibiu a identificação "Hipertrofia • Treino livre e progresso contínuo", sem seletor de semana.
- A página inicial abriu sem erro visível.
- A mudança programática para a tela de progresso foi aceita e não houve erro de execução no navegador.

Esta verificação ainda não substitui os testes finais de migração, interação móvel e publicação.

## Diagnóstico complementar

O painel de aderência estava vazio na primeira abertura da página de progresso porque a atualização inicial ocorreu antes de o painel estar disponível na navegação. A chamada manual de `renderAdherenceCard()` concluiu sem erro e exibiu os sete dias, os estados de aderência e os controles de planejamento. A inicialização da página será ajustada na próxima alteração para renderizá-lo também ao abrir a tela.

Após a correção, uma nova abertura local confirmou `adherenceVisible: true` ao alternar para Progresso. O painel passou a carregar com os sete dias e seus controles sem intervenção manual.

## Biblioteca de treinos

As quatro rotinas originais A, B, C e D continuam disponíveis no ambiente local de teste, e todas as ações dinâmicas do editor foram carregadas. Um teste de criação disparado fora do editor aberto não acrescentou uma rotina, portanto a criação será validada dentro do fluxo de Configuração → Plano antes da publicação. O valor original de armazenamento local usado no teste foi restaurado imediatamente.

No fluxo correto de Configuração → Plano, o teste de criação aumentou a biblioteca de rascunho de seis para sete itens (`createdInDraft: true`). O armazenamento local de teste foi restaurado ao término, e a alteração não tocou em registros de treinos concluídos.

## Migração de dados legados

Foi carregado temporariamente um estado legado contendo o treino A, um treino adicional `T5` e uma sessão concluída em `2026-08-21`. Após a inicialização da versão P1, a tela inicial exibiu os dois treinos e manteve a sessão concluída no calendário e no painel de aderência (`1/1`). Isso confirma que o programa, o histórico e a data registrada continuam legíveis após a remoção das restrições. O estado anterior do navegador de teste será restaurado antes da entrega.

O estado original do navegador de teste foi restaurado e a tela voltou a exibir a divisão inicial A, B, C e D sem sessões artificiais. Nenhum dado de teste permaneceu no armazenamento local do navegador.

## Página Sobre

A janela Sobre abriu corretamente em tela móvel. O conteúdo confirmado inclui funcionamento offline, armazenamento local e backup, treinos livres, histórico por data, dieta TACO como estimativa e os limites do Coach para dor ou questões clínicas.

## Diário alimentar

Com dados temporários de almoço e metas diárias de `2.500 kcal` e `160 g` de proteína, o diário exibiu a orientação `Meta sugerida: 64 g P · 1000 kcal`. A sugestão usa apenas os valores locais de meta e não modifica alimentos, porções ou metas existentes.

O armazenamento de teste foi restaurado após a verificação e a tela voltou ao estado original, sem refeições ou metas artificiais persistentes.

## Período contínuo e atualização

Após recarregar com o novo cache offline, a tela inicial exibiu `Evolução recente`, `Histórico contínuo` e `nos últimos 28 dias`. A inspeção do DOM confirmou `0` botões de semana e ausência do seletor semanal no cabeçalho. O aviso de atualização ficou visível no topo, pronto para aplicar a versão nova sem limpar os dados locais.

O console do navegador não apresentou erros de execução atribuídos ao aplicativo após a recarga final.
