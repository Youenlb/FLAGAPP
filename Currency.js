class Currency
{
    static all_currencies = {};
    constructor(code,name,symbol)
    {
        this._code = code;
        this._name = name;
        this._symbol = symbol;
    }

    //Accesseur + mutateur des propriétés
    get code()
    {
        return this._code;
    }
    set code(code)
    {
        this._code = code;
    }
    get name()
    {
        return this._name;
    }
    set name(name)
    {
        this._code = name;
    }
    get symbol()
    {
        return this._symbol;
    }
    set symbol(symbol)
    {
        this._code = symbol;
    }

    toString()
    {
        return "Code : "+this.code+"\nName : "+this.name+"\nSymbol : "+this.symbol+"\n\n";
    }
}         