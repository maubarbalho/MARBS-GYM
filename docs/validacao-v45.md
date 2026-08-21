# Validação v45 — melhorias da auditoria

## Ambiente

- URL local isolada: `http://127.0.0.1:8767/?v=45`
- Data: 21/08/2026
- Método: navegação em visualização HTTP isolada, sem reutilizar o cache do PWA publicado.

## Evidência inicial

A tela Início carregou sem erro aparente e o onboarding foi exibido sobre a página no primeiro acesso. Os dois novos atalhos do cartão de evolução semanal — **Revisar treinos** e **Ver evolução** — estavam presentes. A validação dos fluxos de treino guiado, Dieta, Configurações e Coach continuará antes da publicação.

O onboarding foi concluído no ambiente de teste e exibiu a confirmação “Preferências iniciais salvas”. Em seguida, a tela Início permaneceu navegável, com os atalhos **Revisar treinos** e **Ver evolução** visíveis no cartão de evolução semanal.

O treino guiado foi aberto para o Treino A. O modo foco exibiu o exercício atual, a série atual, repetições alvo, descanso, técnica, campos de repetições e carga, seletor RIR/RPE, atalho de timer e avanço. O botão **Completo** estava disponível para retornar à visão detalhada.

O painel de Configurações foi revisado. A ordem de navegação foi corrigida para priorizar Perfil, Aparência, Notificações, Unidades, Progresso e Dados e backup; Modo Personal agora permanece como recurso secundário depois de Plano. A correção resolve uma divergência visual em que o item sem valor de ordem aparecia primeiro na grade.

Após recarregar a versão local, a ordem visual foi confirmada no celular: Perfil, Aparência, Notificações, Unidades, Progresso, Dados e backup, Privacidade, Coach IA, Plano, Modo Personal e Sobre.

Na Dieta, o diário ficou acima do gerador opcional de cardápio, com busca na base TACO e o indicador “Aderência de 7 dias” visíveis. No Coach, foram exibidos o estado de disponibilidade “IA grátis pronta”, o provedor/modelo em uso, os avisos de privacidade e segurança, e os exemplos Aquecimento, Prioridade do dia, Progressão, Adaptar dor e Meu progresso.

Na Calculadora, os campos de corpo e nutrição receberam os valores locais autorizados apenas quando estavam vazios. A tela de Nutrição exibiu os dados preenchidos, as escolhas de sexo, atividade e objetivo, e mantém orientações sobre ajuste pela evolução semanal antes do cálculo de macros.

Publicação confirmada em https://maubarbalho.github.io/MARBS-GYM/?v=45. A tela inicial exibiu os novos atalhos de evolução e o aviso de atualização do service worker para a instalação controlada da revisão v45, sem orientação de limpar dados locais.
