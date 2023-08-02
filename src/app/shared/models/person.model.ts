export class Person{
    id: number;
    name: string | null;
    age: number;
    hobbyId: number ;
    hobbyDescription: string | null;

    

    constructor(id: number,  name: string, age: number, hobbyDescription: string | null, hobbyId: number ){
        this.id = id;
        this.name = name;
        this.age = age;
        this.hobbyId = hobbyId;
        this.hobbyDescription = hobbyDescription;
    }
} 