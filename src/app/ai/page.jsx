"use client"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, AudioWaveformIcon as Waveform, User, Bot } from "lucide-react"
import Link from "next/link"

const Page = () => {
  const RecognizeRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [conversation, setConversation] = useState([])
  const [question, setQuestion] = useState("")
  const [userName, setUserName] = useState("")
  const [hasUserName, setHasUserName] = useState(false);
  const refScroll = useRef(null);
  // Reference to track if voices have been loaded
  const voicesLoaded = useRef(false);
  // Store available voices
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(()=>{
    setTimeout(()=>{
        refScroll.current?.scrollIntoView({scroll: "smooth"});
    }, [])
  }, [conversation])

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        voicesLoaded.current = true;
        // console.log("Voices loaded:", voices.length);
        // Log available female voices for debugging
        const femaleVoices = voices.filter(voice => 
          voice.name.toLowerCase().includes("female") || 
          voice.name.includes("Samantha") ||
          voice.name.includes("Victoria") ||
          voice.name.includes("Karen") ||
          voice.name.includes("Moira") ||
          voice.name.includes("Tessa") ||
          voice.name.includes("Ava") ||
          voice.name.includes("Allison")
        );
        // console.log("Female voices found:", femaleVoices.map(v => v.name));
      }
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Try to load voices immediately
      loadVoices();
      
      // Also set up the event listener for Chrome
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Cleanup
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  useEffect(() => {
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new recognition()
    rec.onstart = () => {
      setIsListening(true)
    //   console.log("Speech started")
    }

    rec.onresult = async (event) => {
    //   console.log(event)
      const transcript = event.results[0][0].transcript
    //   console.log("Transcript is: ", transcript)
      setQuestion(transcript)
      setConversation((prev) => [...prev, transcript])
      await CallAiGirlfriend(transcript)
    }

    rec.onend = () => {
    //   console.log("Listening stops")
      setIsListening(false)
    }

    RecognizeRef.current = rec
  }, []);

  const speakText = (text) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;
      
      // Get the current voices (either from state or fresh)
      const voices = availableVoices.length > 0 ? 
                    availableVoices : 
                    window.speechSynthesis.getVoices();
      
      // Find a female voice
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes("female") || 
        voice.name.includes("Samantha") ||
        voice.name.includes("Victoria") ||
        voice.name.includes("Karen") ||
        voice.name.includes("Moira") ||
        voice.name.includes("Tessa") ||
        voice.name.includes("Ava") ||
        voice.name.includes("Allison")
      );
      
      if (femaleVoice) {
        // console.log("Using female voice:", femaleVoice.name);
        utterance.voice = femaleVoice;
      } else if (voices.length > 0) {
        // console.log("No female voice found, using:", voices[0].name);
        utterance.voice = voices[0];
      } else {
        // console.log("No voices available");
      }
      
      // Log the text that will be spoken
    //   console.log("Speaking text:", text.substring(0, 50) + "...");
      
      // Actually speak the text
      window.speechSynthesis.speak(utterance);
    } else {
    //   console.error("Speech Synthesis not supported in this browser.");
    }
  };

  const handleStart = () => {
    RecognizeRef.current.start()
  }

  const handleStop = () => {
    RecognizeRef.current.stop()
  }

  const CallAiGirlfriend = async (query) => {
    try {
      const res = await axios.post("/api/gemini", {
        prompt: query || question,
        name: userName
      })
      if (res.data.status === false) {
        throw new Error(res.data.error)
      }

      setConversation((prev) => [...prev, res.data.text])
      speakText(res.data.text)
    } catch (error) {
    //   console.log(error)
    } finally {
      setQuestion("")
      return
    }
  }

  const handleGetStarted = () => {
    if (userName.trim()) {
      setHasUserName(true);
    }
  }
  
  const handlePress = (e) =>{
    if(e.key === "Enter"){
        handleGetStarted();
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      {!hasUserName ? (
        <div className="max-w-md w-full mx-auto rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-xl overflow-hidden border border-gray-700 p-8">
          <div className="text-center mb-6">
            <h1 className="text-white text-2xl font-bold mb-2">Hii Sweetie</h1>
            <p className="text-gray-300">Please enter your name to get started</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="username"
                 onKeyDown={handlePress}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your name"
              />
            </div>

            <button
            onClick={handleGetStarted}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl w-full mx-auto rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-xl overflow-hidden border border-gray-700">
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <h1 className="text-white text-xl font-bold text-center">Hello, {userName} baby!</h1>
          </div>

          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-lg"
                onClick={handleStart}
              >
                <Mic className="w-5 h-5" />
                <span>Start Speaking</span>
              </button>

              <button
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-lg"
                onClick={handleStop}
              >
                <MicOff className="w-5 h-5" />
                <span>Stop Speaking</span>
              </button>
            </div>

            {isListening && (
              <div className="flex items-center gap-2 text-emerald-400 font-medium animate-pulse">
                <Waveform className="w-5 h-5" />
                <span>Listening...</span>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      style={{
                        animation: `bounce 1.4s infinite ease-in-out both`,
                        animationDelay: `${i * 0.16}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-900/50 example max-h-[60vh] overflow-y-auto">
            <div className="space-y-4 example">
              {conversation.map((msg, index) => (
                <div
                ref={index === conversation.length - 1 ? refScroll : null}
                  key={index}
                  className={`flex items-start gap-3 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  {index % 2 === 0 && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                         <img src="/boy.jpg" className="w-full h-full rounded-full" alt="profile" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      index % 2 === 0
                        ? "bg-indigo-600 text-white rounded-tl-none"
                        : "bg-gray-700 text-gray-100 rounded-tr-none"
                    }`}
                  >
                    {msg}
                  </div>
                  {index % 2 !== 0 && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <img src="/girl.jpeg" className="w-full h-full rounded-full" alt="profile" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="text-xs text-gray-400 text-center">
              {isListening
                ? "Speak clearly into your microphone..."
                : "Press 'Start Speaking' to begin voice recognition"}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>

      <div className="text-center mt-5 text-blue-500 hover:cursor-pointer underline"  ><Link href="https://utkrsh-singh.vercel.app/" target="_blank">Builder</Link></div>
    </div>
  )
}

export default Page