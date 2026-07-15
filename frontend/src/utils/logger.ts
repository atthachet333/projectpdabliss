export const logUserAction = async (action: string, details: any = {}) => {
  try {
    const response = await fetch('http://localhost:4546/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        details,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.warn('Log submission returned status:', response.status);
    }
  } catch (error) {
    console.error('Failed to send log to backend:', error);
  }
};