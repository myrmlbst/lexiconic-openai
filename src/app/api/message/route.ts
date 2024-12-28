import { MessageArraySchema } from "@/lib/validators/message";
import { ChatGPTMessage } from "@/lib/openai-stream";
import { chatbotPrompt} from "@/app/helpers/constants/chatbot-prompt";

export async function POST(req: Request) {
    {/*
    // test for endpoint
    console.log("endpoint works")
    */}

    const {messages} = await req.json()

    // parse messages against schema we created to validate input
    const parsedMessages = MessageArraySchema.parse(messages)

    const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => ({
        role: message.isUserMessage ? 'user' : 'system',
        content: message.text,
    }))

    outboundMessages.unshift({
        role: 'system',
        content: chatbotPrompt
    })
}