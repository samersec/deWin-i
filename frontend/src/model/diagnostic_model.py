class DiagnosticModel:
    def __init__(self):
        # Mapping of symptoms to their variations (including English)
        self.symptoms_mapping = {
            'headache': ['maux de tête', 'migraine', 'céphalée', 'mal à la tête', 'headache'],
            'fever': ['fièvre', 'température élevée', 'hyperthermie', 'chaud', 'température', 'fever'],
            'cough': ['toux', 'toux sèche', 'toux grasse', 'tousser', 'cough'],
            'fatigue': ['fatigue', 'épuisement', 'faiblesse', 'fatigué', 'épuisé', 'fatigue'],
            'dizziness': ['vertiges', 'étourdissements', 'vertige', 'étourdi', 'dizziness'],
            'nausea': ['nausée', 'envie de vomir', 'mal au coeur', 'vomissement', 'nausea'],
            'chest_pain': ['douleur thoracique', 'douleur poitrine', 'mal à la poitrine', 'chest pain'],
            'shortness_of_breath': ['essoufflement', 'difficulté à respirer', 'souffle court', 'shortness of breath'],
            'sore_throat': ['mal à la gorge', 'gorge irritée', 'pharyngite', 'sore throat'],
            'runny_nose': ['nez qui coule', 'rhinorrhée', 'écoulement nasal', 'runny nose'],
            'muscle_pain': ['douleurs musculaires', 'courbatures', 'mal aux muscles', 'muscle pain'],
            'joint_pain': ['douleurs articulaires', 'mal aux articulations', 'joint pain'],
            'chills': ['frissons', 'tremblements', 'froid', 'chills'],
            'loss_of_appetite': ['perte d\'appétit', 'manque d\'appétit', 'loss of appetite'],
            'stomach_pain': ['mal au ventre', 'douleur abdominale', 'crampes', 'stomach pain']
        }

        # Conditions and their associated symptoms, weights, and minimum scores
        self.conditions = {
            'Hypertension': {
                'symptoms': ['headache', 'dizziness', 'chest_pain'],
                'weights': [0.3, 0.3, 0.4],
                'min_score': 0.5
            },
            'Infection Respiratoire': {
                'symptoms': ['fever', 'cough', 'fatigue', 'sore_throat', 'runny_nose'],
                'weights': [0.3, 0.3, 0.2, 0.1, 0.1],
                'min_score': 0.4
            },
            'Migraine': {
                'symptoms': ['headache', 'nausea', 'dizziness', 'fatigue'],
                'weights': [0.4, 0.2, 0.2, 0.2],
                'min_score': 0.6
            },
            'Pneumonie': {
                'symptoms': ['fever', 'cough', 'shortness_of_breath', 'chest_pain', 'fatigue'],
                'weights': [0.25, 0.25, 0.25, 0.15, 0.1],
                'min_score': 0.5
            },
            'Grippe': {
                'symptoms': ['fever', 'fatigue', 'muscle_pain', 'headache', 'cough'],
                'weights': [0.3, 0.2, 0.2, 0.15, 0.15],
                'min_score': 0.4
            },
            'Gastro-entérite': {
                'symptoms': ['nausea', 'stomach_pain', 'fever', 'fatigue', 'loss_of_appetite'],
                'weights': [0.3, 0.3, 0.15, 0.15, 0.1],
                'min_score': 0.4
            }
        }

    def normalize_symptom(self, symptom):
        """
        Normalize a symptom to its internal key.
        """
        symptom = symptom.lower().strip()
        # Check for exact match in variations
        for key, variations in self.symptoms_mapping.items():
            if symptom in variations:
                return key
        return None

    def calculate_condition_score(self, symptoms, condition_data):
        """
        Calculate the score for a condition based on matched symptoms and their weights.
        """
        score = 0
        matched_symptoms = 0
        for symptom, weight in zip(condition_data['symptoms'], condition_data['weights']):
            if symptom in symptoms:
                score += weight
                matched_symptoms += 1
        # Bonus for matching multiple symptoms
        if matched_symptoms >= 3:
            score *= 1.2
        return score

    def diagnose(self, symptoms_text):
        """
        Diagnose conditions based on input symptoms.
        """
        # Clean and split input symptoms
        symptoms_list = [s.strip() for s in symptoms_text.lower().split(',')]
        normalized_symptoms = set()
        
        # Normalize symptoms
        for symptom in symptoms_list:
            norm_symptom = self.normalize_symptom(symptom)
            if norm_symptom:
                normalized_symptoms.add(norm_symptom)

        # Calculate scores for each condition
        results = []
        for condition, data in self.conditions.items():
            score = self.calculate_condition_score(normalized_symptoms, data)
            if score >= data['min_score']:
                confidence = int(score * 100)
                urgency = self._determine_urgency(condition, confidence, normalized_symptoms)
                results.append({
                    'condition': condition,
                    'confidence': min(confidence, 95),  # Cap confidence at 95%
                    'urgency': urgency,
                    'matched_symptoms': len(normalized_symptoms)
                })

        # Sort by confidence
        results.sort(key=lambda x: x['confidence'], reverse=True)
        return results[:3]  # Return top 3 matches

    def _determine_urgency(self, condition, confidence, symptoms):
        """
        Determine the urgency level based on condition and symptoms.
        """
        # Define high-risk symptoms
        high_risk_symptoms = {'chest_pain', 'shortness_of_breath'}
        # Check for high-risk symptoms
        if any(symptom in high_risk_symptoms for symptom in symptoms):
            return 'high'
        # Consider confidence level
        if confidence > 80:
            return 'high'
        elif confidence > 60:
            return 'moderate'
        return 'low'


# Example usage
model = DiagnosticModel()
symptoms_input = "fever, fatigue, muscle_pain, headache, cough"
diagnosis_results = model.diagnose(symptoms_input)

if diagnosis_results:
    print("Résultats de l'Analyse")
    print(f"Basé sur les symptômes: {symptoms_input}")
    for result in diagnosis_results:
        print(f"Possible diagnosis: {result['condition']} (Confidence: {result['confidence']}%, Urgency: {result['urgency']})")
else:
    print("Aucun diagnostic possible avec les symptômes fournis. Veuillez fournir plus de détails ou consulter directement un médecin.")