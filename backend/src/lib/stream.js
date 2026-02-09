import { StreamChat } from "stream-chat";
import {StreamClient} from "@stream-io/node-sdk"
import { ENV } from "./env.js"

const apikey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if( !apikey || !apiSecret )
{
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing");
    
}

export const streamClient = new StreamClient(apikey,apiSecret)//will be used for video calls
export const chatClient = StreamChat.getInstance(apikey,apiSecret);//will be used for chat features

export const upsertStreamUser = async(userData) => {
    
    try {
        await chatClient.upsertUser(userData)
       console.log("Stream user upserted succesfully:",userData);
       
    } catch (error) {
       console.error("Error upserting Stream user:", error) 
    }
}


export const deleteStreamUser = async(userId) => {
    
    try {
        await chatClient.deletetUser(userId)
        console.log("strem user deleted successfull:",userId);
        
    } catch (error) {
       console.error("Error deleting Stream user:", error) 
    }
}

//todo:add another ,ethod to generateToken