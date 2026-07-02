export async function sendEmailNotification(to: string, title: string, message: string) {
  console.log(`[email] ${to} :: ${title} :: ${message}`);
  return { success: true, provider: "console" };
}
