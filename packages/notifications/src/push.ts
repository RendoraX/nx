export async function sendPushNotification(userId: string, title: string, body: string) {
  console.log(`[push] ${userId} :: ${title} :: ${body}`);
  return { success: true, provider: "console" };
}
