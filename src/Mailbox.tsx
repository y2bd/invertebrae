import * as React from "react";
import { string } from "prop-types";

export type Message = {
    type: string;
    payload: any;
}

export type Receiver = (message: Message) => void;

export type MailboxContextProps = {
    sendMessage(message: Message): void;
    register(messageType: string, mailboxId: string, receiver: Receiver): void;
    unregister(messageType: string, mailboxId: string): void;
}

export const MailboxContext = React.createContext<MailboxContextProps>({
    sendMessage: () => void 0,
    register: () => void 0,
    unregister: () => void 0
})

const Mailbox: React.FC = React.memo((props) => {
    const [receivers, setReceivers] = React.useState<Record<string, Record<string, Receiver>>>({});

    const sendMessage = React.useCallback((message: Message) => {
        console.log("sent", message);

        if (receivers[message.type]) {
            for (const key of Object.keys(receivers[message.type])) {
                receivers[message.type][key](message);
            }
        }
    }, [receivers]);

    const register = React.useCallback((messageType: string, mailboxId: string, receiver: Receiver) => {
        console.log("registering", mailboxId, messageType);
        
        setReceivers(oldReceivers => ({
            ...oldReceivers,
            [messageType]: {
                ...oldReceivers[messageType],
                [mailboxId]: receiver
            },
        }));
    }, [setReceivers]);

    const unregister = React.useCallback((messageType: string, mailboxId: string) => {
        console.log("unregistering", mailboxId, messageType);
        
        if (receivers[messageType] && receivers[messageType][mailboxId]) {
            delete receivers[messageType][mailboxId];

            if (Object.keys(receivers[messageType]).length <= 0) {
                delete receivers[messageType];
            }
        }

        setReceivers(receivers);
    }, [receivers, setReceivers]);

    const contextProps = React.useMemo<MailboxContextProps>(() => ({
        sendMessage,
        register,
        unregister
    }), [sendMessage, register]);
    
    return (
        <MailboxContext.Provider value={contextProps} >
            {props.children}
        </MailboxContext.Provider>
    );
});

export default Mailbox;