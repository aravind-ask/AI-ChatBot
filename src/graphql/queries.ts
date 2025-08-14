import { gql } from "@apollo/client";

export const GET_USER_CHATS = gql`
  query GetUserChats($userId: uuid!) {
    chats(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      id
      title
      created_at
      updated_at
    }
  }
`;

export const INSERT_CHAT = gql`
  mutation InsertChat($userId: uuid!, $title: String!) {
    insert_chats_one(object: { user_id: $userId, title: $title }) {
      id
      title
      created_at
      updated_at
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      created_at
      user_id
      is_bot
      user {
        displayName
        email
      }
    }
  }
`;

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      created_at
      user_id
      is_bot
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage(
    $chatId: uuid!
    $userId: uuid!
    $content: String!
    $isBot: Boolean = false
  ) {
    insert_messages_one(
      object: {
        chat_id: $chatId
        user_id: $userId
        content: $content
        is_bot: $isBot
      }
    ) {
      id
      content
      created_at
      user_id
      is_bot
    }
  }
`;

export const SEND_MESSAGE_TO_BOT = gql`
  mutation SendMessageToBot($chatId: uuid!, $content: String!) {
    sendMessage(chat_id: $chatId, content: $content) {
      id
      content
      created_at
      user_id
      is_bot
    }
  }
`;

export const GET_CHAT_BY_ID = gql`
  query GetChatById($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      title
      created_at
      user_id
    }
  }
`;
