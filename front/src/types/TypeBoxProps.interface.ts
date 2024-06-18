import { SendJsonMessage } from "react-use-websocket/dist/lib/types"
import Message from "./Message.interface"

interface TypeBoxProps {
    chatMessageArray: Message[],
    setChatMessageArray: React.Dispatch<React.SetStateAction<Message[]>>,
    sendJsonMessage: SendJsonMessage,
    typeRef: React.MutableRefObject<string>
}

export default TypeBoxProps