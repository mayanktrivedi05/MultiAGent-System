import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, Zap, Image, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import sendMessage from '../features/sendMessage'
import { addMessages, setArtifacts, setMessages , setIsLoading} from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'
import { setUserData } from '../redux/userSlice.js'
import { useRef } from 'react'
import { useEffect } from 'react'
function ChatInput() {
    const [selectedAgent, setselectedAgent] = useState("Auto")
    const { selectedConversation } = useSelector(state => state.conversation)
    const [value, setValue] = useState("")
    const { messages,isLoading } = useSelector(state => state.message)
    const { userData } = useSelector(state => state.user)
    const [selectedFile,setSelectedFile]=useState(null)
    const [listning,setlistening]=useState(false)
    const recognitionRef = useRef(null);

useEffect(() => {
   const speechRecognition=window.speechRecognition||window.webkitSpeechRecognition 
   if(!speechRecognition){
       return
   }
   const recognition = new speechRecognition()
   recognition.continuous = true
   recognition.interimResults = true
   recognition.lang="en-US"
   recognition.onresult = (event) => {
       let transcript=""
       for(let index=event.resultIndex;index<event.results.length;index++){
           transcript+=event.results[index][0].transcript
       }
      setValue(transcript)
   }
   recognition.onend=()=>{
       setlistening(false)
   }
   recognitionRef.current=recognition
},[])
const toggleMic = () => {
    if(!recognitionRef.current){
        alert("Your browser does not support speech recognition.")
        return;
    }
    if (listning) {
        recognitionRef.current.stop()
        setlistening(false)
    } else {
        recognitionRef.current.start()
        setlistening(true)
    }
}





    const fileRef=useRef(null)
    const dispatch = useDispatch()
    const handleSendMessage = async () => {
        const promptText = value.trim()
        if (!promptText && !selectedFile) return

        dispatch(setIsLoading(true))
        let conversation = selectedConversation
        if (!conversation) {
            const conv = await createConversation()
            dispatch(setSelectedConversation(conv))
            dispatch(addConversation(conv))
            conversation = conv
        }

        const titleText = (promptText || selectedFile?.name || "Chat").slice(0, 40)
        if (!conversation?.title || conversation?.title.toLowerCase().includes("new chat")) {
            await updateConversation({ id: conversation?._id, title: titleText })
            dispatch(setConvTitle({ conversationId: conversation?._id, title: titleText }))
            conversation = { ...conversation, title: titleText }
        }

        const formData = new FormData()
        formData.append("prompt", promptText)
        formData.append("conversationId", conversation?._id)
        formData.append("agent", selectedAgent.toLowerCase())
        if (selectedFile) {
            formData.append("file", selectedFile)
        }
        dispatch(addMessages({ role: "user", content: promptText }))
        setValue("")
        const data = await sendMessage(formData)
        dispatch(setIsLoading(false))
        setSelectedFile(null)
        if (data) {
            dispatch(setArtifacts(data.artifacts || []))
            dispatch(addMessages({ role: "assistant", content: data?.answer, images: data?.images }))
            if (data.credits !== undefined && userData) {
                dispatch(setUserData({ ...userData, credits: data.credits }))
            }
            console.log(data)
        } else {
            dispatch(addMessages({ role: "assistant", content: "⚠️ Request failed. Please check the server logs." }))
        }
    }

    const agents = [
        {
            id: "auto",
            icon: Zap,
            label: "Auto"
        },
        {
            id: "chat",
            icon: MessageSquare,
            label: "Chat"
        },
        {
            id: "coding",
            icon: Code2,
            label: "Coding"
        },
        {
            id: "pdf",
            icon: FileText,
            label: "PDF"
        },
        {
            id: "ppt",
            icon: Presentation,
            label: "PPT"
        },
        {
            id: "vision",
            icon: ImageIcon,
            label: "Vision"
        },
        {
            id: "search",
            icon: Globe,
            label: "Search"
        }
    ]

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if ((value.trim() || selectedFile) && !isLoading) {
                handleSendMessage()
            }
        }
    }

    return (

        <div className='w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]'>
            <div className='flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3'>
                <div className='flex w-[80%] gap-2 pr-2 flex-wrap'>
                    {agents.map((agent) => {
                        const isActive = selectedAgent === agent.label
                        const Icon = agent.icon

                        return (
                            <div key={agent.id} onClick={() => setselectedAgent(agent.label)}
                                className={`flex-shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${isActive ? "bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]" : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07] "}`}>
                                <Icon size={14} className={isActive ? "text-white" : "text-slate-500"} />
                                {agent.label}
                            </div>
                        )
                    })}
                </div>

     {selectedFile && 
     <div className='my-3'>
        <div className='inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2'>
                        {
                            selectedFile.type==="application/pdf"?<FileText size={20} className='text-red-400'/>:selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className='w-10 h-10 rounded-xl object-cover mt-3'/>
                        }
                         <div>
            <p className='text-xs text-white'>
                {selectedFile?.name}
            </p>
            <p className='text-[10px] text-slate-500'>
                {Math.ceil((selectedFile?.size || 0) / 1024)} KB
            </p>
            
        </div>
        <button className='ml-2'>
                <X size={16} className='text-slate-500 hover:text-white' onClick={() => {setSelectedFile(null); fileRef.current.value = ""}} />
            </button>
        </div>
       
    </div>}


                <textarea placeholder='Ask Anything...'
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={value}
                    className='w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50' rows={3} />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>

<input type='file' accept='.pdf,image/*'  hidden ref={fileRef} onChange={(e) => {
    const file = e.target.files[0]
    if (file) {
        setSelectedFile(file)
    }
}}/>



                        <button className='flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent  cursor-pointer' onClick={()=>fileRef.current.click()}>
                            <Paperclip size={16} />
                        </button>
                        <button onClick={toggleMic} className={`flex items-center justify-center w-8 h-8 rounded-lg  border border-transparent  transition-all duration-150   cursor-pointer ${listning ? "bg-red-500 text-white" : "text-slate-600 hover:bg-white/[0.05]"}`}>
                            {listning ? <Mic size={16}/> :<MicOff size={16}  />}
                        </button>
                    </div>
                    <button
                        disabled={(!value.trim() && !selectedFile) || isLoading}
                        onClick={handleSendMessage}
                        className={`flex items-center transition-all duration-150 justify-center w-8 h-8 rounded-lg border-none cursor-pointer ${(value.trim() || selectedFile) && !isLoading ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : "bg-white/[0.05] text-slate-600 cursor-not-allowed"}`}>
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatInput