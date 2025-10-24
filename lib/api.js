const delay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

const users = [
  {
    id: "1",
    matricula: "20230001",
    password: "senha123",
    name: "Ana Clara Souza",
    email: "ana.souza@atenas.edu.br",
    course: "Engenharia de Software",
  },
  {
    id: "2",
    matricula: "20230002",
    password: "senha123",
    name: "Bruno Henrique Lima",
    email: "bruno.lima@atenas.edu.br",
    course: "Ciência da Computação",
  },
];

const activeSessions = new Map();

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export async function login({ matricula, password }) {
  await delay();

  if (!matricula || !password) {
    throw new Error("Informe matrícula e senha válidos.");
  }

  const student = users.find(
    (item) => item.matricula.toLowerCase() === matricula.toLowerCase().trim()
  );

  if (!student || student.password !== password) {
    throw new Error("Matrícula ou senha inválidos.");
  }

  const token = `token-${student.id}-${Date.now()}`;
  activeSessions.set(token, student.id);

  return { ...sanitizeUser(student), token };
}

export async function requestPasswordReset(email) {
  await delay(500);

  if (!email) {
    throw new Error("Informe um e-mail válido.");
  }

  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (!exists) {
    throw new Error("E-mail não cadastrado.");
  }

  return { success: true };
}

const requireSession = (token) => {
  if (!token) {
    throw new Error("Sessão inválida. Faça login novamente.");
  }
  const userId = activeSessions.get(token);
  if (!userId) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  const user = users.find((item) => item.id === userId);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }
  return user;
};

export async function updateProfile({ token, name, email }) {
  await delay();
  const user = requireSession(token);

  if (!name || !email) {
    throw new Error("Informe nome e e-mail válidos.");
  }

  user.name = name;
  user.email = email;

  return sanitizeUser(user);
}

export async function fetchProfile({ token }) {
  await delay(400);
  const user = requireSession(token);
  return sanitizeUser(user);
}

export async function fetchHomeSummary({ token }) {
  await delay(400);
  const user = requireSession(token);

  return {
    nextClass: {
      title: "Banco de Dados II",
      when: "Hoje às 19h00",
      location: "Sala 304 - Bloco B",
    },
    notices: [
      {
        id: "notice-1",
        title: "Atividade complementar disponível",
        description: "Envie o relatório de estágio até 20/09.",
      },
      {
        id: "notice-2",
        title: "Biblioteca",
        description: "Livros reservados aguardando retirada na recepção.",
      },
    ],
    student: sanitizeUser(user),
  };
}
