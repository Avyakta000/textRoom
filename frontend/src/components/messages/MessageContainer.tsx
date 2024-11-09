import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { LuGithub } from "react-icons/lu";
// import { RiDiscordLine } from "react-icons/ai";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { RiDiscordLine } from "react-icons/ri";


const MessageContainer = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="w-full flex flex-col h-full">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <span className="text-center bg-gray-900 py-2 font-semibold text-white block">
            Text Room
          </span>
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 px-4 py-2 mb-2">
            <span className="label-text">To:</span>{" "}
            <span className="text-gray-200 font-bold">
              {selectedConversation.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
      {/* Footer with Links */}
      <div className="flex justify-center items-center bg-gradient-to-r from-gray-900 to-blue-900 text-white font-semibold py-2 px-4 shadow-md mt-auto">
        <Link
          to={"https://github.com/Avyakta000"}
        //   target="_blank"
        //   rel="noopener noreferrer"
          className="flex items-center mx-2"
        //   aria-label="GitHub"
        >
          <LuGithub className="text-2xl" />
          {/* <span className="ml-1">GitHub</span> */}
        </Link>
        <Link
          to={"https://discord.com/invite/"}
        //   target="_blank"
        //   rel="noopener noreferrer"
          className="flex items-center mx-2"
        //   aria-label="Discord"
        >
          <RiDiscordLine className="text-2xl" />
          {/* <span className="ml-1">Discord</span> */}
        </Link>
      </div>
        </>
      )}
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();

  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
          <p>Welcome 👋 {authUser?.fullName} ❄</p>
          <p>Select a chat to start messaging</p>
          <MessageCircle className="text-3xl md:text-6xl text-center" />
        </div>
      </div>
      {/* Footer with Links */}
      <div className="flex justify-center items-center bg-gradient-to-r from-gray-900 to-blue-900 text-white font-semibold py-2 px-4 shadow-md mt-4">
        <Link
          to={"https://github.com/Avyakta000"}
        //   target="_blank"
        //   rel="noopener noreferrer"
          className="flex items-center mx-2"
        //   aria-label="GitHub"
        >
          <LuGithub className="text-2xl" />
          {/* <span className="ml-1">GitHub</span> */}
        </Link>
        <Link
          to={"https://discord.com/invite/"}
        //   target="_blank"
        //   rel="noopener noreferrer"
          className="flex items-center mx-2"
        //   aria-label="Discord"
        >
          <RiDiscordLine className="text-2xl" />
          {/* <span className="ml-1">Discord</span> */}
        </Link>
      </div>
    </>
  );
};
