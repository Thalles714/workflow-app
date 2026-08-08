# Workflow

Workflow organiza a operação de pequenas agências em uma hierarquia única de trabalho e mantém cada agência isolada como um tenant.

## Language

**Workspace**:
Espaço isolado que contém membros, clientes e todo o trabalho de uma agência. É a fronteira de tenant.
_Avoid_: Conta, agência como termo técnico

**Usuário**:
Pessoa autenticada, independentemente dos Workspaces aos quais pertence.
_Avoid_: Membro como sinônimo

**Membro**:
Vínculo de um Usuário com um Workspace e um papel naquele espaço.
_Avoid_: Usuário como vínculo

**Cliente**:
Organização atendida pela agência e contida em um Workspace.
_Avoid_: Conta, lead

**Projeto**:
Trabalho contratado de um Cliente que reúne Entregas.
_Avoid_: Board, campanha como entidade paralela

**Entrega**:
Resultado relevante para o Cliente, composto por Tarefas e sujeito a prazo e aprovação interna.
_Avoid_: Épico, tarefa especial

**Tarefa**:
Unidade executável de trabalho pertencente a uma Entrega.
_Avoid_: Entrega

**Atualização de tarefa**:
Registro textual curto e imutável de contexto ou progresso em uma Tarefa.
_Avoid_: Thread, comentário editável

**Aprovação**:
Decisão interna sobre uma Entrega.
_Avoid_: Aprovação do cliente

**Alerta**:
Projeção determinística e explicável de uma condição operacional que exige atenção.
_Avoid_: Score de IA, risco persistido

**Bloqueio**:
Sinal adicional de uma Tarefa que exige motivo e não altera seu status.
_Avoid_: Status “Bloqueada”

**Arquivamento**:
Remoção reversível de um registro das visões ativas.
_Avoid_: Exclusão física
