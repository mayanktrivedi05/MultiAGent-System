import React, { useEffect } from 'react'
import Navbar from './Navbar'
import MesageList from './MesageList'
import ChatInput from './ChatInput'
import { useSelector } from 'react-redux'
import getMessages from '../features/getMessages'
import { useDispatch } from 'react-redux'
import { setArtifacts, setMessages } from '../redux/messageSlice'
function ChatArea() {
  const dispatch = useDispatch()
  const { selectedConversation } = useSelector(state => state.conversation)
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return
      if (selectedConversation.title == "New Chat") return
      if (selectedConversation) {
        const messages = await getMessages(selectedConversation._id)

        console.log(messages)
        dispatch(setMessages(messages))
        const ltestartifactmessage = Array.isArray(messages) ? [...messages].reverse().find(msg => msg?.artifacts && msg?.artifacts.length > 0) : null
        dispatch(setArtifacts(ltestartifactmessage?.artifacts || []))
      }
    }
    fetchMessages()
  }, [selectedConversation?._id])
  return (
    <div className='flex-1 flex flex-col min-w-0'>
      <Navbar />
      <MesageList />
      <ChatInput />
    </div>
  )
}

export default ChatArea