"use client";

import { useState } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Drawer,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
  Skeleton,
  Table,
  Tabs,
  ToastDemo,
} from "../ui";

export function ComponentShowcase() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  return (
    <section aria-labelledby="components-title" className="showcase">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Biblioteca interna</span>
          <h2 id="components-title">Primitives do Workflow</h2>
        </div>
        <Badge tone="success">Estados acessíveis</Badge>
      </div>
      <Tabs
        label="Categorias de componentes"
        items={[
          {
            id: "feedback",
            label: "Feedback",
            content: (
              <div className="showcase-grid">
                <Alert title="Entrega no ritmo" tone="success">
                  As cinco tarefas críticas foram concluídas.
                </Alert>
                <Alert title="Aprovação pendente" tone="warning">
                  A decisão aguarda há 48 horas.
                </Alert>
                <EmptyState
                  title="Nada exige atenção"
                  description="A operação está saudável. Volte ao seu trabalho."
                />
                <div className="skeleton-card">
                  <Skeleton />
                  <Skeleton className="ui-skeleton--short" />
                  <Skeleton />
                </div>
              </div>
            ),
          },
          {
            id: "forms",
            label: "Formulários",
            content: (
              <Card className="showcase-form">
                <Field label="Nome do cliente" helper="Até 120 caracteres.">
                  <Input defaultValue="Órbita Tecnologia" />
                </Field>
                <Field label="Situação">
                  <Select defaultValue="active">
                    <option value="active">Ativo</option>
                    <option value="archived">Arquivado</option>
                  </Select>
                </Field>
                <div className="component-row">
                  <Button variant="brand">Salvar alterações</Button>
                  <Button variant="secondary">Cancelar</Button>
                </div>
              </Card>
            ),
          },
          {
            id: "data",
            label: "Dados",
            content: (
              <>
                <div className="component-row">
                  <Badge tone="critical">Crítico</Badge>
                  <Badge tone="warning">Atenção</Badge>
                  <Badge tone="info">Risco</Badge>
                  <Chip>Cliente: Órbita</Chip>
                  <Avatar label="Ana Martins" />
                </div>
                <Table>
                  <thead>
                    <tr>
                      <th>Entrega</th>
                      <th>Estado</th>
                      <th>Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Landing page</td>
                      <td>
                        <Badge tone="warning">Em andamento</Badge>
                      </td>
                      <td>11 ago</td>
                    </tr>
                    <tr>
                      <td>Guia da campanha</td>
                      <td>
                        <Badge tone="success">No ritmo</Badge>
                      </td>
                      <td>14 ago</td>
                    </tr>
                  </tbody>
                </Table>
              </>
            ),
          },
        ]}
      />
      <div className="component-row layer-actions">
        <Button onClick={() => setModal(true)} variant="secondary">
          Abrir modal
        </Button>
        <Button onClick={() => setDrawer(true)} variant="secondary">
          Abrir drawer
        </Button>
        <ToastDemo />
      </div>
      <Modal
        description="Confirme a mudança antes de continuar."
        onClose={() => setModal(false)}
        open={modal}
        title="Concluir tarefa"
      >
        <p className="layer-copy">
          A tarefa será marcada como concluída e registrada na atividade.
        </p>
        <div className="component-row">
          <Button onClick={() => setModal(false)}>Concluir tarefa</Button>
          <Button onClick={() => setModal(false)} variant="secondary">
            Cancelar
          </Button>
        </div>
      </Modal>
      <Drawer
        description="Detalhes sem perder o contexto da operação."
        onClose={() => setDrawer(false)}
        open={drawer}
        title="Revisar formulário"
      >
        <Field label="Status">
          <Select defaultValue="review">
            <option value="review">Em revisão</option>
            <option value="done">Concluída</option>
          </Select>
        </Field>
        <div className="component-row">
          <Button onClick={() => setDrawer(false)}>Salvar alterações</Button>
        </div>
      </Drawer>
    </section>
  );
}
