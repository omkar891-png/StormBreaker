import os
import json
import numpy as np
from deepface import DeepFace
from typing import Dict, Union, Tuple

class FaceRecognitionModule:
    def __init__(self, embeddings_file: str = "embeddings/students.json", model_name: str = "VGG-Face", distance_metric: str = "cosine"):
        self.embeddings_file = embeddings_file
        self.model_name = model_name
        self.distance_metric = distance_metric
        self.thresholds = {
            "VGG-Face": {"cosine": 0.40, "euclidean": 0.60, "euclidean_l2": 0.86},
            "Facenet": {"cosine": 0.40, "euclidean": 10, "euclidean_l2": 0.80},
            "Facenet512": {"cosine": 0.30, "euclidean": 23.56, "euclidean_l2": 1.04},
            "ArcFace": {"cosine": 0.68, "euclidean": 4.15, "euclidean_l2": 1.13}
        }
        self.threshold = self.thresholds.get(model_name, {}).get(distance_metric, 0.40)
        self.embeddings = self._load_embeddings()

    def _load_embeddings(self) -> Dict:
        if os.path.exists(self.embeddings_file):
            try:
                with open(self.embeddings_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                return {}
        return {}

    def _save_embeddings(self):
        with open(self.embeddings_file, 'w') as f:
            json.dump(self.embeddings, f, indent=4)

    def generate_embedding(self, img_path: str) -> Union[list, None]:
        """
        Generates embedding for a given image path.
        Returns the embedding list or raises an exception if face is not found.
        """
        try:
            # DeepFace.represent returns a list of dicts. We assume 1 face per image for registration.
            results = DeepFace.represent(
                img_path=img_path,
                model_name=self.model_name,
                enforce_detection=True,
                detector_backend="opencv"
            )
            
            if not results:
                raise ValueError("No face detected in the image.")
            
            if len(results) > 1:
                # We can handle this by taking the largest face or raising error
                # For strict registration, raising error is safer
                raise ValueError(f"Multiple faces ({len(results)}) detected. Please provide an image with a single clear face.")

            return results[0]["embedding"]
        except Exception as e:
            raise e

    def register_student(self, student_id: str, img_path: str) -> Dict:
        try:
            embedding = self.generate_embedding(img_path)
            
            self.embeddings[student_id] = {
                "embedding": embedding,
                "registered_image": img_path
            }
            self._save_embeddings()
            
            return {
                "status": "success",
                "message": f"Student {student_id} registered successfully.",
                "student_id": student_id
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def verify_student(self, claimed_student_id: str, img_path: str) -> Dict:
        if claimed_student_id not in self.embeddings:
            return {
                "status": "error",
                "message": "Student ID not found in database.",
                "match": False
            }

        try:
            target_embedding = self.embeddings[claimed_student_id]["embedding"]
            captured_embedding = self.generate_embedding(img_path)
            
            distance = self._calculate_distance(target_embedding, captured_embedding)
            match = distance <= self.threshold
            
            # Confidence score calculation (inverse of distance roughly)
            # A distance of 0 is 100% match. A distance of threshold is "just matched".
            # We can normalize it: max(0, (threshold - distance) / threshold) ? 
            # Or just return distance. Let's return a simple percentage-like score based on threshold.
            
            confidence = 0.0
            if distance <= self.threshold:
                 # Linear interpolation from threshold (0%) to 0 (100%)
                 confidence = (1 - (distance / self.threshold)) * 100
                 confidence = max(0, min(100, confidence)) # Clamp
            
            reason = "Face matched" if match else "Face mismatch - proxy attempt"
            
            return {
                "status": "success",
                "match": bool(match),
                "confidence_score": round(confidence, 2),
                "distance": float(distance),
                "threshold": self.threshold,
                "reason": reason,
                "student_id": claimed_student_id
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "match": False
            }
            
    def _calculate_distance(self, embedding1, embedding2):
        if self.distance_metric == 'cosine':
            a = np.array(embedding1)
            b = np.array(embedding2)
            denom = (np.linalg.norm(a) * np.linalg.norm(b))
            if denom == 0:
                return 1.0 # Max distance
            return 1 - (np.dot(a, b) / denom)
        elif self.distance_metric == 'euclidean':
            a = np.array(embedding1)
            b = np.array(embedding2)
            return np.linalg.norm(a - b)
        else:
             raise ValueError("Unsupported metric")
