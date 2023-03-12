class Language
{
    static all_languages = {};

    constructor(iso639_2,name)
    {
        this._iso639_2 = iso639_2;
        this._name = name;
    }

    //Accesseur + mutateur des propriétés
    get iso639_2()
    {
        return this._iso639_2;
    }
    set iso639_2(iso639_2)
    {
        this._iso639_2 = iso639_2;
    }
    get name()
    {
        return this._name;
    }
    set name(name)
    {
        this._name = name;
    }
    toString()
    {
        return "Name : "+this.name+"\nIso639_2 : "+this.iso639_2+"\n\n";
    }
}