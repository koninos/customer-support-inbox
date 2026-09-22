import { ConversationList } from "@/features/conversations/components/conversationList/conversationList";
import { ConversationDetail } from "@/features/conversations/components/conversationDetail/conversationDetail";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.inbox}>
      <ConversationList />
      <ConversationDetail />
    </main>
  );
}
