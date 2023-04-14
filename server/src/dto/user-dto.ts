export class UserDto {
    constructor(
        public email: string,
        public id: string,
        public is_activated: boolean
    ){
        this.email = email;
        this.id=id;
        this.is_activated=is_activated;
    }
}

