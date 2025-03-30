import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Buttons";
import { Input } from "./Input";

export function CreateContentModal({open, onClose}) {
    return <div>
        {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center">
            <div className="flex flex-col justify-center">
                <span className="bg-white opacity-100 p-4 rounded">
                    <div className="flex justify-end">
                        <div className="cursor-pointer" onClick={onClose}>
                            <CrossIcon />
                        </div>
                    </div>
                    <div>
                        <Input placeholder={"Title"} />
                        <Input placeholder={"Link"} />
                    </div>
                    <Button variant="primary" text="Submit" />
                </span>
            </div>
        </div>}
    </div>
}

