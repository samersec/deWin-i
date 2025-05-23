import { useState, useRef } from 'react';
import { Calendar, Clock, AlertCircle, Mic, Square, ChevronDown, ChevronUp } from 'lucide-react';

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expandedPatient, setExpandedPatient] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ [key: number]: string }>({});
  const [transcripts, setTranscripts] = useState<{ [key: number]: string }>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const appointments = [
    {
      id: 1,
      patientName: 'Ahmed Ben Salem',
      date: '2024-02-21',
      time: '09:00',
      duration: '30min',
      type: 'Consultation',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'Sarah Mansour',
      date: '2024-02-21',
      time: '10:00',
      duration: '45min',
      type: 'Suivi',
      status: 'pending'
    },
    {
      id: 3,
      patientName: 'Mohamed Karray',
      date: '2024-02-21',
      time: '11:00',
      duration: '30min',
      type: 'Consultation',
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const togglePatientExpand = (id: number) => {
    setExpandedPatient(expandedPatient === id ? null : id);
  };

  const startRecording = async (patientId: number) => {
    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
  
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings(prev => ({ ...prev, [patientId]: audioUrl }));
        stream.getTracks().forEach(track => track.stop());
      };
  
      mediaRecorder.start();
  
      // Start speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition; // Assign the recognition instance to the ref
  
        recognition.lang = 'fr-FR'; // Set language to French
        recognition.continuous = true;
        recognition.interimResults = true;
  
        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }
  
          if (finalTranscript) {
            setTranscripts(prev => ({
              ...prev,
              [patientId]: (prev[patientId] || '') + finalTranscript
            }));
          }
        };
  
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };
  
        recognition.start();
      }
  
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Rendez-vous</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="date"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Nouveau Rendez-vous
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div>
                    <button
                      onClick={() => togglePatientExpand(appointment.id)}
                      className="text-lg font-medium text-gray-900 flex items-center gap-2 hover:text-indigo-600"
                    >
                      {appointment.patientName}
                      {expandedPatient === appointment.id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </button>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time} ({appointment.duration})
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                </span>
              </div>

              {expandedPatient === appointment.id && (
                <div className="mt-4 space-y-4">
                  <div className="flex space-x-3">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      Modifier
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-800">
                      Annuler
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800">
                      Voir dossier patient
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Consultation</h4>
                      
                      <div className="space-y-3">
                        {!isRecording ? (
                          <button
                            onClick={() => startRecording(appointment.id)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            <Mic className="h-5 w-5 mr-2" />
                            Démarrer une consultation
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Square className="h-5 w-5 mr-2" />
                            Arrêter l'enregistrement
                          </button>
                        )}

                        {recordings[appointment.id] && (
                          <div className="mt-3">
                            <audio
                              src={recordings[appointment.id]}
                              controls
                              className="w-full"
                            />
                          </div>
                        )}

                        {transcripts[appointment.id] && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">Transcription</h5>
                            <div className="p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
                              {transcripts[appointment.id]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}