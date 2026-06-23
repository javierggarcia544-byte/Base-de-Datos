import { Response } from "express";
import { ManagerError } from "./manager.error";
import { HttpStatus } from "./http-status";

export class HandlerError {
    static error (error: unknown, res: Response){
        if(error instanceof ManagerError){
            res.status(error.code).json({
                status: error.status,
                Message: error.message,
            })
            return
        }

        res.json(500).json({status: HttpStatus.INTERNAL_SERVER_ERROR, message: "INTERNAL_SERVER_ERROR"})
    }
}