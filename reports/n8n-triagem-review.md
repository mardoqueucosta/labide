# Revisão revisada do fluxo "Agente: Triagem" no n8n

## Resumo executivo
O fluxo cumpre o objetivo de triagem ao integrar Evolution API, Google Sheets e agente OpenAI. Após implementar as correções pedidas, a versão consolidada do workflow pode ser importada a partir de [`workflows/agente-triagem-v2.json`](../workflows/agente-triagem-v2.json). As ações abaixo permanecem ordenadas por impacto e esforço estimado para futuras iterações estruturais.

## Correções prioritárias
| Ordem | Ação | Descrição | Como implementar |
| --- | --- | --- | --- |
| 1 | Validação do payload | Interceptar eventos sem `body.data.message` antes do node `Code1`. | Inserir um node **IF** logo após o `Webhook` com `Continue On Fail`. Quando a condição falhar, direcionar para um `NoOp` ou log e encerrar a execução. |
| 2 | Separador entre transcrição e texto | Evitar junção sem separador em `mensagem`. | Alterar o node **Set → mensagem.msg** para `={{ [$json.text, $('Webhook').item.json.body.data.message.conversation].filter(Boolean).join('\n\n') }}`. |
| 3 | Fallback da transcrição | Garantir que falhas temporárias do Whisper não interrompam o fluxo. | Ativar `Continue On Fail` no node **OpenAI (transcribe)** e, no fluxo de erro, popular `mensagem.msg` apenas com o texto original e registrar o erro em log. |
| 4 | Controle do contador de preço | Persistir `contador_de_preço` fora da system message. | Criar planilha/tabela `contatos_precos` com `telefone`, `contador`, `atualizado_em`. Antes do node `Agent`, buscar o registro e anexar a variável de contexto (`$json.contador_de_preco`). Após resposta que envolva preço, atualizar o contador. |
| 5 | Split em lotes com tratamento de erro | Evitar perda silenciosa ao enviar mensagens em `SplitInBatches`. | Habilitar `Continue On Fail`, registrar o erro em planilha/log e configurar `delay` incremental em `options_message` para evitar rate limit. |

## Melhorias estruturais
### Resiliência adicional
- **Workflow de captura de erros**: Criar um workflow `Catch: Triagem` conectado ao principal para registrar exceções com telefone,
 node que falhou e payload.
- **Timeouts configuráveis**: Nas credenciais do Evolution API, defina limites de timeout e re-tentativas para evitar travamentos
 prolongados.

### Organização dos dados e memória
- **Memória seletiva**: Reduzir ruído no `Simple Memory` filtrando apenas as mensagens do cliente e respostas do agente
 (ex.: por `fromMe === false`). Caso o histórico ultrapasse 150 turnos, truncar mantendo apenas as últimas interações relevantes.
- **Campos normalizados**: Quando gravar pedidos na planilha principal, salvar também `telefone_normalizado` (E.164) e `origem`
 (`whatsapp`, `app`) para facilitar relatórios.

### Reutilização de lógica
- **Subworkflow de telefone**: Extrair o node `Code1` para um workflow chamado "Normalizar telefone WhatsApp" que retorne
 `original`, `com9` e `sem9`. Outros fluxos poderão chamá-lo via `Execute Workflow`, garantindo consistência.
- **Função de texto**: Migrar a lógica de divisão em frases para um script reutilizável (ex.: arquivo no Git ou subworkflow) com
 lista ampliada de abreviações (`Sr`, `Sra`, `Prof`, `Av`, etc.) ou substituir por `Text Splitter` do LangChain com separador
 personalizado.

### Observabilidade
- **Matriz de log**: Criar uma aba "logs_triagem" com colunas `timestamp`, `telefone`, `tipo_evento`, `status`, `detalhe`. O node
 de log deve ser reutilizável e acionado por sucessos críticos (ex.: handoff humano) e por falhas.
- **Alertas pro handoff**: Ao detectar `agente_ativo = FALSE`, enviar webhook para Slack/Email com os dados básicos do contato
 para acelerar o atendimento humano.

### Segurança e governança
- **Segregação de credenciais**: Revisar exportações do workflow garantindo que os IDs das credenciais não fiquem expostos.
- **Rate limit**: Inserir node `Rate Limit` antes de chamadas ao Evolution API e OpenAI (ex.: 20 req/min) para evitar bloqueios
 quando houver pico.
- **Revisão de auditoria**: Documentar quem pode editar a planilha de contatos/pedidos e configurar permissões mínimas
 necessárias.

## Próximos passos sugeridos
1. Implementar as cinco correções prioritárias acima e validar com casos de teste (mensagem texto, áudio com falha,
 atualização de contador de preços, envio com erro simulado).
2. Publicar subworkflow de normalização de telefone e atualizar este fluxo para utilizá-lo.
3. Criar o fluxo de logs e conectá-lo tanto no caminho feliz quanto nos ramos de erro.
4. Documentar no repositório interno o procedimento de atualização do contador de preço e política de reset.

Com essas correções, o "Agente: Triagem" terá comportamento previsível diante de payloads inesperados, preservará contexto de
preço entre conversas, oferecerá melhor observabilidade e reduzirá riscos de segurança operacional.
