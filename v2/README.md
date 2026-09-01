# MARSB-GYM 2.0 — protótipo funcional

Esta pasta contém o protótipo funcional da versão 2.0 do MARSB-GYM. Ele foi criado em uma branch separada (`v2-rebuild`) e **não é servido pelo GitHub Pages enquanto a branch principal continuar na v1**.

## Telas disponíveis

O protótipo inclui Hoje, Treinos, Treino guiado/Foco, Progresso, Dieta e Biblioteca. A navegação inferior é própria para celular e os cartões seguem a direção visual dos mockups aprovados: fundo escuro, cartões grafite, verde-limão e áreas de toque amplas.

O treino guiado permite editar repetições e carga decimal, marcar séries, consultar valores anteriores, copiar o último treino com confirmação, usar timer de descanso, pausar/pular descanso, pular exercício e concluir atividade com esforço percebido de 1 a 10.

## Dados e segurança

O protótipo usa a chave local `marsbGym_v2_preview` para não tocar na chave da versão atual. A importação da v1 é apenas explícita e sinaliza a existência de `marsbGym_v2`; não existe limpeza automática, `localStorage.clear()` ou sobrescrita silenciosa do plano atual. A exportação gera `marsb-gym-v2-backup.json`.

Antes de uma eventual migração, será necessário criar um adaptador de dados real, validar o schema atual, oferecer exportação e restauração e pedir confirmação do usuário. A v2 não deve substituir a v1 publicada até que esses testes sejam concluídos.

## Execução local

A partir da raiz do repositório, execute um servidor estático e abra `v2/index.html`, por exemplo:

```bash
python3 -m http.server 4173 --directory .
```

Depois visite `http://localhost:4173/v2/`.

## Status de publicação

A branch de desenvolvimento pode ser revisada no Git. A branch `main` e o GitHub Pages continuam apontando para a versão atual do MARSB-GYM. O deploy da v2 não deve ser acionado até aprovação explícita.
