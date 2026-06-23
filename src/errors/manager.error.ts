import { HttpStatus } from "./http-status";

export class ManagerError extends Error{
    constructor(
        public message: string,
        public status: keyof typeof HttpStatus,
        public code: HttpStatus

    ){super(status);}
        

    static badRedquest (message: string){
        return new ManagerError(message, "BAD_REQUEST", 400)

    }
    
    static formbiden (message: string){
        return new ManagerError(message, "FORBIDEN", 401)
    }

    static notFound(message: string){
        return new ManagerError(message, "NOT_FOUND", 404)
    }

    static internalServerError(message: string){
        return new ManagerError(message, "INTERNAL_SERVER_ERROR", 500)

        
    }
}