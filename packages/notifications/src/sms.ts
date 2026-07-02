export async function sendSmsNotification(to: string, message: string) {
  console.log(`[sms] ${to} :: ${message}`);
  return { success: true, provider: "console" };
}
