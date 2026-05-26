import os
import logging
from typing import Dict
from PIL import Image

logger = logging.getLogger(__name__)

class GeminiAnalyzer:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model = None
        self.initialized = False
        self._initialize_gemini()
    
    def _initialize_gemini(self):
        """Initialize Gemini API if available"""
        try:
            if self.api_key and self.api_key != "YOUR_GEMINI_API_KEY_HERE" and self.api_key != "":
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro-vision')
                self.initialized = True
                logger.info("Gemini API initialized successfully")
            else:
                logger.warning("Gemini API key not configured. Using fallback analysis.")
                self.initialized = False
        except ImportError:
            logger.warning("Google Generative AI not installed. Run: pip install google-generativeai")
            self.initialized = False
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")
            self.initialized = False
    
    async def analyze_defect(self, image_path: str, detected_defect: str) -> Dict:
        """
        Analyze defect using Gemini API (if available)
        Returns detailed analysis
        """
        if not self.initialized or self.model is None:
            return self._get_fallback_analysis(detected_defect)
        
        try:
            # Load image
            image = Image.open(image_path)
            
            # Resize for API (max 1MB)
            if image.size[0] > 1024 or image.size[1] > 1024:
                image.thumbnail((1024, 1024))
            
            # Prepare prompt
            prompt = f"""
            Analyze this manufacturing product image for defects.
            Detected defect type: {detected_defect}
            
            Please provide:
            1. Defect classification (confirm or correct the defect type)
            2. Severity level (Low/Medium/High/Critical)
            3. Root cause analysis (possible causes)
            4. Recommended action (reject/rework/accept)
            5. Additional observations
            
            Keep response concise and structured.
            """
            
            # Call Gemini API
            response = self.model.generate_content([prompt, image])
            
            analysis = {
                "analyzed_by": "gemini",
                "analysis_text": response.text if response else "No analysis",
                "confirmed_defect": detected_defect,
                "severity": self._extract_severity(response.text if response else ""),
                "recommendation": self._extract_recommendation(response.text if response else ""),
                "gemini_available": True
            }
            
            logger.info("Gemini analysis completed successfully")
            return analysis
            
        except Exception as e:
            logger.error(f"Gemini analysis failed: {e}")
            return self._get_fallback_analysis(detected_defect)
    
    def _get_fallback_analysis(self, detected_defect: str) -> Dict:
        """Return fallback analysis when Gemini is unavailable"""
        severity_map = {
            "crack": "high",
            "hole": "high", 
            "dent": "medium",
            "scratch": "medium",
            "stain": "low",
            "burr": "low",
            "normal": "none"
        }
        
        return {
            "analyzed_by": "system",
            "analysis_text": f"Defect detected: {detected_defect}. Please perform manual inspection.",
            "confirmed_defect": detected_defect,
            "severity": severity_map.get(detected_defect, "medium"),
            "recommendation": "reject" if detected_defect != "normal" else "accept",
            "gemini_available": False,
            "note": "Gemini API not configured. Install with: pip install google-generativeai"
        }
    
    def _extract_severity(self, text: str) -> str:
        """Extract severity from response"""
        if not text:
            return "medium"
        text_lower = text.lower()
        if "critical" in text_lower:
            return "critical"
        elif "high" in text_lower:
            return "high"
        elif "medium" in text_lower:
            return "medium"
        elif "low" in text_lower:
            return "low"
        return "medium"
    
    def _extract_recommendation(self, text: str) -> str:
        """Extract recommendation from response"""
        if not text:
            return "manual_inspection"
        text_lower = text.lower()
        if "reject" in text_lower:
            return "reject"
        elif "rework" in text_lower:
            return "rework"
        elif "accept" in text_lower:
            return "accept"
        return "manual_inspection"