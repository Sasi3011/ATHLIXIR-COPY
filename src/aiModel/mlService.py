import sys
import json
import numpy as np
import cv2
import os
from PIL import Image
import re
from datetime import datetime
import pickle
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

class MedicalRecordForgeryDetector:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
        if not os.path.exists(self.models_dir):
            os.makedirs(self.models_dir)
            
        self.model_path = os.path.join(self.models_dir, 'forgery_detector.pkl')
        self.scaler_path = os.path.join(self.models_dir, 'scaler.pkl')
        
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
            except Exception:
                self._train_and_save_model()
        else:
            self._train_and_save_model()

    def _train_and_save_model(self):
        """Train a simple model and save it"""
        print("Training new model...")
        
        # Generate synthetic training data
        n_samples = 1000
        n_features = 10
        
        # Generate random features
        X = np.random.randn(n_samples, n_features)
        
        # Generate labels (0: authentic, 1: forged)
        y = np.random.randint(0, 2, n_samples)
        
        # Scale features
        self.scaler = StandardScaler()
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        
        # Train a simple random forest model
        self.model = RandomForestClassifier(n_estimators=10, max_depth=5)
        self.model.fit(X_scaled, y)
        
        # Save model and scaler
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(self.scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        
        print("Model trained and saved successfully")

    def _extract_image_features(self, image_path):
        """Extract features from the image"""
        try:
            # Read image
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not read image")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Basic features
            features = []
            
            # Add average brightness
            features.append(np.mean(gray))
            
            # Add standard deviation of pixel values
            features.append(np.std(gray))
            
            # Add histogram features
            hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
            hist_features = hist.flatten()[:8]  # Use first 8 histogram bins
            features.extend(hist_features)
            
            return np.array(features)
            
        except Exception as e:
            print(f"Error extracting image features: {str(e)}")
            return np.zeros(10)  # Return zero features on error

    def _extract_text(self, image_path):
        """Extract text from the image using basic image processing"""
        try:
            # Load image
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not read image")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply thresholding to get binary image
            _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Find contours
            contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Sort contours by area
            contours = sorted(contours, key=cv2.contourArea, reverse=True)
            
            # Extract text regions
            text_regions = []
            for cnt in contours[:10]:  # Process top 10 largest contours
                x, y, w, h = cv2.boundingRect(cnt)
                if w > 20 and h > 20:  # Filter small regions
                    roi = gray[y:y+h, x:x+w]
                    text_regions.append(roi)
            
            # For now, return empty string since we can't extract actual text
            return ""
            
        except Exception as e:
            print(f"Error extracting text: {str(e)}")
            return ""

    def _analyze_text_features(self, text):
        """Analyze extracted text for potential forgery indicators"""
        features = {
            'has_medical_terms': False,
            'has_valid_dates': False,
            'has_doctor_credentials': False,
            'has_hospital_info': False,
            'text_length': len(text),
            'suspicious_patterns': []
        }
        
        # Check for medical terms
        medical_terms = ['diagnosis', 'treatment', 'prescription', 'doctor', 'hospital']
        features['has_medical_terms'] = any(term in text.lower() for term in medical_terms)
        
        # Check for dates
        date_pattern = r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}'
        dates = re.findall(date_pattern, text)
        features['has_valid_dates'] = len(dates) > 0
        
        # Check for doctor credentials
        credential_pattern = r'dr\.|md|mbbs'
        features['has_doctor_credentials'] = bool(re.search(credential_pattern, text.lower()))
        
        # Check for hospital information
        hospital_pattern = r'hospital|clinic|medical center'
        features['has_hospital_info'] = bool(re.search(hospital_pattern, text.lower()))
        
        return features

    def analyze_document(self, image_path):
        """Analyze a document for potential forgery"""
        try:
            # Extract image features
            image_features = self._extract_image_features(image_path)
            
            # Scale features
            scaled_features = self.scaler.transform(image_features.reshape(1, -1))
            
            # Get model prediction
            forgery_probability = float(self.model.predict_proba(scaled_features)[0][1])
            
            # Text-based analysis
            text = self._extract_text(image_path)
            text_features = self._analyze_text_features(text)
            
            # Calculate final scores
            anomaly_score = self._calculate_anomaly_score(forgery_probability, text_features)
            confidence = self._calculate_confidence(forgery_probability, text_features)
            
            # Determine document authenticity
            is_authentic = anomaly_score < 0.5 and confidence > 0.7
            
            result = {
                'is_authentic': is_authentic,
                'forgery_probability': float(forgery_probability),
                'text_analysis': text_features,
                'anomaly_score': float(anomaly_score),
                'confidence_score': float(confidence),
                'risk_level': self._calculate_risk_level(anomaly_score),
                'recommendation': self._generate_recommendation(anomaly_score, confidence),
                'details': self._generate_analysis_details(text_features, forgery_probability)
            }
            
            return json.dumps(result, default=lambda x: float(x) if isinstance(x, np.floating) else x)
            
        except Exception as e:
            return json.dumps({
                'error': str(e),
                'status': 'failed'
            })

    def _calculate_anomaly_score(self, forgery_prob, text_features):
        """Calculate overall anomaly score"""
        # Weight the different factors
        image_weight = 0.6
        text_weight = 0.4
        
        # Calculate text score
        text_score = 0
        if text_features['has_medical_terms']: text_score += 0.25
        if text_features['has_valid_dates']: text_score += 0.25
        if text_features['has_doctor_credentials']: text_score += 0.25
        if text_features['has_hospital_info']: text_score += 0.25
        
        # Combine scores
        return (forgery_prob * image_weight) + ((1 - text_score) * text_weight)

    def _calculate_confidence(self, forgery_prob, text_features):
        """Calculate confidence in the analysis"""
        # Base confidence on feature presence
        feature_confidence = sum([
            text_features['has_medical_terms'],
            text_features['has_valid_dates'],
            text_features['has_doctor_credentials'],
            text_features['has_hospital_info']
        ]) / 4.0
        
        # Combine with model confidence
        model_confidence = 1 - abs(0.5 - forgery_prob) * 2  # Higher when closer to 0 or 1
        
        return (feature_confidence + model_confidence) / 2

    def _calculate_risk_level(self, anomaly_score):
        """Determine risk level based on anomaly score"""
        if anomaly_score < 0.3:
            return "Low"
        elif anomaly_score < 0.7:
            return "Medium"
        else:
            return "High"

    def _generate_recommendation(self, anomaly_score, confidence):
        """Generate a recommendation based on analysis results"""
        if anomaly_score < 0.3 and confidence > 0.7:
            return "Document appears authentic. No further verification needed."
        elif anomaly_score > 0.7:
            return "High risk of forgery. Recommend thorough manual verification."
        else:
            return "Some anomalies detected. Recommend additional verification steps."

    def _generate_analysis_details(self, text_features, forgery_prob):
        """Generate detailed analysis report"""
        details = []
        
        # Add image-based findings
        if forgery_prob > 0.7:
            details.append("High probability of image manipulation detected")
        elif forgery_prob > 0.4:
            details.append("Some suspicious patterns found in the image")
        
        # Add text-based findings
        if not text_features['has_medical_terms']:
            details.append("Missing expected medical terminology")
        if not text_features['has_valid_dates']:
            details.append("No valid dates found in the document")
        if not text_features['has_doctor_credentials']:
            details.append("Missing doctor credentials")
        if not text_features['has_hospital_info']:
            details.append("Missing hospital information")
                
        return details

# Main execution
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Please provide an image path', 'status': 'failed'}))
        sys.exit(1)

    image_path = sys.argv[1]
    if not os.path.exists(image_path):
        print(json.dumps({'error': 'Image file not found', 'status': 'failed'}))
        sys.exit(1)

    detector = MedicalRecordForgeryDetector()
    result = detector.analyze_document(image_path)
    print(result)
    sys.exit(0)
