export async function analyzeSymptomsWithModel(symptoms: string): Promise<any[]> {
    try {
        const response = await fetch('/api/diagnose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms }),
        });
  
        if (!response.ok) {
            throw new Error('Failed to analyze symptoms');
        }
  
        return await response.json();
    } catch (error) {
        console.error('Error analyzing symptoms:', error);
        return [];
    }
  }