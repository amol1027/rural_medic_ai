import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, AlertCircle, Info, Camera, Sparkles, CheckCircle2, ImagePlus, X, Video, XCircle, RotateCcw, Languages, FlipHorizontal } from 'lucide-react';

type AnalysisResult = {
  condition: string;
  severity: 'Mild' | 'Moderate' | 'Urgent';
  careSteps: string[];
  disclaimer: string;
};

type CaptureMode = 'upload' | 'camera';
type Language = 'en' | 'hi' | 'mr';

const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  mr: 'मराठी (Marathi)'
};

export default function SkinCheck() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [captureMode, setCaptureMode] = useState<CaptureMode>('upload');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [language, setLanguage] = useState<Language>('en');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera
  const startCamera = async () => {
    setCameraError('');
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      console.log('Camera access granted, stream:', mediaStream);
      setStream(mediaStream);
      
      // Wait a bit and set stream to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log('Video element srcObject set');
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError(err.message || 'Unable to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      console.log('Stopping camera stream');
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Switch between front and back camera
  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Stop current stream and restart with new facing mode
    if (stream) {
      stopCamera();
      // Small delay to ensure stream is fully stopped
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Start camera when mode changes to camera
  useEffect(() => {
    console.log('Mode changed to:', captureMode, 'Stream:', stream);
    if (captureMode === 'camera' && !stream) {
      console.log('Starting camera...');
      startCamera();
    }
  }, [captureMode, stream]);

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob and create file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `skin-check-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImage(file);
          setPreview(canvas.toDataURL('image/jpeg'));
          setResult(null);
          stopCamera();
          setCaptureMode('upload'); // Switch back to upload mode to show preview
        }
      }, 'image/jpeg', 0.92);
    }
  };

  // Handle mode change
  const handleModeChange = (mode: CaptureMode) => {
    setCaptureMode(mode);
    setResult(null);
    
    if (mode === 'upload') {
      stopCamera();
    } else {
      // Clear previous image when switching to camera
      setImage(null);
      setPreview('');
    }
  };

  const changeImage = () => {
    setImage(null);
    setPreview('');
    setResult(null);
    setCaptureMode('upload');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !preview) return;

    setLoading(true);
    setResult(null);

    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiKey) throw new Error('Gemini API key not configured');

      // Extract base64 data and mime type from the data URL
      const [header, base64Data] = preview.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

      // Language-specific prompts
      const languageInstructions = {
        en: `Analyze this skin condition image and provide triage information in JSON format.

Provide:
- condition: Brief description of what you observe (not a diagnosis)
- severity: "Mild", "Moderate", or "Urgent" 
- careSteps: Array of 3-5 immediate care recommendations
- disclaimer: Safety note reminding user to see a healthcare professional

Response must be valid JSON matching this exact structure:
{
  "condition": "string describing observation",
  "severity": "Mild",
  "careSteps": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "disclaimer": "This is not a diagnosis. Consult a healthcare professional."
}`,
        hi: `इस त्वचा की स्थिति की छवि का विश्लेषण करें और JSON प्रारूप में ट्राइएज जानकारी प्रदान करें।

प्रदान करें:
- condition: आप क्या देखते हैं इसका संक्षिप्त विवरण (निदान नहीं)
- severity: "Mild", "Moderate", या "Urgent"
- careSteps: 3-5 तत्काल देखभाल सिफारिशों की सूची (हिंदी में)
- disclaimer: उपयोगकर्ता को स्वास्थ्य पेशेवर से परामर्श करने की याद दिलाने वाला सुरक्षा नोट

प्रतिक्रिया वैध JSON होनी चाहिए जो इस सटीक संरचना से मेल खाती हो:
{
  "condition": "हिंदी में अवलोकन का विवरण",
  "severity": "Mild",
  "careSteps": ["सिफारिश 1", "सिफारिश 2", "सिफारिश 3"],
  "disclaimer": "यह निदान नहीं है। कृपया स्वास्थ्य पेशेवर से परामर्श करें।"
}`,
        mr: `या त्वचेच्या स्थितीच्या प्रतिमेचे विश्लेषण करा आणि JSON स्वरूपात ट्रायज माहिती प्रदान करा।

प्रदान करा:
- condition: आपण काय पाहता त्याचे संक्षिप्त वर्णन (निदान नाही)
- severity: "Mild", "Moderate", किंवा "Urgent"
- careSteps: 3-5 तात्काळ काळजी शिफारशींची यादी (मराठीत)
- disclaimer: वापरकर्त्याला आरोग्य व्यावसायिकाकडे सल्ला घेण्याची आठवण करून देणारी सुरक्षा टीप

प्रतिसाद वैध JSON असावा जो या अचूक संरचनेशी जुळतो:
{
  "condition": "मराठीत निरीक्षणाचे वर्णन",
  "severity": "Mild",
  "careSteps": ["शिफारस 1", "शिफारस 2", "शिफारस 3"],
  "disclaimer": "हे निदान नाही. कृपया आरोग्य व्यावसायिकाचा सल्ला घ्या।"
}`
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: languageInstructions[language]
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              }
            ]
          }],
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                condition: {
                  type: "string",
                  description: "Brief observation of the skin condition"
                },
                severity: {
                  type: "string",
                  enum: ["Mild", "Moderate", "Urgent"]
                },
                careSteps: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 immediate care recommendations"
                },
                disclaimer: {
                  type: "string",
                  description: "Safety disclaimer"
                }
              },
              required: ["condition", "severity", "careSteps", "disclaimer"]
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to analyze image');
      }

      const data = await response.json();
      console.log('Gemini full response:', JSON.stringify(data, null, 2).substring(0, 1000));

      const candidate = data.candidates?.[0];

      // Check if the response was blocked by safety filters
      if (!candidate?.content) {
        const blockReason = candidate?.finishReason || data.promptFeedback?.blockReason || 'unknown';
        console.error('Response blocked:', { candidate, promptFeedback: data.promptFeedback });
        throw new Error(`Response blocked (reason: ${blockReason}). Try a different image.`);
      }

      // Gemini 2.5 Flash returns thinking parts (thought: true) alongside the response.
      // We need only the non-thought text part which contains our JSON.
      const parts = candidate.content.parts || [];
      console.log('Response parts count:', parts.length);
      console.log('Response parts:', parts.map((p: any, idx: number) => ({ 
        index: idx,
        thought: p.thought, 
        hasText: !!p.text, 
        textLength: p.text?.length || 0,
        textPreview: p.text?.substring(0, 100) 
      })));

      let text = '';

      // Priority 1: Concatenate all non-thought text parts
      for (const part of parts) {
        if (part.text && !part.thought) {
          console.log('Adding non-thought part, length:', part.text.length);
          text += part.text;
        }
      }
      // Priority 2: If no non-thought text, concatenate all text parts
      if (!text) {
        console.log('No non-thought parts found, using all text parts');
        for (const part of parts) {
          if (part.text) {
            console.log('Adding any text part, length:', part.text.length);
            text += part.text;
          }
        }
      }

      if (!text) {
        console.error('No text found in any part. Parts:', JSON.stringify(parts));
        throw new Error('Empty response from AI. Please try again.');
      }

      console.log('Total extracted text length:', text.length);
      console.log('Extracted text:', text.substring(0, 300));

      // Clean: trim whitespace and BOM only (don't remove newlines as they may be in JSON strings)
      text = text.trim().replace(/^\uFEFF/, '');

      let parsed = null;

      // Step 1: Strip markdown code fences if present
      const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
      if (fenceMatch) {
        text = fenceMatch[1].trim();
      }

      // Step 2: Try direct JSON parse
      try {
        parsed = JSON.parse(text);
        console.log('Successfully parsed JSON:', parsed);
      } catch (firstError) {
        console.error('Direct parse failed:', firstError);
        console.error('Text length:', text.length, 'First 200 chars:', text.substring(0, 200));
        
        // Step 3: Extract the JSON object substring
        const startIdx = text.indexOf('{');
        const endIdx = text.lastIndexOf('}');
        if (startIdx !== -1 && endIdx > startIdx) {
          const jsonStr = text.substring(startIdx, endIdx + 1);
          console.error('Attempting to parse extracted JSON. Length:', jsonStr.length);
          try {
            parsed = JSON.parse(jsonStr);
            console.log('Parsed extracted JSON:', parsed);
          } catch (secondError) {
            console.error('JSON extraction failed:', secondError);
            console.error('Extracted JSON (first 300):', jsonStr.substring(0, 300));
            console.error('Extracted JSON (last 300):', jsonStr.substring(Math.max(0, jsonStr.length - 300)));
          }
        } else {
          console.error('Could not find JSON boundaries. startIdx:', startIdx, 'endIdx:', endIdx);
        }
      }

      console.error('Final parsed result:', parsed);

      // Validate and use parsed result
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        console.log('Validation passed, extracting fields...');
        
        // Extract fields with defaults
        const condition = parsed.condition || parsed.Condition || 'Unable to determine condition';
        const severity = ['Mild', 'Moderate', 'Urgent'].includes(parsed.severity) 
          ? parsed.severity 
          : (['Mild', 'Moderate', 'Urgent'].includes(parsed.Severity) ? parsed.Severity : 'Moderate');
        const careSteps = Array.isArray(parsed.careSteps) 
          ? parsed.careSteps 
          : (Array.isArray(parsed.CareSteps) 
            ? parsed.CareSteps 
            : (typeof parsed.careSteps === 'string' 
              ? [parsed.careSteps] 
              : ['Keep the area clean', 'Avoid touching or scratching', 'Consult a healthcare professional']));
        const disclaimer = parsed.disclaimer || parsed.Disclaimer || 'This is NOT a medical diagnosis. Please consult a qualified healthcare professional.';

        console.log('Extracted:', { condition, severity, careSteps, disclaimer });

        setResult({
          condition,
          severity: severity as 'Mild' | 'Moderate' | 'Urgent',
          careSteps,
          disclaimer
        });
      } else {
        console.error('Validation failed!');
        console.error('parsed is:', parsed);
        console.error('typeof parsed:', typeof parsed);
        console.error('is array?', Array.isArray(parsed));
        console.error('Raw text (first 500 chars):', text.substring(0, 500));
        throw new Error(`Invalid AI response format. Type: ${typeof parsed}, IsArray: ${Array.isArray(parsed)}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error?.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/30 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 md:py-5 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg shadow-purple-500/25 flex-shrink-0">
              <Camera className="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-bold text-slate-800 truncate">Skin Analysis</h2>
              <p className="text-slate-500 text-[10px] md:text-xs mt-0.5 flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span className="truncate">AI-powered assessment</span>
              </p>
            </div>
          </div>
          {result && (
            <button
              onClick={changeImage}
              className="hidden sm:flex items-center space-x-2 px-3 md:px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 text-purple-700 rounded-lg md:rounded-xl transition-all text-xs md:text-sm font-semibold active:scale-95"
            >
              <RotateCcw className="w-3.5 md:w-4 h-3.5 md:h-4" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4 md:space-y-6">
        {/* Language Selector */}
        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
                <Languages className="w-4 md:w-5 h-4 md:h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xs md:text-sm">Language / भाषा / भाषा</h3>
                <p className="text-slate-500 text-[10px] md:text-xs">Select response language</p>
              </div>
            </div>
            <div className="flex gap-1.5 md:gap-2 p-1 bg-slate-100 rounded-lg">
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as Language)}
                  className={`px-2.5 md:px-3 py-1.5 md:py-2 rounded-md font-semibold text-[10px] md:text-xs transition-all ${
                    language === code
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  title={name}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 rounded-xl md:rounded-2xl p-4 md:p-5 flex items-start space-x-3 md:space-x-4 shadow-sm animate-fade-in">
          <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg md:rounded-xl shrink-0">
            <Info className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-blue-900 text-xs md:text-sm">
              {language === 'hi' ? 'महत्वपूर्ण अस्वीकरण' : language === 'mr' ? 'महत्त्वाचा अस्वीकरण' : 'Important Disclaimer'}
            </h3>
            <p className="text-blue-700 text-xs md:text-sm leading-relaxed">
              {language === 'hi' 
                ? 'यह उपकरण केवल शैक्षिक जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है। निदान और उपचार के लिए हमेशा एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें।'
                : language === 'mr'
                ? 'हे साधन केवळ शैक्षणिक माहिती प्रदान करते आणि व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही. निदान आणि उपचारासाठी नेहमी पात्र आरोग्य सेवा प्रदात्याचा सल्ला घ्या।'
                : 'This tool provides educational information only and is not a substitute for professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Capture Section */}
          <div className="space-y-4 md:space-y-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Mode Toggle */}
            <div className="flex gap-2 md:gap-3 p-1 md:p-1.5 bg-slate-100 rounded-lg md:rounded-xl">
              <button
                onClick={() => handleModeChange('upload')}
                className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center justify-center space-x-1.5 md:space-x-2 ${
                  captureMode === 'upload'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-800 active:bg-white/50'
                }`}
              >
                <Upload className="w-3.5 md:w-4 h-3.5 md:h-4" />
                <span>Upload</span>
              </button>
              <button
                onClick={() => handleModeChange('camera')}
                className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg font-semibold text-xs md:text-sm transition-all flex items-center justify-center space-x-1.5 md:space-x-2 ${
                  captureMode === 'camera'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-800 active:bg-white/50'
                }`}
              >
                <Camera className="w-3.5 md:w-4 h-3.5 md:h-4" />
                <span>Camera</span>
              </button>
            </div>

            {/* Camera Mode */}
            {captureMode === 'camera' && (
              <div className="space-y-3 md:space-y-4">
                <div className="relative border-2 border-purple-300 rounded-xl md:rounded-2xl overflow-hidden bg-black aspect-video">
                  {stream ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 md:top-4 right-3 md:right-4">
                        <button
                          onClick={switchCamera}
                          className="p-2.5 md:p-3 bg-white/90 hover:bg-white text-purple-600 rounded-full shadow-lg transition-all active:scale-95 backdrop-blur-sm"
                          title="Switch Camera"
                        >
                          <FlipHorizontal className="w-4 md:w-5 h-4 md:h-5" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 md:bottom-4 left-0 right-0 flex justify-center gap-2 md:gap-3 px-3">
                        <button
                          onClick={capturePhoto}
                          className="px-4 md:px-6 py-2.5 md:py-3 bg-white hover:bg-purple-50 text-purple-600 rounded-full font-bold shadow-lg flex items-center space-x-2 transition-all active:scale-95 text-sm md:text-base"
                        >
                          <Camera className="w-4 md:w-5 h-4 md:h-5" />
                          <span className="hidden sm:inline">Capture Photo</span>
                          <span className="sm:hidden">Capture</span>
                        </button>
                        <button
                          onClick={stopCamera}
                          className="p-2.5 md:p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all active:scale-95"
                          title="Stop Camera"
                        >
                          <XCircle className="w-4 md:w-5 h-4 md:h-5" />
                        </button>
                      </div>
                    </>
                  ) : cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center">
                      <AlertCircle className="w-10 md:w-12 h-10 md:h-12 text-red-400 mb-2 md:mb-3" />
                      <p className="text-red-400 text-xs md:text-sm mb-3 md:mb-4">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="px-4 md:px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold text-xs md:text-sm transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6">
                      <div className="w-12 md:w-16 h-12 md:h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 md:mb-4">
                        <Video className="w-6 md:w-8 h-6 md:h-8 text-purple-300" />
                      </div>
                      <p className="text-slate-300 text-xs md:text-sm">Initializing camera...</p>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Upload Mode */}
            {captureMode === 'upload' && (
              <div className={`
                border-2 border-dashed rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all duration-300 relative overflow-hidden group
                ${ preview 
                  ? 'border-purple-300 bg-purple-50/50' 
                  : 'border-slate-300 bg-white hover:border-purple-400 hover:bg-purple-50/20 active:bg-purple-50/30'
                }
              `}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {preview ? (
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-[300px] md:max-h-[400px] w-full object-contain rounded-lg md:rounded-xl shadow-md"
                    />
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                          setPreview('');
                          setResult(null);
                        }}
                        className="p-2 md:p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all active:scale-95"
                        title="Remove image"
                      >
                        <X className="w-4 md:w-4.5 h-4 md:h-4.5" />
                      </button>
                    </div>
                    {/* Desktop hover overlay */}
                    <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl items-end justify-center pb-4 pointer-events-none">
                      <div className="bg-white/95 backdrop-blur text-slate-700 px-4 py-2 rounded-full font-medium text-sm shadow-lg flex items-center space-x-2">
                        <ImagePlus className="w-4 h-4" />
                        <span>Click to change image</span>
                      </div>
                    </div>
                    {/* Mobile label */}
                    <div className="md:hidden absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur text-slate-700 px-3 py-2 rounded-lg font-medium text-xs shadow-lg text-center flex items-center justify-center space-x-1.5">
                      <ImagePlus className="w-3.5 h-3.5" />
                      <span>Tap to change image</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 md:py-6">
                    <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <Upload className="w-8 md:w-10 h-8 md:h-10 text-purple-500" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1.5 md:mb-2">Upload Photo</h3>
                    <p className="text-slate-500 mb-4 md:mb-5 max-w-xs mx-auto text-xs md:text-sm">
                      <span className="hidden sm:inline">Drag and drop your image here, or click to browse</span>
                      <span className="sm:hidden">Tap to select an image</span>
                    </p>
                    <div className="flex items-center justify-center space-x-3 md:space-x-4 text-[10px] md:text-xs text-slate-400">
                      <span className="flex items-center space-x-1"><CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-500" /><span>JPG, PNG</span></span>
                      <span className="flex items-center space-x-1"><CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-500" /><span>Max 5MB</span></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!image || loading || !!result}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : result ? (
                <>
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5" />
                  <span>Analysis Complete</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 md:w-5 h-4 md:h-5" />
                  <span>Analyze Image</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="md:pl-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {result ? (
              <div className="space-y-4 md:space-y-5">
                {/* Change Image Button - Prominent placement at top */}
                <button
                  onClick={changeImage}
                  className="w-full py-3 md:py-3.5 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-purple-100 hover:to-purple-200 border-2 border-slate-300 hover:border-purple-400 text-slate-700 hover:text-purple-700 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 active:scale-[0.98] text-sm md:text-base shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="w-4 md:w-5 h-4 md:h-5" />
                  <span>Analyze Another Image</span>
                </button>

                {/* Results Card */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 animate-scale-in">
                {/* Severity Header */}
                <div className={`
                  px-4 md:px-6 py-4 md:py-5 border-b flex items-center justify-between
                  ${result.severity === 'Urgent' ? 'bg-gradient-to-r from-red-50 to-red-100/50 border-red-100' : 
                    result.severity === 'Moderate' ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-100' : 
                    'bg-gradient-to-r from-green-50 to-emerald-100/50 border-green-100'}
                `}>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">Assessment Severity</p>
                    <h3 className={`text-lg md:text-xl font-bold ${
                      result.severity === 'Urgent' ? 'text-red-700' : 
                      result.severity === 'Moderate' ? 'text-amber-700' : 
                      'text-green-700'}
                    `}>{result.severity}</h3>
                  </div>
                  <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${
                     result.severity === 'Urgent' ? 'bg-red-100 text-red-600' : 
                     result.severity === 'Moderate' ? 'bg-amber-100 text-amber-600' : 
                     'bg-green-100 text-green-600'
                  }`}>
                    <AlertCircle className="w-5 md:w-7 h-5 md:h-7" />
                  </div>
                </div>

                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  {/* Condition */}
                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">Observation</h4>
                    <p className="text-slate-800 font-medium leading-relaxed text-sm md:text-base">{result.condition}</p>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Care Steps */}
                  <div>
                    <h4 className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 md:mb-3">Recommended Actions</h4>
                    <div className="space-y-2 md:space-y-2.5">
                      {result.careSteps.map((step, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start space-x-2 md:space-x-3 p-3 md:p-3.5 rounded-lg md:rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200 animate-fade-in"
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] md:text-xs shrink-0 mt-0.5 shadow-sm">
                            {idx + 1}
                          </div>
                          <p className="text-slate-700 text-xs md:text-sm leading-relaxed flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Disclaimer Footer */}
                  {result.disclaimer && (
                     <div className="text-[10px] md:text-xs text-slate-500 text-center pt-2 md:pt-3 italic bg-gradient-to-b from-transparent to-slate-50 -mx-4 md:-mx-6 -mb-4 md:-mb-6 px-4 md:px-6 py-4 md:py-5 border-t border-slate-100 leading-relaxed">
                        <AlertCircle className="w-3.5 md:w-4 h-3.5 md:h-4 inline-block mr-1 md:mr-1.5 text-slate-400" />
                        {result.disclaimer}
                     </div>
                  )}
                </div>
              </div>
              </div>
            ) : loading ? (
              <div className="h-full min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="relative">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-pulse">
                    <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-purple-400" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin"></div>
                </div>
                <p className="text-slate-700 font-semibold mb-1 text-sm md:text-base">Analyzing image...</p>
                <p className="text-slate-400 text-xs md:text-sm">This may take a few moments</p>
              </div>
            ) : (
              <div className="h-full min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl bg-gradient-to-br from-slate-50/50 to-white p-6 md:p-8">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-5 shadow-sm">
                  <Camera className="w-8 md:w-10 h-8 md:h-10 text-slate-300" />
                </div>
                <p className="text-center font-semibold text-slate-600 mb-1 md:mb-1.5 text-sm md:text-base">No Analysis Yet</p>
                <p className="text-center text-xs md:text-sm text-slate-400 max-w-xs">
                  {captureMode === 'camera' 
                    ? 'Capture a photo to see AI-powered analysis results' 
                    : 'Upload or capture an image to see analysis results'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
