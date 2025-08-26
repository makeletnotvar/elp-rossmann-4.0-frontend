export const fixUser = (user: User) => {
    let nextUser = {...user};
    
    if(!nextUser.label){
        nextUser.label = nextUser.username;
    }

    return nextUser;
}