import { MessageArraySchema } from "@/lib/validators/message";
import { ChatGPTMessage, OpenAIStreamPayload, OpenAIStream } from "@/lib/openai-stream";
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

    // create readable openai stream
    const payload: OpenAIStreamPayload = {
        model: 'gpt-3.5-turbo',
        messages: outboundMessages,
        temperature: 0.4,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 150,
        stream: true,
        n: 1
    }

    const stream = await OpenAIStream(payload)

    return new Response(stream)
}