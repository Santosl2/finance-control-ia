import { users } from "@config/db/schema";
import { env } from "@config/env";
import { UsersRepository } from "@shared/repositories/UsersRepository";
import { Assistant } from "@useCase/Assistant";
import { eq, sql } from "drizzle-orm";
import TelegramBot from "node-telegram-bot-api";

const telegram = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: true });

telegram.onText(/(.+)/, async (msg) => {
  const username = msg.chat.username;
  const message = msg.text;

  if (!message) return;

  const userRepository = new UsersRepository();
  let user = await userRepository
    .find(sql`${users.unique_id} = ${username}`)
    .execute();

  if (!user.length && username) {
    user = await userRepository.create
      .values({
        unique_id: username,
        name: msg.chat.first_name || "Usuário sem nome",
        email: `${msg.chat.id}@telegram.com`,
        password: "password", // Placeholder, should be hashed in a real application
      })
      .returning();
  }

  // TODO: Verify user has access to the assistant
  const waitingMessage = await telegram.sendMessage(
    msg.chat.id,
    "🤑 Processando... "
  );

  try {
    const userId = user[0].id;
    const result = await Assistant({
      userPrompt: `${message} . Meu user ID é ${userId}`,
      userId,
    });

    telegram.editMessageText(result.text, {
      chat_id: msg.chat.id,
      message_id: waitingMessage.message_id,
    });
  } catch (error) {
    console.error(error);
    telegram.editMessageText(
      "Oops, tivemos um problema ao processar sua solicitação. Tente novamente.",
      {
        chat_id: msg.chat.id,
        message_id: waitingMessage.message_id,
      }
    );
  }
});
export { telegram };
