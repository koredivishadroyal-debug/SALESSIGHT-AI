interface NotifyParams {
  subject: string;
  message: string;
  type?: 'Report' | 'Anomaly' | 'System';
}

export async function sendNotification({ subject, message, type = 'System' }: NotifyParams) {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, message, type }),
    });

    if (!response.ok) {
      throw new Error('Failed to send notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Notification service error:', error);
    // We don't throw here to avoid crashing the UI if notifications fail
  }
}
