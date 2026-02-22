export async function submitEntry(phone: string, network: string) {
  const response = await fetch('/api/giveaway', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, network }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit entry');
  }

  return response.json();
}

export async function getEntries() {
  const response = await fetch('/api/giveaway/entries');
  if (!response.ok) {
    throw new Error('Failed to fetch entries');
  }
  return response.json();
}
