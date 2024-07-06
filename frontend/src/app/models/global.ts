export class Global{
    //message
    public static genericError:string="Error del servidor intentelo mas tarde";
    public static unauthroried: string="You are not authorized person to access this page."
    //regex
    public static nameRegex: string = "[A-Z]*"
    public static namesRegex: string = "[A-Z\\s]*"
    public static datesId:string ="[a-zA-Z0-9]*"
    public static datesNumber:string ="[0-9]*"
    public static emailRegex:string ="[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"
    public static contacNumberRegex:string ="^[0-9]{9,10}$"

    public static error :string = "error"
    //HTTP
    public static apiUrl:string="http://127.0.0.1:8000/api"
}