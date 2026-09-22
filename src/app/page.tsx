import { ConversationList } from "@/features/conversations/components/conversationList/conversationList";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.inbox}>
      <ConversationList />

      <section className={styles.content}>
        <h1>Customer Support Inbox</h1>
        <p>Select a conversation to view the messages.</p>
      </section>
    </main>
  );
}
