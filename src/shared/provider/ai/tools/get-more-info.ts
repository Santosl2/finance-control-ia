import { db, pg } from '@config/db';
import { tool } from 'ai';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

export const getMoreInfo = () =>
	tool({
		description: `
    Essa ferramenta fornece insights sobre os gastos do usuário, como a categoria mais frequente e a média mensal de despesas.
# Requisitos:
- Gere uma consulta PostgreSQL.
- A categoria precisar ser diferente de 'category', pois essa é uma categoria genérica.
- A resposta deve ser amigável e proativa.
- Informe o nome da categoria + o total gasto + a média de gastos por mês
- Se o usuário quiser saber quanto gastou então o type é 'expense', se quiser saber o quanto entrou então o type é 'income'.

    `.trim(),
		parameters: z.object({
			query: z.string().describe('A query que será executada'),
		}),
		execute: async ({ query }) => {
			console.log(query);
			const result = await pg.unsafe(query);
			return result;
		},
	});
