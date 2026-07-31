import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import MessagesBubble from './MessagesBubble'
import LoadingAnimation from './LoadingAnimation'
import { useRef } from 'react'
function MesageList() {
   const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const bottomRef=useRef(null)
    useEffect(() => {
        requestAnimationFrame(()=>{
            bottomRef?.current.scrollIntoView({behavior:"smooth",block:"end"})
        })
    },[messages?.length,isLoading])

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {messages.length==0 || !selectedConversation?(
            <div className='h-full flex flex-col items-center justify-center gap-4 text-center'>
                        <div className='flex flex-col gap-1.5'>
            <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'>CortexAI</h1>
            <p className='text-[15px] font-semibold tracking-tight text-slate-400'>How can I help you?</p>
            <p className='text-[13px] text-slate-600 max-w-[260px] leading-relaxed'>Ask me anything - code,ideas,explanation, or just a quick question.</p>
        </div>
        <div className='flex flex-wrap justify-center gap-2 mt-1'>
            {["Write a Netflix Clone ","Explain Redis","Build a Dashboard"].map((s)=>(
                <button className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-2 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                    {s}
                </button>
            ))}
        </div>
            </div>
        ):
        <div className='space-y-5'>
            {messages?.map((msg,i)=>(
                    <div >
                        <MessagesBubble role={msg?.role} content={msg?.content} images={msg.images || []}/>
                    </div>
            ))}
           {isLoading && <LoadingAnimation/>}
        </div>
        }
        <div ref={bottomRef}/>
    </div>
  )
}

export default MesageList