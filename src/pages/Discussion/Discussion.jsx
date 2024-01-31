import { useEffect, useState } from "react"

export default function Discussion() {
    const [messages,setMessages] = useState([])
    const [discussionMessage, setDiscussionMessage] = useState('')
    const username = localStorage.getItem('name')

    async function fetchMessages() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/discussion/`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
              });
    
            const data = await response.json()
            if (response.ok) {
                setMessages(data)
            } else {
                console.log("Error loading messages")
            } 
        } catch (error) {
            console.error("Error fetching messages", error)
        }
    }

    async function createMessage() {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/discussionadd/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    message: discussionMessage,
                    name: username
                }),
            })

            if (response.ok) {
                console.log("Message sent successfully")
                fetchMessages()
                setDiscussionMessage('')
            } else {
                console.log("Error sending message")
            }
        } catch (error) {
            console.error("Error sending message", error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages()
        }, 2000)

        return () => clearInterval(interval)
        // eslint-disable-next-line
    }, [])


  return (
    <div>
        <h3>Discussion</h3>
        <ul>
            {messages.map((message, index) => (
                <li key={index}>
                    <p>{message.name}-</p>
                    <p>{message.message}</p>
                    </li>
            ))}
        </ul>
        <div>
            <input type="text"
            value={discussionMessage}
            onChange={(e) => setDiscussionMessage(e.target.value)}
            />
            <button onClick={createMessage}>Send</button>
        </div>
    </div>
  )
}
