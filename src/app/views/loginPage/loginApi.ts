import { INewUserRegistration, IUserSignIn } from "./types";

const urlLocalUsersCreate ='http://localhost:8082/users';
const urlLocalSignIn = 'http://localhost:8082/signin';


export const createUser = async (user:INewUserRegistration) => {
        const rawResponse = await fetch(urlLocalUsersCreate, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          });
         const content = await rawResponse.json();
        console.log(content);
}


export const loginUser = async (user:IUserSignIn) => {
    const rawResponse = await fetch(urlLocalSignIn, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    return rawResponse.json();
}
