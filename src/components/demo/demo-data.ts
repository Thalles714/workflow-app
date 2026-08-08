export type DemoAlert = {
  level: "Crítico" | "Risco" | "Atenção" | "Informação";
  title: string;
  reason: string;
  href: string;
};

export const demoProjects = [
  {
    name: "Lançamento Q3",
    client: "Órbita Tecnologia",
    progress: 58,
    status: "Em risco",
    href: "/demo/projects/lancamento-q3",
  },
  {
    name: "Nova identidade",
    client: "Casa Nimbo",
    progress: 82,
    status: "No ritmo",
    href: "/demo/clients/casa-nimbo",
  },
  {
    name: "Portal de parceiros",
    client: "Vértice Capital",
    progress: 34,
    status: "Em risco",
    href: "/demo/projects/lancamento-q3",
  },
  {
    name: "Campanha de aquisição",
    client: "Norte Studio",
    progress: 71,
    status: "Em revisão",
    href: "/demo/approvals",
  },
] as const;

export const demoAlerts: DemoAlert[] = [
  {
    level: "Crítico",
    title: "Landing page bloqueada por tarefa atrasada",
    reason: "Revisar formulário está bloqueada e venceu ontem.",
    href: "/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario",
  },
  {
    level: "Risco",
    title: "Peças do lançamento vencem em 3 dias",
    reason: "Três tarefas ainda estão abertas na entrega.",
    href: "/demo/projects/lancamento-q3/deliverables/landing-page",
  },
  {
    level: "Risco",
    title: "Portal de parceiros sem atividade há 8 dias",
    reason: "O projeto precisa de uma decisão de retomada.",
    href: "/demo/projects/lancamento-q3",
  },
  {
    level: "Atenção",
    title: "Kit de lançamento aguarda aprovação",
    reason: "A solicitação está pendente há 2 dias.",
    href: "/demo/approvals",
  },
  {
    level: "Atenção",
    title: "Integração de formulário está bloqueada",
    reason: "Aguardando a validação jurídica do cliente.",
    href: "/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario",
  },
  {
    level: "Informação",
    title: "Guia de campanha é importante e vence em 6 dias",
    reason: "Está saudável, mas merece acompanhamento antecipado.",
    href: "/demo/projects/lancamento-q3/deliverables/guia-de-campanha",
  },
];

export const demoTasks = [
  {
    title: "Revisar formulário",
    status: "Bloqueada",
    priority: "Crítica",
    detail: "Aguardando validação jurídica",
    href: "/demo/projects/lancamento-q3/deliverables/landing-page/tasks/revisar-formulario",
  },
  {
    title: "Adaptar peças sociais",
    status: "Em revisão",
    priority: "Alta",
    detail: "Conteúdo enviado para aprovação",
    href: "/demo/approvals",
  },
  {
    title: "Publicar landing page",
    status: "A fazer",
    priority: "Alta",
    detail: "Depende da revisão do formulário",
    href: "/demo/projects/lancamento-q3/deliverables/landing-page",
  },
  {
    title: "Configurar analytics",
    status: "Em andamento",
    priority: "Média",
    detail: "Eventos principais mapeados",
    href: "/demo/projects/lancamento-q3",
  },
] as const;
