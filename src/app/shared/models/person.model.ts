export class Person{
    id: number;
    name: string | null;
    age: number;
    hobbyId: number ;
    hobbyDescription: string | null;
    lastModified: Date | null;

    

    constructor(id: number,  name: string, age: number, hobbyDescription: string | null, hobbyId: number, lastModified: Date | null ){
        this.id = id;
        this.name = name;
        this.age = age;
        this.hobbyId = hobbyId;
        this.hobbyDescription = hobbyDescription;
        this.lastModified = lastModified;
    }
} 